const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const functions = require("../utils/functions");
const { User } = require("../models");

dotenv.config();

module.exports =
	(options = { optionalToken: false }) =>
	async (req, res, next) => {
		if (req.headers.authorization) {
			let userId = null;
			try {
				const accessToken = req.headers.authorization
					.split("Bearer")[1]
					?.trim();
				userId = jwt.verify(
					accessToken,
					process.env.ACCESS_TOKEN_SECRET
				).userId;
			} catch (err) {
				return res.status(401).json({
					message: "Invalid token",
				});
			}

			try {
				res.currentUser = await User.findByPk(userId);
				return next();
			} catch (err) {
				console.log(err);
				return res.status(400).json({
					message: "Invalid user",
				});
			}
		}

		if (options.optionalToken) {
			return next();
		}

		return res.status(401).json({ error: "No token" });
	};
