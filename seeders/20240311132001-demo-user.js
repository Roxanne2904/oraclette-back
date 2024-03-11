"use strict";
const bcrypt = require("bcrypt");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		try {
			await queryInterface.bulkInsert(
				"Users",
				[
					{
						firstname: "Guillaume",
						lastname: "FERARD",
						email: "guillaume.ferard@oclock.io",
						password: await bcrypt.hash("ilikeguigui", saltRounds),
						birthdate: new Date("1612-01-01"),
					},
					{
						firstname: "Peter",
						lastname: "Le Bricolot",
						email: "peter@bricoletout.fr",
						password: await bcrypt.hash("ilikepit", saltRounds),
						birthdate: new Date("1987-05-12"),
					},
					{
						firstname: "Leo",
						lastname: "Le Rigolo",
						email: "leo@oraclette.troll",
						password: await bcrypt.hash("ilikeponey", saltRounds),
						birthdate: new Date("1702-04-01"),
					},
					{
						firstname: "Baptiste",
						lastname: "Test",
						email: "test@mail.com",
						password: await bcrypt.hash("testtest", saltRounds),
						birthdate: new Date("2036-04-01"),
					},
					{
						firstname: "Roxanne",
						lastname: "Viette",
						email: "my@mail.fr",
						password: await bcrypt.hash("motdepasse", saltRounds),
						birthdate: new Date("2002-05-02"),
					},
				],
				{}
			);
		} catch (error) {
			throw error;
		}
	},
	async down(queryInterface) {
		try {
			await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
			await queryInterface.sequelize.query("TRUNCATE Users");
			await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
		} catch (error) {
			throw error;
		}
	},
};
