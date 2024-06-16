/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			fontFamily: {
				Jost: ['Jost', 'serif']
			}
		},
		colors: {
			darkblue: '#3D4F75',
			lightblue: '#637290',
			offwhite: '#F1F6F9'
		}
	},
	plugins: [require('flowbite/plugin')]
};
