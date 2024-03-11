const express = require("express");
const errorHandler = require("../../middlewares/errorHandler.js");
const ZipCodeController = require("../../controllers/ZipCode.js");
const ZipCodeRouter = express.Router();

// Schemas

/**
 * @name ZipCode
 * @description An ZipCode have the following parameters :
 * @typedef {object} ZipCode
 * @property {number} id - ZipCode id
 * @property {string} zip_code - ZipCode
 * @property {string} name - City name
 */

/**
 * @name ZipCodeError
 * @description Error object
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
 * @returns {Success} 200 - A success message and an array of ZipCodes
 * @returns {ZipCodeError} 500 - Error
 */
ZipCodeRouter.get("/similary", errorHandler(ZipCodeController.index));

module.exports = { ZipCodeRouter };
