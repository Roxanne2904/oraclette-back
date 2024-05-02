const { Message, User, Event } = require("../models");

module.exports = {
	async create(req, res) {
		return await Message.create({
			message: req.body.message,
			event_id: parseInt(req.params.eventId),
			user_id: res.currentUser.id,
		});
	},
	async update(req) {
		return await Message.update(
			{ message: req.body.message },
			{
				where: {
					id: req.params.commentId,
				},
			}
		);
	},
	async disabled(req) {
		return await Message.update(
			{ disabled: true },
			{
				where: {
					id: req.params.commentId,
				},
			}
		);
	},
	async get(req) {
		return await Message.findAll({
			where: {
				event_id: req.params.eventId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: {
						exclude: [
							"password",
							"provider",
							"provider_id",
							"password_reset_token",
							"createdAt",
							"updatedAt",
						],
					},
				},
				{
					model: Event,
					as: "event",
					attributes: ["id", "user_id"],
				},
			],
		});
	},
};
