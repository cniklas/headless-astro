import { defineConfig, presetMini, transformerDirectives } from 'unocss'

/**
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */
export default defineConfig({
	theme: {
		breakpoints: {
			md: '48em',
			lg: '64em',
		},
	},

	// custom CSS
	// missing in presetMini
	rules: [
		[
			'sr-only',
			{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: 0,
				margin: '-1px',
				overflow: 'hidden',
				'clip-path': 'inset(50%)',
				'white-space': 'nowrap',
				'border-width': 0,
			},
		],
	],

	// https://unocss.dev/presets/mini
	presets: [presetMini({ dark: 'media' })],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
