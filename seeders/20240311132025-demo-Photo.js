"use strict";
const { faker } = require("@faker-js/faker/locale/fr");
const { User, Event } = require("../app/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		try {
			const allEvents = await Event.findAll();

			await queryInterface.bulkInsert(
				"Photos",
				Array.from({ length: 100 }).map(() => {
					const randomEvents = faker.helpers.arrayElement(allEvents);
					return {
						file_name: faker.number.int({ min: 1, max: 9 }) + ".png",
						event_id: randomEvents.id,
					};
				}),
				{}
			);
		} catch (error) {
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		try {
			await queryInterface.bulkDelete("Photos", null, {});
		} catch (error) {
			throw error;
		}
	},
};
