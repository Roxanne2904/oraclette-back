const { User } = require("../models");
const { getUserId } = require("../utils/functions.js");

async function checkGender(req, res, next) {
	try {
		const { authorization: bearer } = req.headers;

		if (bearer) {
			const accessToken = bearer.split("Bearer")[1]?.trim();

			const userId = await getUserId(accessToken);

			const { gender } = await User.findByPk(userId);

			req.query.gender = gender;
		}

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.status(401).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
}

module.exports = { checkGender };
