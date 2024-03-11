"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			firstname: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			lastname: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(256),
				allowNull: false,
				unique: true,
				validate: {
					isEmail: {
						args: true,
						msg: "L'email fourni n'est pas valide.",
					},
				},
			},
			birthdate: {
				type: Sequelize.DATEONLY,
				allowNull: true,
				validate: {
					isDate: true,
				},
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			password_reset_token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			provider: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			provider_id: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			gender: {
				type: Sequelize.ENUM("female", "male", "nonbinary"),
				allowNull: true,
				defaultValue: "nonbinary",
			},
			is_admin: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
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
		await queryInterface.dropTable("Users");
	},
};
