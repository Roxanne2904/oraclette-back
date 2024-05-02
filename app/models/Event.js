"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.belongsToMany(models.User, {
				through: models.EventRegister,
				foreignKey: "event_id",
				otherKey: "user_id",
				as: "participants",
			});

			Event.belongsTo(models.User, {
				as: "creator",
				foreignKey: "user_id",
			});

			Event.hasOne(models.Photo, {
				foreignKey: "event_id",
				as: "photo",
			});
		}

		// Efface les champs inutile dans le retour
		toJSON() {
			return {
				...this.get(),
				createdAt: undefined,
				updatedAt: undefined,
			};
		}

		async getPhoto() {
			return await sequelize.models.Photo.findOne({
				where: { event_id: this.id },
			});
		}

		static async checkIfEventAuthor(eventId, userId) {
			const event = await Event.findOne({
				where: {
					id: eventId,
					user_id: userId,
				},
			});

			if (event) {
				return true;
			}

			return false;
		}

		static init(attributes, options) {
			super.init(attributes, options);

			this.addHook("afterCreate", async (event) => {
				const userId = event.user_id;

				await event.addAuthorAsParticipants(userId, "accepted");
			});

			return this;
		}

		async addAuthorAsParticipants(userId, status) {
			const event = this;

			const eventRegister = await sequelize.models.EventRegister.create({
				event_id: event.id,
				user_id: userId,
				status: status,
			});

			return eventRegister;
		}
	}

	Event.init(
		{
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			adress: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			zip_code: {
				type: DataTypes.STRING(5),
				allowNull: false,
				validate: {
					notEmpty: true,
					is: {
						args: ["^[0-9]{5}$"],
						msg: "Le format du code postal est invalide.",
					},
				},
			},
			city: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			latitude: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			longitude: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			available_slot: {
				type: DataTypes.TINYINT.UNSIGNED,
				allowNull: false,
				validate: {
					min: 1,
				},
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				validate: {
					isDate: true,
					isAfterToday(value) {
						if (new Date(value) < new Date()) {
							// Lancer une erreur si la date est antérieur à aujourd'hui
							throw new Error("La date doit être postérieure à aujourd'hui.");
						}
					},
				},
			},
			status: {
				type: DataTypes.ENUM("open", "canceled", "ended"),
				allowNull: false,
				defaultValue: "open",
			},
			gender: {
				type: DataTypes.ENUM("female", "male", "nonbinary"),
				allowNull: true,
				defaultValue: "nonbinary",
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Event",
		}
	);

	return Event;
};
