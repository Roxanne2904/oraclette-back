const { ZipCode } = require("../models");
const { Op } = require("sequelize");

module.exports = {
	async index(req, res) {
		const searchTerm = req.body.city; // ou un autre paramètre de votre choix

		const ZipCodes = await ZipCode.findAll({
			where: {
				name: { [Op.like]: `%${searchTerm}%` }, // Remplacez 'name' par le champ approprié
			},
			limit: 5,
		});

		if (!ZipCodes || ZipCodes.length === 0) {
			return res.status(404).json({ message: "No ZipCodes found" });
		}

		return res.json(ZipCodes);
	},
};
