"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EventRegister extends Model {
		static associate(models) {
			EventRegister.belongsTo(models.Event, {
				foreignKey: "event_id",
			});
			EventRegister.belongsTo(models.User, {
				foreignKey: "register_by",
				as: "registrant",
			});
		}

		static async checkIfUserRegistered(eventId, userId) {
			const event = await this.findOne({
				where: {
					event_id: eventId,
					register_by: userId,
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
			register_by: {
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
