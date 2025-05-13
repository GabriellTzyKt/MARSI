import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import plugin from "tailwindcss/plugin";

const Myclass = plugin(function ({addUtilities}){
	addUtilities({
		".my-rotate-y-180":{
			transform: "rotateY(180deg)"
		},
		".my-rotate-x-180":{
			transform: "rotateX(180deg)"
		},
		".preserve-3d":{
			transformStyle: "preserve-3d"
		},
		".perspective":{
			perspective:"1000px"
		},
		".backface-hidden":{
			backfaceVisibility : "hidden"
		},
	})
})

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
				customSlate: '#DDE1E6',
				customBg2 : '#F9D48B',
				customOrange2 : '#FFA600'
			  },
			fontFamily: {
				lato: ['Lato', 'sans-serif'],
			},
		}
	},

	plugins: [typography, forms, Myclass]
} satisfies Config;
