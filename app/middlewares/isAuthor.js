const { Event } = require("../models");

module.exports = () => async (req, res, next) => {
	try {
		let eventId;

		if (req.params.eventId) {
			eventId = req.params.eventId;
		} else {
			eventId = req.params.event_id;
		}

		const isEventAuthor = await Event.checkIfEventAuthor(eventId, res.userId);

		if (isEventAuthor) {
			next();
		} else {
			return res.status(401).json({
				error: "You are not allowed to manage this event",
			});
		}
	} catch (e) {
		console.log(e);
	}
};
