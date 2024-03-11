"use strict";
const { faker } = require("@faker-js/faker/locale/fr");
const { ZipCode } = require("../app/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		const allZipCodes = await ZipCode.findAll();

		// eslint-disable-next-line no-useless-catch
		try {
			await queryInterface.bulkInsert(
				"Events",
				Array.from({ length: 100 }).map(() => {
					const randomZipCode = faker.helpers.arrayElement(allZipCodes);

					return {
						description: faker.lorem.sentence(),
						adress: faker.location.streetAddress(),
						zip_code: randomZipCode.zip_code, // Utilisez le code postal sélectionné
						city: randomZipCode.name, // Utilisez le nom de la ville associé
						position_lat: randomZipCode.lat, // Utilisez la latitude associée
						position_lon: randomZipCode.lon, // Utilisez la longitude associée
						available_slot: faker.number.int({ min: 2, max: 25 }),
						date: faker.date.between({
							from: "2023-10-01T00:00:00.000Z",
							to: "2024-10-01T00:00:00.000Z",
						}),
						status: faker.helpers.arrayElement(["open", "canceled", "ended"]),
						gender: faker.helpers.arrayElement(["female", "male", "nonbinary"]),
						image_name:
							"raclette-party-" +
							faker.number.int({ min: 1, max: 12 }) +
							".webp",
						created_by: faker.number.int({ min: 1, max: 4 }),
					};
				}),
				{}
			);
		} catch (error) {
			throw error;
		}
	},

	async down(queryInterface) {
		try {
			await queryInterface.bulkDelete("Events", null, {});
		} catch (error) {
			throw error;
		}
	},
};
