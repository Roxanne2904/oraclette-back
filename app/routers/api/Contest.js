const express = require("express");
const errorHandler = require("../../middlewares/errorHandler.js");
const contestController = require("../../controllers/Contest.js");
const verifyToken = require("../../middlewares/verifyToken.js");

const ContestRouter = express.Router();

// Schemas

/**
 * @typedef {object} ContestEvent
 * @description Contest event
 * @property {number} id
 * @property {string} image_name
 * @property {number} city
 * @property {number} date
 * @property {number} available_slot
 * @property {number} popularity_ratio
 * @property {number} is_liked_by_user
 */

/**
 * @typedef {object} ContestWinner
 * @description ContestWinner
 * @property {number} id - user identifier
 * @property {string} image_url - event image name
 * @property {UserData} creator - event creator
 */

/** ContestEventSuccess
 * @typedef {object} ContestEventSuccess
 * @property {Array<ContestEvent>} currentMonthEvents - An array of events
 */
/** ContestEventWinnerSuccess
 * @typedef {object} ContestEventWinnerSuccess
 * @property {ContestWinner} lastMonthEventWinner - Last month event winner
 */

/** Event object
 * @typedef {object} ContestEventId
 * @property {number} eventId.required - Event identifier
 */

/** Success object
 * @typedef {object} ContestSuccess
 * @property {string} message - success message
 */

/** Error object
 * @typedef {object} ContestError
 * @property {string} message - error message
 */

// Routes

/**
 * GET /contest
 * @summary Get current month events
 * @tags Contest
 * @security BearerAuth
 * @returns {ContestEventSuccess} 200 - current month events
 */
ContestRouter.get("/", verifyToken(), errorHandler(contestController.contest));

/**
 * GET /contest/winner
 * @summary Get last month event winner
 * @tags Contest
 * @returns {ContestEventWinnerSuccess} 200 - Last month event winner
 */
ContestRouter.get("/winner", errorHandler(contestController.contestWinner));

/**
 * POST /contest/like
 * @summary Like/unlike an event picture
 * @tags Contest
 *
 * @security BearerAuth
 *
 * @param {ContestEventId} request.body.required
 * @returns {ContestSuccess} 200 - Event liked/unliked
 * @returns {ContestError} 400 - Invalid event id
 * @returns {ContestError} 404 - Event not found
 */
ContestRouter.post(
	"/like",
	verifyToken(),
	errorHandler(contestController.like)
);

module.exports = { ContestRouter };
