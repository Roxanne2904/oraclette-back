/**
 * Controller wrapper to manage errors
 * @param {object} controller a controller to execute iside a try… catch… block
 * @returns a controller as middleware function
 */
module.exports = (controller) => async (req, res, next) => {
	try {
		await controller(req, res, next);
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.status(401).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
			console.log(error);
		}
	}
};
