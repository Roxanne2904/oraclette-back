"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("EventRegisters", {
			status: {
				type: Sequelize.ENUM("awaiting", "accepted", "refused", "banned"),
				allowNull: true,
				defaultValue: "awaiting",
			},
			event_id: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "Events",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			register_by: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable("EventRegisters");
	},
};
