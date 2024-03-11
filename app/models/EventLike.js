"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EventLike extends Model {
		static associate(models) {
			EventLike.belongsTo(models.Event, {
				foreignKey: "event_id",
			});
			EventLike.belongsTo(models.User, {
				foreignKey: "liked_by",
			});
		}
	}
	EventLike.init(
		{
			event_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
			},
			liked_by: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
			},
		},
		{
			sequelize,
			modelName: "EventLike",
			indexes: [
				{
					unique: true,
					fields: ["event_id", "liked_by"],
				},
			],
		}
	);
	return EventLike;
};
