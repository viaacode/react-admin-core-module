module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	ignorePatterns: [".eslintrc.js", "generated/*.ts"],
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				selector: "interface",
				format: ["PascalCase"],
				custom: {
					regex: "^I[A-Z]",
					match: false,
				},
			},
		],
		"sort-imports": [
			"warn",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
	},
};
