import postcssImportExtGlob from 'postcss-import-ext-glob';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const isProd = process.env.ELEVENTY_ENV === 'production';

const plugins = [postcssImportExtGlob, postcssImport, tailwindcss, autoprefixer];

if (isProd) {
	plugins.push(cssnano);
}

export default {
	map: !isProd,
	plugins
};
