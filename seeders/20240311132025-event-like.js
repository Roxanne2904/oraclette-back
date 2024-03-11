"use strict";
const { faker } = require("@faker-js/faker/locale/fr");
const { User, Event } = require("../app/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		try {
			const events = await Event.findAll({ attributes: ["id"] });
			const users = await User.findAll({ attributes: ["id"] });

			const eventIds = events.map((event) => event.id);
			const userIds = users.map((user) => user.id);

			const eventLikesData = [];

			for (let eventId of eventIds) {
				const numRegistrations = faker.number.int({
					min: 1,
					max: userIds.length,
				});

				const selectedUserIds = faker.helpers
					.shuffle(userIds)
					.slice(0, numRegistrations);

				for (let userId of selectedUserIds) {
					eventLikesData.push({
						event_id: eventId,
						liked_by: userId,
					});
				}
			}

			await queryInterface.bulkInsert("EventLikes", eventLikesData, {});
		} catch (error) {
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		try {
			await queryInterface.bulkDelete("EventLikes", null, {});
		} catch (error) {
			throw error;
		}
	},
};
