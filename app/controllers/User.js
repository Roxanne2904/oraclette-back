const { User, Event } = require("../models");
const functions = require("../utils/functions");

module.exports = {
	async getAllUsers(req, res) {
		const users = await User.findAll();
		if (!users) {
			throw new Error("no users found");
		}
		return res.json(users);
	},
	async getUserById(req, res) {
		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res
				.status(401)
				.json({ error: "Access token is missing in headers" });
		}

		const accessToken = bearerToken.split("Bearer")[1]?.trim();

		if (!accessToken) {
			return res
				.status(401)
				.json({ error: "Access token is missing or malformed" });
		}

		const userId = await functions.getUserId(accessToken);
		const user = await User.findByPk(userId);

		if (!user) throw new Error("No user found");

		return res.json({
			message: "User data has been recovered",
			data: user,
		});
	},
	async updateUser(req, res) {
		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res
				.status(401)
				.json({ error: "Access token is missing in headers" });
		}

		const accessToken = bearerToken.split("Bearer")[1]?.trim();

		if (!accessToken) {
			return res
				.status(401)
				.json({ error: "Access token is missing in the request body" });
		}

		const tokenId = await functions.getUserId(accessToken);
		const user = await User.findByPk(tokenId);

		if (!user) throw new Error("No user found");

		await user.update(req.body);

		return res.json({
			message: "User data has been updated",
			data: user,
		});
	},
	async getUserEvents(req, res) {
		const page = req.query.page ? parseInt(req.query.page) : 1;
		const eventPerPage = req.query.limit ? parseInt(req.query.limit) : 10;
		const offset = (page - 1) * eventPerPage;

		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.status(401).json({
				message: "Access token is missing in headers",
			});
		}

		const accessToken = bearerToken.split("Bearer")[1]?.trim();

		if (!accessToken) {
			return res.status(401).json({
				message: "Access token is missing or malformed",
			});
		}

		const userId = await functions.getUserId(accessToken);

		let events = await Event.findAll({
			include: [
				{
					model: User,
					as: "participants",
					where: { id: userId },
				},
			],
		});

		events.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		events.sort((a, b) => {
			if (a.status === "closed") {
				return 1;
			}
			if (b.status === "closed") {
				return -1;
			}
			return 0;
		});

		const totalEvents = events.length;

		events = events.slice(offset, offset + eventPerPage);

		if (!events || events.length === 0) {
			return res.status(404).json({
				message: "No user events found",
			});
		}

		return res.json({
			message: "User events have been recovered",
			data: {
				totalEvents,
				events: events,
			},
		});
	},
};
