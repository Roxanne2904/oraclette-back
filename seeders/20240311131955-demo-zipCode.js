"use strict";

const fs = require("fs");
const csv = require("csv-parser");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		console.log("Le fichier va être chargé.");

		const filePath = "/app/seeders/communes-departement-region.csv";
		const data = [];

		// Créer un flux de lecture et parser le CSV
		const readStream = fs.createReadStream(filePath).pipe(csv());

		// Collecter les données
		for await (const row of readStream) {
			if (
				row.latitude !== "" &&
				!isNaN(row.latitude) &&
				row.longitude !== "" &&
				!isNaN(row.longitude)
			) {
				data.push({
					zip_code: row.code_postal,
					name: row.nom_commune,
					latitude: parseFloat(row.latitude),
					longitude: parseFloat(row.longitude),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}

		// Effectuer l'insertion en bloc après la fin de la lecture
		try {
			await queryInterface.bulkInsert("ZipCodes", data);
			console.log(`${data.length} lignes insérées.`);
		} catch (error) {
			console.error("Erreur lors de l'exécution du seeder :", error);
		}
	},

	async down(queryInterface, Sequelize) {},
};
