"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class ZipCode extends Model {
		toJSON() {
			return {
				...this.get(),
				createdAt: undefined,
				updatedAt: undefined,
			};
		}
	}
	ZipCode.init(
		{
			zip_code: DataTypes.STRING,
			name: DataTypes.STRING,
			latitude: DataTypes.FLOAT,
			longitude: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: "ZipCode",
		}
	);
	return ZipCode;
};
