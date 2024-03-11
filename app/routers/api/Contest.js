const express = require("express");
const errorHandler = require("../../middlewares/errorHandler.js");
const contestController = require("../../controllers/Contest.js");
const verifyToken = require("../../middlewares/verifyToken.js");
const ContestRouter = express.Router();

// Schemas

/**
 * @name ContestEvent
 * @description Contest event
 * @typedef {object} ContestEvent
 * @property {number} id
 * @property {string} image_name
 * @property {number} city
 * @property {number} date
 * @property {number} available_slot
 * @property {number} popularity_ratio
 * @property {number} is_liked_by_user
 */

/**
 * @name ContestWinner
 * @description ContestWinner
 * @typedef {object} ContestWinner
 * @property {number} id - user identifier
 * @property {string} image_url - event image name
 * @property {UserData} creator - event creator
 */

/**
 * @name ContestEventSuccess
 * @description ContestEventSuccess
 * @typedef {object} ContestEventSuccess
 * @property {ContestWinner} lastMonthEventWinner - Last month event winner
 * @property {Array<ContestEvent>} currentMonthEvents - An array of events
 */

/**
 * @name ContestEventId
 * @description Event object
 * @typedef {object} ContestEventId
 * @property {number} eventId.required - Event identifier
 */

/**
 * @name ContestSuccess
 * @description Success object
 * @typedef {object} ContestSuccess
 * @property {string} message - success message
 */

/**
 * @name ContestError
 * @description Error object
 * @typedef {object} ContestError
 * @property {string} message - error message
 */

// Routes

/**
 * GET /contest
 * @summary Get last month event winner and current month events
 * @tags Contest
 *
 * @security BearerAuth
 *
 * @returns {ContestEventSuccess} 200 - Last month event winner and current month events
 */
ContestRouter.get("/", errorHandler(contestController.contest));

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
