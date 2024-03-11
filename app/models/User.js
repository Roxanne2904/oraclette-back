"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Event, {
				through: models.EventRegister,
				foreignKey: "register_by",
				otherKey: "event_id",
			});
		}

		toJSON() {
			return {
				...this.get(),
				password: undefined,
				password_reset_token: undefined,
				provider: undefined,
				provider_id: undefined,
				createdAt: undefined,
				updatedAt: undefined,
			};
		}
	}
	User.init(
		{
			firstname: DataTypes.STRING,
			lastname: DataTypes.STRING,
			email: DataTypes.STRING,
			birthdate: DataTypes.DATEONLY,
			password: DataTypes.STRING,
			password_reset_token: DataTypes.STRING,
			provider: DataTypes.TEXT,
			provider_id: DataTypes.TEXT,
			gender: {
				type: DataTypes.ENUM("female", "male", "nonbinary"),
				allowNull: true,
			},
			is_admin: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "User",
		}
	);
	return User;
};
