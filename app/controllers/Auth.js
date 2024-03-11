const { User } = require("../models");
const jwtHelpers = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

module.exports = {
	async register(req, res) {
		const existingUser = await User.findOne({
			where: { email: req.body.email },
		});

		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." });
		}

		req.body.password = await bcrypt.hash(req.body.password, saltRounds);

		const user = await User.create(req.body);

		if (!user) {
			res.status(400).json({ message: "User registration failed" });
		}

		const { access_token, refresh_token } = jwtHelpers.jwtTokens(user);

		res.cookie("refreshToken", refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		return res.json({
			message: "User registration successful",
			data: { access_token },
		});
	},
	async login(req, res) {
		try {
			passport.authenticate("local", async (err, user, info) => {
				if (err) {
					return res.status(500).json({ message: err });
				}

				if (!user) {
					return res.status(401).json({ message: info.message });
				}

				req.logIn(user, (err) => {
					if (err) {
						return res.status(500).json({ message: err });
					}

					const { access_token, refresh_token } = jwtHelpers.jwtTokens(user);

					res.cookie("refreshToken", refresh_token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
					});

					return res.json({
						message: "User login successful",
						data: { access_token },
					});
				});
			})(req, res);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
	async refreshToken(req, res) {
		const { cookie } = req.headers;

		if (!cookie) {
			return res.status(403).json({ message: "No refresh token provided." });
		}

		const regex = /refreshToken=([^;]+)/;
		const match = cookie.match(regex);
		const refreshToken = match[1];

		if (!refreshToken) {
			return res.status(403).json({ message: "Invalid refresh token." });
		}

		const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
			algorithms: ["HS256"],
		});

		if (!token) {
			return res.status(403).json({ message: "Invalid refresh token." });
		}

		const { access_token, refresh_token } = jwtHelpers.jwtTokens(token);

		res.cookie("refreshToken", refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		return res.json({
			message: "Token refreshed",
			data: { access_token },
		});
	},
};
