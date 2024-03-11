const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");
const userController = require("../../controllers/User");
const UserRouter = express.Router();

// Schemas

/**
 * @typedef {object} UserData
 * @property {number} id - user id
 * @property {string} firstname - user firstname
 * @property {string} lastname - user lastname
 * @property {string} email - user email
 * @property {string} birthdate - user birthdate
 * @property {string} gender - user gender - enum:female,male,nonbinary
 * @property {boolean} is_admin - If user is admin - false
 */

/**
 * @typedef {object} UserResponse200
 * @property {string} message - response message
 * @property {UserData} data - user data
 */

/**
 * @name UserError
 * @description Error object
 * @typedef {object} UserError
 * @property {string} message - error message
 */

/**
 * @typedef {object} UserEventsSuccess - Success response
 * @property {string} message - A success message
 * @property {UserEventDataSuccess} data - data
 */

/**
 * @typedef {object} UserEventDataSuccess - User data
 * @property {number} totalEvents - Total events
 * @property {Array<Event>} events - User events
 */

// Routes

/**
 * GET /users/events
 * @summary Get user events
 * @tags Users
 *
 * @security BearerAuth
 *
 * @param {number} page.query - page number
 * @param {number} eventPerPage.query - event per page
 *
 * @returns {UserEventsSuccess} 200 - A list of user events
 * @returns {UserError} 401 - Token is missing or malformed
 * @returns {UserError} 404 - No user events found
 */
UserRouter.get("/events", errorHandler(userController.getUserEvents));

/**
 * GET /users
 * @summary Get one user
 * @tags Users
 * @security BearerAuth
 * @returns {UserResponse200} 200 - An object of user
 * @returns {UserResponse204} 204 - No User Found but request ok
 * @returns {UserResponse500} 500 - Error
 */
UserRouter.get("/", errorHandler(userController.getUserById));

/**

 * @typedef {object} updateUser
 * @property {string} firstname - user firstname
 * @property {string} lastname - user lastname
 */

/**
 * PATCH /users
 * @summary Update one user
 * @tags Users
 * @security BearerAuth
 * @param {updateUser} request.body.required - user body object
 * @returns {UserResponse200} 200 - An object of user
 */
UserRouter.patch("/", errorHandler(userController.updateUser));

module.exports = { UserRouter };
