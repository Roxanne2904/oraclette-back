"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Log extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Log.belongsTo(models.User, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
				as: "user",
			});
		}
	}
	Log.init(
		{
			text: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Log",
		}
	);
	return Log;
};