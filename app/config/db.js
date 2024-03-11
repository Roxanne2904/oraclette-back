const debug = require("debug")("SQL:log");
const mariadb = require("mariadb");
const dotenv = require("dotenv");

dotenv.config();
const dbConfig = {
	host: process.env.DEV_DB_HOST,
	user: process.env.DEV_DB_USERNAME,
	password: process.env.DEV_DB_PASSWORD,
	database: process.env.DEV_DB_NAME,
	connectionLimit: 10,
};

const pool = mariadb.createPool(dbConfig);

module.exports = {
	originalClient: pool,
	async query(...params) {
		debug(...params);
		return this.originalClient.query(...params);
	},
};
