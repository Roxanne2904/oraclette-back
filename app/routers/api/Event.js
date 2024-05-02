const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");
const eventController = require("../../controllers/Event");
const verifyToken = require("../../middlewares/verifyToken");
const { checkGender } = require("../../middlewares/checkGender.js");

const EventRouter = express.Router();

// Schemas

/** An Event is created with the following parameters
 * @typedef {object} Event
 * @property {number} id - event id
 * @property {string} description - event description
 * @property {string} adress - event address
 * @property {string} zip_code - event zip_code
 * @property {string} city - event city
 * @property {number} available_slot - event available_slots
 * @property {date} date - event date
 * @property {string} status - event status - enum:open,canceled,ended
 * @property {string} gender - user gender - enum:female,male,nonbinary
 * @property {string} image_url - event image URL
 * @property {number} user_id - Create by user id
 */

/** An Event is update with the following parameters
 * @typedef {object} EventUpdate
 * @property {string} description - event description
 * @property {string} adress - event address
 * @property {string} zip_code - event zip_code
 * @property {string} city - event city
 * @property {number} available_slot - event available_slots
 * @property {date} date - event date
 * @property {string} status - event status - enum:open,canceled,ended
 * @property {string} gender - user gender - enum:female,male,nonbinary
 * @property {string} base64_picture - Picture on base64
 * @property {number} user_id - Create by user_id
 */

/** An Event is created with the following parameters.
 * @typedef {object} EventCreate
 * @property {string} description.required - event description
 * @property {string} adress.required - event address
 * @property {string} zip_code.required - event zip_code
 * @property {string} city.required - event city
 * @property {number} available_slot.required - event available_slots
 * @property {date} date.required - event date
 * @property {"female" | "male" | "nonbinary"} gender - user gender
 */

/** Error object
 * @typedef {object} EventError
 * @property {string} message - error message
 */

/** Success object
 * @typedef {object} EventDetailSuccess
 * @property {string} message - success message
 * @property {EventDetail} data - event detail
 */

/** The detail of an event.
 * @typedef {object} EventDetail
 * @property {number} id - event id
 * @property {string} description - event description
 * @property {string} adress - event address
 * @property {string} zip_code - event zip_code
 * @property {string} city - event city
 * @property {number} available_slot - event available_slots
 * @property {date} date - event date
 * @property {string} status - event status -  enum:open,canceled,ended
 * @property {string} gender - user gender -  enum:female,male,nonbinary
 * @property {string} image_url - event image_url
 * @property {number} user_id - Create by user_id
 * @property {UserData} creator - event creator
 * @property {Array<UserData>} participants - event participants
 */

// Routes

/**
 * GET /events
 * @summary Get all events
 * @tags Events
 * @description Returns all events
 *
 * @security BearerAuth
 *
 * @param {string} city.query - Optional city
 * @param {string} latitude.query - Optional latitude (if inclute lon, require lat)
 * @param {string} longitude.query - Optional longitude (if inclute lat, require lon)
 * @param {number} page.query - Page number
 * @param {number} eventPerPage.query - Event per page
 * @param {string} gender.query - Event gender - enum:female,male,nonbinary
 *
 * @typedef {object} Success - Success response
 * @property {string} message - A success message
 * @property {Array<Event>} data - An array of events
 * @returns {Success} 200 - A success message and an array of events
 * @returns {EventError} 400 - Invalid filter param
 * @returns {EventError} 500 - Error
 */
EventRouter.get("/", errorHandler(eventController.index));

/**
 * GET /events/{id}
 * @summary Get an event
 * @tags Events
 *
 * @security BearerAuth
 *
 * @param {number} id.path.required - event identify
 *
 * @returns {EventDetailSuccess} 200 - A success message and an event
 * @returns {EventError} 400 - Missing or invalid event id
 * @returns {EventError} 404 - No event found
 */
EventRouter.get("/:id", verifyToken(), errorHandler(eventController.show));

/**
 * POST /events
 * @summary Create an event
 * @tags Events
 *
 * @security BearerAuth
 *
 * @param {EventCreate} request.body.required - event info
 *
 * @typedef {object} Success - Success response
 * @property {string} message - A success message
 * @property {EventCreate} data - Created event
 *
 * @returns {Success} 200 - A success message and the created event
 * @returns {EventError} 401 - Missing access token or user not found
 * @returns {EventError} 500 - Event creation failed
 */
EventRouter.post("/", verifyToken(), errorHandler(eventController.store));

/**
 * PATCH /events/{id}
 * @summary Update an event
 * @tags Events
 * @param {number} id.path.required - event identify
 * @param {EventUpdate} request.body.required - event info
 * @returns {object} 200 - An array of events
 * @returns {EventError} 204 - No events found message
 * @returns {EventError} 415 - Unsupported Media Type
 * @returns {EventError} 500 - Error
 */
EventRouter.patch("/:id", errorHandler(eventController.update));

/**
 * PUT /events/{id}/close
 * @summary Close an event
 * @tags Events
 * @param {number} id.path.required - event identify
 * @param {string} status - Event status (canceled OR ended)
 * @returns {object} 200 - An array of events
 * @returns {EventError} 204 - No events found message
 * @returns {EventError} 500 - Error
 */
EventRouter.put("/:id/close", errorHandler(eventController.delete));

/**
 * POST /events/{id}/like
 * @summary Like an event
 * @tags Events
 * @param {number} id.path.required - Event identify
 * @returns {object} 200 - OK
 * @returns {EventError} 204 - No events found message
 * @returns {EventError} 500 - Error
 */
EventRouter.post(
	"/:id/like",
	verifyToken(),
	errorHandler(eventController.like)
);

module.exports = { EventRouter };

/**
 * DELETE /events/{id}/like
 * @summary Dislike an event
 * @tags Events
 * @param {number} id.path.required - Event identify
 * @returns {object} 200 - OK
 * @returns {EventError} 204 - No events found message
 * @returns {EventError} 500 - Error
 */
EventRouter.delete(
	"/:id/like",
	verifyToken(),
	errorHandler(eventController.dislike)
);

module.exports = { EventRouter };
