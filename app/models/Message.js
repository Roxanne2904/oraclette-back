const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Message extends Model {
		static associate(models) {
			Message.belongsTo(models.Event, {
				foreignKey: "event_id",
				onDelete: "CASCADE",
				as: "event",
			});
			Message.belongsTo(models.User, {
				foreignKey: "writed_by",
				onDelete: "CASCADE",
				as: "user",
			});
		}

		static async getEventLinkToThisMessage(messageId) {
			const message = await this.findByPk(messageId);
			if (message === null) {
				return null;
			}

			return message.event_id;
		}

		static async isMessageOwner(commentId, userId) {
			const message = await this.findOne({
				where: { id: commentId, writed_by: userId },
			});
			if (!message) return false;

			return true;
		}
	}

	Message.init(
		{
			message: DataTypes.TEXT,
			disabled: DataTypes.BOOLEAN,
			event_id: DataTypes.INTEGER,
			writed_by: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Message",
		}
	);

	return Message;
};
