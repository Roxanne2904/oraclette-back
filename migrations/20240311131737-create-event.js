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
				validate: {
					notEmpty: true,
				},
			},
			adress: {
				type: Sequelize.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			zip_code: {
				type: Sequelize.STRING(5),
				allowNull: false,
				validate: {
					is: {
						args: ["^[0-9]{5}$"],
						msg: "Le format du code postal est invalide.",
					},
					notEmpty: true,
				},
			},
			city: {
				type: Sequelize.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			position_lat: {
				type: Sequelize.FLOAT,
				allowNull: true,
			},
			position_lon: {
				type: Sequelize.FLOAT,
				allowNull: true,
			},
			available_slot: {
				type: Sequelize.SMALLINT.UNSIGNED,
				allowNull: false,
				validate: {
					min: 1,
				},
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
				validate: {
					isDate: true,
					isAfterToday(value) {
						if (new Date(value) <= new Date()) {
							return this.createError({
								path: "date",
								message: "La date doit être postérieure à aujourd'hui.",
							});
						}
					},
				},
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
			image_name: {
				type: Sequelize.TEXT,
				allowNull: true,
				validate: {
					is: ["^[a-z]+$", "i"],
				},
			},
			created_by: {
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
