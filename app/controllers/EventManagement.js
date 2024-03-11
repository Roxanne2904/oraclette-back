const { EventRegister } = require("../models");

module.exports = {
	async joinEvent(req, res) {
		const joinEvent = await EventRegister.create({
			event_id: parseInt(req.body.eventId),
			register_by: res.userId,
			status: "awaiting",
		});
		if (!joinEvent) {
			return res.status(404).json({
				error: "EventRegister registration failed",
			});
		}

		return res.json({
			message: "You've been correctly registered",
			data: joinEvent,
		});
	},
	async leaveEvent(req, res) {
		console.log("Leaving Event");
		const leaveEvent = await EventRegister.destroy({
			where: {
				event_id: parseInt(req.body.eventId),
				register_by: res.userId,
			},
		});
		if (!leaveEvent) {
			return res.status(404).json({
				error: "EventRegister registration failed",
			});
		}

		return res.json({
			message: "You've been correctly unregistered",
			data: leaveEvent,
		});
	},
	async acceptUser(req, res) {
		const acceptUser = await EventRegister.update(
			{ status: "accepted" },
			{
				where: {
					event_id: parseInt(req.params.eventId),
					register_by: req.params.userId,
				},
			}
		);
		if (!acceptUser) {
			return res.status(404).json({
				error: "EventRegister registration failed",
			});
		}

		return res.json({
			message: "You've been correctly registered",
			data: acceptUser,
		});
	},
	async refuseUser(req, res) {
		const leaveEvent = await EventRegister.destroy({
			where: {
				event_id: parseInt(req.params.eventId),
				register_by: req.params.userId,
			},
		});
		if (!leaveEvent) {
			return res.status(404).json({
				error: "Error refusing user",
			});
		}

		return res.json({
			message: "You've correctly refused the user",
			data: leaveEvent,
		});
	},
	async banUser(req, res) {
		const banUser = await EventRegister.update(
			{ status: "banned" },
			{
				where: {
					event_id: parseInt(req.params.eventId),
					register_by: req.params.userId,
				},
			}
		);
		if (!banUser) {
			return res.status(404).json({
				error: "EventRegister registration failed",
			});
		}

		return res.json({
			message: "You've been correctly registered",
			data: banUser,
		});
	},
};
