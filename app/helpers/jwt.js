const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	jwtTokens(userdata) {
		let user;
		if (userdata.userId) {
			user = {
				userId: userdata.userId,
			};
		} else {
			user = { userId: userdata.id };
		}

		return {
			access_token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
				algorithm: "HS256",
				expiresIn: "1d",
			}),
			refresh_token: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
				algorithm: "HS256",
				expiresIn: "7d",
			}),
		};
	},
};
