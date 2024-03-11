"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Messages", {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			message: {
				type: Sequelize.TEXT,
				validate: {
					notEmpty: true,
				},
			},
			disabled: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
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
			writed_by: {
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
		await queryInterface.dropTable("Messages");
	},
};
