const expressJSDocSwagger = require("express-jsdoc-swagger");
/* https://www.npmjs.com/package/express-jsdoc-swagger */
const options = {
	info: {
		version: "1.0.0",
		title: "O'raclette ",
		description: "O'raclette - Docs API",
	},
	servers: [
		{
			url: `http://localhost:${process.env.PORT_OUT}/api/v1`,
			description: "Development server",
		},
		{
			url: "https://api.oraclette.com/api/v1",
			description: "Production server",
		},
	],
	baseDir: __dirname,
	// On analyse tous les fichiers du projet
	filesPattern: ["../routers/**/*.js"],
	// URL où sera disponible la page de documentation
	swaggerUIPath: process.env.API_DOCUMENTATION_ROUTE,
	// Activation de la documentation à travers une route de l'API
	exposeApiDocs: true,
	apiDocsPath: "/api/docs",
	security: {
		BearerAuth: {
			type: "http",
			scheme: "bearer",
		},
	},
};

/**
 * Swagger middleware factory
 * @param {object} app Express application
 * @returns Express JSDoc Swagger middleware that create web documentation
 */
module.exports = (app) => expressJSDocSwagger(app)(options);
