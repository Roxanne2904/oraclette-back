const express = require("express");

const errorHandler = require("../../middlewares/errorHandler");
const isMessageOwner = require("../../middlewares/isMessageOwner");
const isParticipant = require("../../middlewares/isParticipant");
const verifyToken = require("../../middlewares/verifyToken");
const MessageController = require("../../controllers/Message");
const isAuthor = require("../../middlewares/isAuthor");
const validateMessage = require("../../middlewares/message/validateMessage");
const MessageRouter = express.Router();

/** Message
 * @typedef {object} MessageBody
 * @property {string} message - event message
 */
/**
 * @typedef {object} MessageResponse400
 * @property {string} error - error message
 */
/**
 * @typedef {object} MessageResponse200
 * @property {string} message - message
 */

/**
 * POST /messages/{eventId}
 * @summary Add a message
 * @tags Messages
 * @param {number} eventId.path.required - event id
 * @param {MessageBody} request.body.required - message body object
 * @security BearerAuth
 * @returns {MessageResponse200} 200 - Ok
 * @returns {MessageResponse400} 400 - Bad request
 * @returns {MessageResponse400} 401 - Unauthorized
 * @returns {MessageResponse400} 404 - Not found
 * @returns {MessageResponse400} 409 - Conflict
 */
MessageRouter.post(
	"/:eventId",
	verifyToken(),
	isParticipant(),
	validateMessage(),
	errorHandler(MessageController.addMessage)
);

/**
 * PATCH /messages/{commentId}
 * @summary Update a message
 * @tags Messages
 * @param {number} commentId.path.required - comment id
 * @param {MessageBody} request.body.required - message body object
 * @security BearerAuth
 * @returns {MessageResponse200} 200 - Ok
 * @returns {MessageResponse400} 400 - Bad request
 * @returns {MessageResponse400} 404 - Not found
 * @returns {MessageResponse400} 409 - Conflict
 * @returns {MessageResponse400} 401 - Unauthorized
 */
MessageRouter.patch(
	"/:commentId",
	verifyToken(),
	isMessageOwner(),
	validateMessage(),
	errorHandler(MessageController.updateMessage)
);
/**
 * PATCH /messages/{eventId}/{commentId}/disabled
 * @summary disabled a message
 * @tags Messages
 * @param {number} eventId.path.required - event id
 * @param {number} commentId.path.required - comment id
 * @security BearerAuth
 * @returns {MessageResponse200} 200 - Ok
 * @returns {MessageResponse400} 400 - Bad request
 * @returns {MessageResponse400} 404 - Not found
 * @returns {MessageResponse400} 409 - Conflict
 * @returns {MessageResponse400} 401 - Unauthorized
 */
MessageRouter.patch(
	"/:eventId/:commentId/disabled",
	verifyToken(),
	isAuthor(),
	errorHandler(MessageController.disabledMessage)
);

/**
 * @typedef {object} UserMessage
 * @property {number} id - user id PK
 * @property {string} firstname - firstname
 * @property {string} lastname - lastname
 * @property {string} email - email
 * @property {string} birthdate - birthdate
 * @property {string} gender - gender
 * @property {boolean} is_admin - is admin
 */
/**
 * @typedef {object} EventMessage
 * @property {number} id - event id
 * @property {number} user_id - user id FK
 */

/**
 * @typedef {object} Message
 * @property {number} id - message id PK
 * @property {string} message - message
 * @property {string} createdAt - message creation date IsoString
 * @property {string} updatedAt - message update date IsoString
 * @property {boolean} disabled - message disabled
 * @property {number} user_id - user id FK
 * @property {number} event_id - event id FK
 * @property {UserMessage} user - user message
 * @property {EventMessage} event - event message
 */

/**
 * @typedef {object} MessageResponse200
 * @property {string} message - message text
 * @property {Message[]} data - message data
 */
/**
 * GET /messages/{eventId}
 * @summary Get messages
 * @tags Messages
 * @param {number} eventId.path.required - event id
 * @security BearerAuth
 * @returns {MessageResponse200} 200 - Ok
 * @returns {MessageResponse400} 400 - Bad request
 * @returns {MessageResponse400} 404 - Not found
 * @returns {MessageResponse400} 409 - Conflict
 * @returns {MessageResponse400} 401 - Unauthorized
 */
MessageRouter.get(
	"/:eventId",
	verifyToken(),
	isParticipant(),
	errorHandler(MessageController.getMessages)
);

module.exports = { MessageRouter };
