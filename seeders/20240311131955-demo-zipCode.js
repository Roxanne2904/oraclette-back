"use strict";

const fs = require("fs");
const csv = require("csv-parser");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		console.log("Le fichier va être chargé.");

		// https://www.data.gouv.fr/fr/datasets/communes-de-france-base-des-codes-postaux/
		const filePath = "/app/seeders/communes-departement-region.csv";
		const data = [];
		let isFirstLine = true;

		const readStream = await fs
			.createReadStream(filePath)
			.pipe(csv())
			.on("data", async (row) => {
				if (!isFirstLine) {
					if (
						row.latitude !== "" &&
						!isNaN(row.latitude) &&
						row.longitude !== "" &&
						!isNaN(row.longitude)
					) {
						try {
							await queryInterface.bulkInsert("ZipCodes", [
								{
									zip_code: row.code_postal,
									name: row.nom_commune,
									lat: parseFloat(row.latitude),
									lon: parseFloat(row.longitude),
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							]);
						} catch (error) {
							console.error("Erreur lors de l'exécution du seeder :", error);
						}
					}
				} else {
					isFirstLine = false;
				}
			});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
