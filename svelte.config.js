import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					data: path.resolve('./src/data'),
					routes: path.resolve('./src/routes'),
					styles: path.resolve('./src/styles')
				}
			}
		},
		prerender: { default: true },
		paths: {
			base: process.env.NODE_ENV === 'development' ? '' : '/25th-parliament-meeting'
		}
	}
};

export default config;
