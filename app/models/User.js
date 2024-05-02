"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Event, {
				through: models.EventRegister,
				foreignKey: "user_id",
				otherKey: "event_id",
			});
			User.hasMany(models.PhotoLike, {
				foreignKey: "user_id", // La clé étrangère dans PhotoLike pointant vers User
				as: "photoLikes", // Un alias pour la relation, utilisé pour accéder via l'instance User
				onDelete: "CASCADE",
			});
			User.hasMany(models.Message, {
				foreignKey: "user_id",
				as: "messages",
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
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isEmail: {
						args: true,
						msg: "L'email fourni n'est pas valide.",
					},
				},
			},
			birthdate: {
				type: DataTypes.DATEONLY,
				allowNull: true,
				validate: {
					isDate: true,
				},
			},
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
