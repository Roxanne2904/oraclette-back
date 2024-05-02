const messageService = require("../services/Message");

module.exports = {
	async addMessage(req, res) {
		const message = await messageService.create(req, res);

		if (!message) {
			return res.status(404).json({
				error: "Register this message has failed",
			});
		}

		return res.json({
			message: "This message has been correctly added",
		});
	},
	async updateMessage(req, res) {
		const updateMessage = await messageService.update(req);

		if (!updateMessage) {
			return res.status(404).json({
				error: "Update this message has failed",
			});
		}

		return res.json({
			message: "This message has been correctly updated",
		});
	},
	async disabledMessage(req, res) {
		const disabledMessage = await messageService.disabled(req);

		if (!disabledMessage) {
			return res.status(404).json({
				error: "Disable this message has failed",
			});
		}

		return res.json({
			message: "This message has been correctly deactivated",
		});
	},
	async getMessages(req, res) {
		const messages = await messageService.get(req);

		if (!messages) {
			return res.status(404).json({
				error: "Messages not found",
			});
		}

		return res.json({
			message: "Messages have been found correctly",
			data: messages,
		});
	},
};
