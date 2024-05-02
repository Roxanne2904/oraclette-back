"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Events", {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			adress: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			zip_code: {
				type: Sequelize.STRING(5),
				allowNull: false,
			},
			city: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			latitude: {
				type: Sequelize.FLOAT,
				allowNull: true,
			},
			longitude: {
				type: Sequelize.FLOAT,
				allowNull: true,
			},
			available_slot: {
				type: Sequelize.SMALLINT.UNSIGNED,
				allowNull: false,
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM("open", "canceled", "ended"),
				allowNull: true,
				defaultValue: "open",
			},
			gender: {
				type: Sequelize.ENUM("female", "male", "nonbinary"),
				allowNull: true,
				defaultValue: "nonbinary",
			},
			user_id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: "Users",
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
	async down(queryInterface) {
		await queryInterface.dropTable("Events");
	},
};
