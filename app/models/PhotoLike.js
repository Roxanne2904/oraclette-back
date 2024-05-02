"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PhotoLike extends Model {
		static associate(models) {
			PhotoLike.belongsTo(models.Photo, {
				foreignKey: "photo_id",
				onDelete: "CASCADE",
				as: "photo",
			});
			PhotoLike.belongsTo(models.User, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
				as: "user",
			});
		}
	}
	PhotoLike.init(
		{
			photo_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				references: {
					model: "Photo",
					key: "id",
				},
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				references: {
					model: "User",
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "PhotoLike",
			timestamps: true,
			updatedAt: "updatedAt",
			createdAt: "createdAt",
		}
	);
	return PhotoLike;
};
