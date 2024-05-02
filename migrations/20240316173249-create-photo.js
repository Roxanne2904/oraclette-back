"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Photos", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			file_name: {
				type: Sequelize.STRING,
			},
			event_id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: "Events",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Photos");
	},
};
