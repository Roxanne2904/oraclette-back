"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("EventLikes", {
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
			liked_by: {
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
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
		await queryInterface.addIndex("EventLikes", ["event_id", "liked_by"], {
			unique: true,
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable("EventLikes");
	},
};
