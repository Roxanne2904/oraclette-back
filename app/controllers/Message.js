const Message = require("../models").Message;
const { User, Event } = require("../models");

module.exports = {
	async addMessage(req, res) {
		const message = await Message.create({
			message: req.body.message,
			event_id: parseInt(req.params.eventId),
			writed_by: res.userId,
		});

		if (!message) {
			return res.status(404).json({
				error: "Message registration failed",
			});
		}

		return res.json({
			message: "Message correctly added",
			data: message,
		});
	},
	async updateMessage(req, res) {
		const updateMessage = await Message.update(
			{ message: req.body.message },
			{
				where: {
					id: req.params.commentId,
				},
			}
		);

		if (!updateMessage) {
			return res.status(404).json({
				error: "Message update failed",
			});
		}

		return res.json({
			message: "Message correctly updated",
			data: updateMessage,
		});
	},
	async disabledMessage(req, res) {
		const disabledMessage = await Message.update(
			{ disabled: true },
			{
				where: {
					id: req.params.commentId,
				},
			}
		);

		if (!disabledMessage) {
			return res.status(404).json({
				error: "Message disabled failed",
			});
		}

		return res.json({
			message: "Message correctly disabled",
			data: disabledMessage,
		});
	},
	async getMessages(req, res) {
		const messages = await Message.findAll({
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
					attributes: ["id", "created_by"],
				},
			],
		});

		if (!messages) {
			return res.status(404).json({
				error: "Messages not found",
			});
		}

		return res.json({
			message: "Messages correctly found",
			data: messages,
		});
	},
};
