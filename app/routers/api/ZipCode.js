const express = require("express");

const errorHandler = require("../../middlewares/errorHandler.js");
const ZipCodeController = require("../../controllers/ZipCode.js");

const ZipCodeRouter = express.Router();

// Schemas

/**
 * @typedef {object} ZipCode
 * @property {number} id - ZipCode id
 * @property {string} zip_code - ZipCode of the city
 * @property {string} name - City name
 * @property {number} longitude - Latitude of the city - float
 * @property {number} latitude - Longitude of the city - float
 */

/**
 * @typedef {object} ZipCodeError
 * @property {string} message - error message
 */

// Routes

/**
 * GET /similary
 * @summary Get all zip_code from partial city name
 * @tags ZipCode
 * @description Returns all ZipCodes
 *
 * @param {string} city.query - City
 *
 * @typedef {object} Success - Success response
 * @property {string} message - A success message
 * @property {Array<ZipCode>} data - An array of ZipCodes
 * @return {Success} 200 - A success message and an array of ZipCodes
 * @return {ZipCodeError} 500 - Error
 */
ZipCodeRouter.get("/similary", errorHandler(ZipCodeController.index));

module.exports = { ZipCodeRouter };
