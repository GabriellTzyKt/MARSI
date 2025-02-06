import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				customGold: '#d0ba4a', 
				customYellow: '#c1a411',
				customKrem: '#f9d48b',
				customRed: '#FF565D',
				customDarkYellow : '#C1A411',
				customOrange : '#FF8303',
				customSlate: '#DDE1E6'
			  },
			fontFamily: {
				lato: ['Lato', 'sans-serif'],
			},
		}
	},

	plugins: [typography, forms]
} satisfies Config;
