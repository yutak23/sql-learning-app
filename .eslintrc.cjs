/* eslint-env node */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'plugin:vuetify/recommended',
		'eslint:recommended',
		'airbnb-base',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-custom-alias': {
				alias: {
					'@': './src'
				},
				extensions: ['.js', '.vue']
			}
		}
	},
	rules: {
		'import/no-extraneous-dependencies': 'off'
	}
};
