const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");
const EventManagementController = require("../../controllers/EventManagement");
const isParticipant = require("../../middlewares/isParticipant");
const isAuthor = require("../../middlewares/isAuthor");
const isMessageOwner = require("../../middlewares/isMessageOwner");
const verifyToken = require("../../middlewares/verifyToken");
const EventManagementRouter = express.Router();

/**
 * @typedef {object} EventRegisterBody
 * @property {number} eventId - eventId
 */
/**
 * @typedef {object} EventRegisterData
 * @property {string} status - eventRegister status - enum:awaiting, accepted, refused, banned
 * @property {number} event_id - eventRegister event_id
 * @property {number} register_by - eventRegister register_by
 * @property {number} register_by - eventRegister register_by
 * @property {string} updatedAt - eventRegister updatedAt
 * @property {string} createdAt - eventRegister createdAt
 */
/**
 * @typedef {object} EventRegisterResponse200
 * @property {string} message - message
 * @property {EventRegisterData} data - eventRegister data
 */
/**
 * @typedef {object} EventRegisterResponse400
 * @property {string} error - bad request
 */
/**
 * @typedef {object} EventRegisterResponse401
 * @property {string} error - unauthorized
 */
/**
 * @typedef {object} EventRegisterResponse409
 * @property {string} error - user is already registered for this event
 */

/**
 * POST /eventManagement
 * @summary Participate to an event
 * @tags EventManagement
 * @security BearerAuth
 * @param {EventRegisterBody} request.body.required - request body
 * @returns {EventRegisterResponse200} 200 - user has been registered for this event
 * @returns {EventRegisterResponse401} 401 - unauthorized
 * @returns {EventRegisterResponse400} 400 - bad request
 * @returns {EventRegisterResponse409} 409 - user is already registered for this event
 */
EventManagementRouter.post(
	"/",
	verifyToken(),
	errorHandler(EventManagementController.joinEvent)
);

/**
 * @typedef {object} EventRegisterDeleteResponse200
 * @property {string} message - user has been correctly deleted from this event
 */
/**
 * @typedef {object} EventRegisterDeleteResponse409
 * @property {string} error - user has already been deleted from this event
 */

/**
 * DELETE /eventManagement
 * @summary Leave an event
 * @tags EventManagement
 * @param {EventRegisterBody} request.body.required - event body object
 * @security BearerAuth
 * @returns {EventRegisterDeleteResponse200} 200 - user has been correctly deleted from this event
 * @returns {EventRegisterResponse401} 401 - Unauthorized
 * @returns {EventRegisterResponse400} 400 - Bad request
 * @returns {EventRegisterDeleteResponse409} 409 - user has already been deleted from this event
 */
EventManagementRouter.delete(
	"/",
	verifyToken(),
	isParticipant(),
	errorHandler(EventManagementController.leaveEvent)
);

/**
 * @typedef {object} EventRegisterAcceptResponse200
 * @property {string} message - user has been accepted
 */
/**
 * @typedef {object} EventRegisterAcceptResponse409
 * @property {string} error - user has already been accepted
 */

/**
 * PATCH /eventManagement/{eventId}/accept/{userId}
 * @summary Accept a user to an event
 * @tags EventManagement
 * @param {number} eventId.path.required - event identify
 * @param {number} userId.path.required - user identify
 * @security BearerAuth
 * @returns {EventRegisterAcceptResponse200} 200 - user has been accepted
 * @returns {EventRegisterResponse400} 400 - Bad request
 * @returns {EventRegisterResponse401} 401 - Unauthorized
 * @returns {EventRegisterResponse404} 404 - User is not registered for this event
 * @returns {EventRegisterAcceptResponse409} 409 - user has already been accepted
 */
EventManagementRouter.patch(
	"/:eventId/accept/:userId",
	verifyToken(),
	isAuthor(),
	errorHandler(EventManagementController.acceptUser)
);
/**
 * @typedef {object} EventRegisterRefuseResponse200
 * @property {string} message - user has been accepted
 */
/**
 * @typedef {object} EventRegisterRefuseResponse409
 * @property {string} error - user has already been accepted
 */
/**
 * PATCH /eventManagement/{eventId}/refuse/{userId}
 * @summary Refuse a user to an event
 * @tags EventManagement
 * @param {number} eventId.path.required - event identify
 * @param {number} userId.path.required - user identify
 * @security BearerAuth
 * @returns {EventRegisterRefuseResponse200} 200 - User has been refused
 * @returns {EventRegisterResponse400} 400 - Bad request
 * @returns {EventRegisterResponse401} 401 - Unauthorized
 * @returns {EventRegisterResponse404} 404 - User is not registered for this event
 * @returns {EventRegisterRefuseResponse409} 409 - user has already been refused
 */
EventManagementRouter.patch(
	"/:eventId/refuse/:userId",
	verifyToken(),
	isAuthor(),
	errorHandler(EventManagementController.refuseUser)
);
/**
 * @typedef {object} EventRegisterBanResponse200
 * @property {string} message - user has been accepted
 */
/**
 * @typedef {object} EventRegisterBanResponse409
 * @property {string} error - user has already been accepted
 */
/**
 * PATCH /eventManagement/{eventId}/ban/{userId}
 * @summary Ban a user to an event
 * @tags EventManagement
 * @param {number} eventId.path.required - event identify
 * @param {number} userId.path.required - user identify
 * @security BearerAuth
 * @returns {EventRegisterBanResponse200} 200 - User has been banned
 * @returns {EventRegisterResponse400} 400 - Bad request
 * @returns {EventRegisterResponse401} 401 - Unauthorized
 * @returns {EventRegisterResponse404} 404 - User is not registered for this event
 * @returns {EventRegisterBanResponse409} 409 - user has already been banned
 */
EventManagementRouter.patch(
	"/:eventId/ban/:userId",
	verifyToken(),
	isAuthor(),
	errorHandler(EventManagementController.banUser)
);

module.exports = { EventManagementRouter };
