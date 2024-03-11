const EventRegister = require("../models").EventRegister;

module.exports = () => async (req, res, next) => {
	try {
		let eventId;
		if (req.params.eventId) {
			eventId = req.params.eventId;
		} else {
			eventId = req.body.eventId;
		}

		const isUserRegisterToEvent = await EventRegister.checkIfUserRegistered(
			eventId,
			res.userId
		);

		if (isUserRegisterToEvent) {
			next();
		} else {
			return res.status(404).json({
				error:
					"This event does not exist or you're not registered for this event",
			});
		}
	} catch (e) {
		console.log(e);
	}
};
