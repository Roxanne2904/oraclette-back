const { EventRegister } = require("../models");

module.exports = {
	async create(req, res) {
		return await EventRegister.create({
			event_id: parseInt(req.body.eventId),
			user_id: res.currentUser.id,
			status: "awaiting",
		});
	},
	async destroy(req, res) {
		return await EventRegister.destroy({
			where: {
				event_id: parseInt(req.body.eventId),
				user_id: res.currentUser.id,
			},
		});
	},
	async accept(req) {
		return await EventRegister.update(
			{ status: "accepted" },
			{
				where: {
					event_id: parseInt(req.params.eventId),
					user_id: req.params.userId,
				},
			}
		);
	},
	async refuse(req) {
		return await EventRegister.destroy({
			where: {
				event_id: parseInt(req.params.eventId),
				user_id: req.params.userId,
			},
		});
	},
	async ban(req) {
		return await EventRegister.update(
			{ status: "banned" },
			{
				where: {
					event_id: parseInt(req.params.eventId),
					user_id: req.params.userId,
				},
			}
		);
	},
};
