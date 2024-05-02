module.exports = () => async (req, res, next) => {
	try {
		const maxLength = 1;
		const message = req.body.message;

		// Vérifier si le message est vide ou contient moins de 1 caractères
		if (!message || message.trim().length < maxLength) {
			return res
				.status(400)
				.json({
					error: `Le message doit contenir au moins ${maxLength} caractères`,
				});
		} else {
			// Si le message est valide, passer au middleware suivant
			next();
		}
	} catch (e) {
		console.log(e);
	}
};
