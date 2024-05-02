"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Photo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Photo.belongsTo(models.Event, {
				foreignKey: "event_id",
				onDelete: "CASCADE",
				as: "event",
			});
			Photo.hasMany(models.PhotoLike, {
				foreignKey: "photo_id", // La clé étrangère dans PhotoLike pointant vers Photo
				as: "likes", // Un alias pour cette relation
				onDelete: "CASCADE", // Gère la suppression en cascade des likes si une photo est supprimée
			});
		}

		async getLikes() {
			return await sequelize.models.PhotoLike.findAll({
				where: { photo_id: this.id },
			});
		}

		async getIsLikedBy(user) {
			return await sequelize.models.PhotoLike.findOne({
				where: { photo_id: this.id, user_id: user.id },
			});
		}
	}
	Photo.init(
		{
			file_name: DataTypes.STRING,
			event_id: DataTypes.INTEGER.UNSIGNED,
		},
		{
			sequelize,
			modelName: "Photo",
		}
	);
	return Photo;
};
