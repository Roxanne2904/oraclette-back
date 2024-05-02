"use strict";
const { faker } = require("@faker-js/faker/locale/fr");
const { User, Event } = require("../app/models");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		try {
			const events = await Event.findAll({ attributes: ["id", "user_id"] });
			const users = await User.findAll({ attributes: ["id"] });

			const eventIds = events.map((event) => event.id);
			const userIds = users.map((user) => user.id);

			const eventRegistersData = [];

			for (let eventId of eventIds) {
				const numRegistrations = faker.number.int({
					min: 1,
					max: userIds.length,
				});
				const selectedUserIds = faker.helpers
					.shuffle(userIds)
					.slice(0, numRegistrations);

				for (let userId of selectedUserIds) {
					const isCreator = events.find((event) => event.user_id === userId);

					if (isCreator) {
						eventRegistersData.push({
							status: faker.helpers.arrayElement(["accepted"]),
							event_id: eventId,
							user_id: userId,
						});
					} else {
						eventRegistersData.push({
							status: faker.helpers.arrayElement([
								"awaiting",
								"accepted",
								"refused",
								"banned",
							]),
							event_id: eventId,
							user_id: userId,
						});
					}
				}
			}

			await queryInterface.bulkInsert("EventRegisters", eventRegistersData, {});
		} catch (error) {
			throw error;
		}
	},
	async down(queryInterface) {
		try {
			await queryInterface.bulkDelete("EventRegisters", null, {});
		} catch (error) {
			throw error;
		}
	},
};
