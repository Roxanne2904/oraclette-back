const { Event } = require("../models");

module.exports = () => async (req, res, next) => {
	try {
		const eventId = req.params.eventId ?? req.params.event_id; // au cas où mais bon ...
		const isEventAuthor = await Event.checkIfEventAuthor(
			eventId,
			res.currentUser.id
		);

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
