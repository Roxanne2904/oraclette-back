const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const functions = require("../utils/functions");
dotenv.config();

module.exports = () => async (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({ error: "No token" });
	}
	let token = await functions.removeBearerFromToken(req.headers.authorization);

	if (token) {
		try {
			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			const userId = await functions.getUserId(token);
			res.userId = userId;
			return next();
		} catch (err) {
			return res.status(401).json({
				message: "Invalid token",
			});
		}
	} else {
		return res.status(401).json({ error: "No token" });
	}
};
