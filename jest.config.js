module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/node_modules/**",
		"!**/vendor/**",
		"!**/jest.config.js",
		"!**/.eslintrc.js",
		"!**/migrations/**",
		"!**/seeders/**",
		"!**/coverage/**",
		"!**/config.js",
	],
};
