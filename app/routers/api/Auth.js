const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");
const AuthController = require("../../controllers/Auth");
const passport = require("passport");
const jwtHelpers = require("../../helpers/jwt");
const AuthRouter = express.Router();

// Schemas

/**
 * @name RegisterUser
 * @description Register a new user
 * @typedef {object} RegisterUser
 * @property {string} firstname - user firstname
 * @property {string} lastname - user lastname
 * @property {string} email - user email
 * @property {string} birthdate - User birthdate
 * @property {string} password - user password
 * @property {string} gender - user gender - enum:female,male,nonbinary
 */

/**
 * @name LoginUser
 * @description Login a user
 * @typedef {object} LoginUser
 * @property {string} email.required - user firstname
 * @property {string} password.required - user password
 * @property {string} loginType - login type -  enum:local,google,facebook,instagram
 */

/**
 * @name Token
 * @description New access token
 * @typedef {object} Token
 * @property {string} access_token - new access token
 */

/**
 * @name AuthError
 * @description Error object
 * @typedef {object} AuthError
 * @property {string} message - error message
 */

// Routes

/**
 * POST /auth/signup
 * @summary Register a new user
 * @tags Auth
 *
 * @param {RegisterUser} request.body.required - user info
 * @typedef {object} AuthSuccess - Success response
 * @property {string} message - A success message
 * @property {Token} data - An access token
 *
 * @returns {AuthSuccess} 200 - A success message and an access token
 * @returns {AuthError} 400 - User registration failed
 */
AuthRouter.post("/signup", errorHandler(AuthController.register));

/**
 * GET /auth/google
 * @summary Register or login a user with Google
 * @tags Auth

 */
AuthRouter.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		const { access_token, refresh_token } = jwtHelpers.jwtTokens(req.user);

		res.cookie("refreshToken", refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		return res.redirect(process.env.FRONT_URL + access_token);
	}
);
/**
 * POST /auth/login
 * @summary Login a user
 * @tags Auth
 *
 * @param {LoginUser} request.body.required - user info
 * @typedef {object} AuthSuccess - Success response
 * @property {string} message - A success message
 * @property {Token} data - An access token
 *
 * @returns {AuthSuccess} 200 - A success message and an access token
 * @returns {AuthError} 401 - Invalid email or password
 */
AuthRouter.post("/login", errorHandler(AuthController.login));

/**
 * GET /auth/token
 * @summary Refresh Token
 * @tags Auth
 *
 * @typedef {object} AuthSuccess - Success response
 * @property {string} message - A success message
 * @property {Token} data - New access token
 *
 * @returns {AuthSuccess} 200 - A success message and an access token
 * @returns {AuthError} 403 - No refresh token provided
 */
AuthRouter.get("/token", errorHandler(AuthController.refreshToken));

module.exports = { AuthRouter };
