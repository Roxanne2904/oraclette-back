"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EventRegister extends Model {
		static associate(models) {
			EventRegister.belongsTo(models.Event, {
				foreignKey: "event_id",
				as: "register",
			});
			EventRegister.belongsTo(models.User, {
				foreignKey: "user_id",
				as: "registrant",
			});
		}

		static async checkIfUserRegistered(eventId, userId) {
			const event = await this.findOne({
				where: {
					event_id: eventId,
					user_id: userId,
				},
			});

			if (event.status !== "accepted") {
				return false;
			}

			return true;
		}
	}
	EventRegister.init(
		{
			status: {
				type: DataTypes.ENUM("awaiting", "accepted", "refused", "banned"),
				allowNull: false,
				defaultValue: "awaiting",
			},
			event_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "Events",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
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
			modelName: "EventRegister",
		}
	);
	return EventRegister;
};
