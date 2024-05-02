const Message = require("../models").Message;

module.exports = () => async (req, res, next) => {
	try {
		const userId = res.currentUser.id;
		const commentId = req.params.commentId;

		const messageRetrieve = await Message.isMessageOwner(commentId, userId);

		if (!messageRetrieve) {
			return res.status(401).json({
				error: "You're not the author of this message",
			});
		} else {
			next();
		}
	} catch (e) {
		console.log(e);
	}
};
