module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: "eslint:recommended",
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix", "window"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"max-len": ["error", { code: 120 }],
	},
};
