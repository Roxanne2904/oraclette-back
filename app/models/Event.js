"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.belongsToMany(models.User, {
				through: models.EventRegister,
				foreignKey: "event_id",
				otherKey: "register_by",
				as: "participants",
			});

			Event.belongsToMany(models.User, {
				through: models.EventLike,
				foreignKey: "event_id",
				otherKey: "liked_by",
				as: "likers",
			});

			Event.belongsTo(models.User, {
				as: "creator",
				foreignKey: "created_by",
			});
		}

		toJSON() {
			return {
				...this.get(),
				createdAt: undefined,
				updatedAt: undefined,
			};
		}

		static async checkIfEventAuthor(eventId, userId) {
			const event = await Event.findOne({
				where: {
					id: eventId,
					created_by: userId,
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
				const userId = event.created_by;

				await event.addAuthorAsParticipants(userId, "accepted");
			});

			return this;
		}

		async addAuthorAsParticipants(userId, status) {
			const event = this;

			const eventRegister = await sequelize.models.EventRegister.create({
				event_id: event.id,
				register_by: userId,
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
				validate: {
					notEmpty: true,
				},
			},
			adress: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			zip_code: {
				type: DataTypes.STRING(5),
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			city: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			position_lat: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			position_lon: {
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
			image_name: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			created_by: {
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
