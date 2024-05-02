"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("PhotoLikes", {
			photo_id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: "Photos",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
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
		await queryInterface.addConstraint("PhotoLikes", {
			fields: ["photo_id", "user_id"],
			type: "primary key",
			name: "photo_likes_primary_key", // Nom de la contrainte, optionnel mais recommandé
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("PhotoLikes");
	},
};
