import { defineConfig, envField } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
	integrations: [UnoCSS({ injectReset: true })],
	devToolbar: {
		enabled: false,
	},
	env: {
		schema: {
			KIRBY_URL: envField.string({ context: 'server', access: 'secret' }),
			SITE_TITLE: envField.string({ context: 'server', access: 'public' }),
		},
	},
})
