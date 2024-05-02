const eventRegisterService = require("../services/EventRegister");

module.exports = {
	async joinEvent(req, res) {
		const joinEvent = await eventRegisterService.create(req, res);

		if (!joinEvent)
			return res.status(404).json({
				error: "EventRegister registration failed",
			});

		return res.json({
			message: "You've been correctly registered",
			data: joinEvent,
		});
	},
	async leaveEvent(req, res) {
		const leaveEvent = await eventRegisterService.destroy(req, res);

		if (!leaveEvent)
			return res.status(404).json({
				error: "EventRegister registration failed",
			});

		return res.json({
			message: "You've been correctly unregistered",
			data: leaveEvent,
		});
	},
	async acceptUser(req, res) {
		const acceptUser = await eventRegisterService.accept(req);

		if (!acceptUser)
			return res.status(404).json({
				error: "EventRegister registration failed",
			});

		return res.json({
			message: "You've been correctly registered",
			data: acceptUser,
		});
	},
	async refuseUser(req, res) {
		const leaveEvent = await eventRegisterService.destroy(req, res);

		if (!leaveEvent)
			return res.status(404).json({
				error: "Error refusing user",
			});

		return res.json({
			message: "You've correctly refused the user",
			data: leaveEvent,
		});
	},
	async banUser(req, res) {
		const banUser = await eventRegisterService.ban(req);

		if (!banUser)
			return res.status(404).json({
				error: "EventRegister registration failed",
			});

		return res.json({
			message: "You've been correctly registered",
			data: banUser,
		});
	},
};
