import baseline, { config as baselineConfig } from '@apleasantview/eleventy-plugin-baseline';
import settings from './src/_data/settings.js';

// add yaml support
import { load as yamlLoad } from 'js-yaml';

//  config import
import { getAllPosts, showInSitemap, tagList } from './_config/collections.js';
import filters from './_config/filters.js';
import shortcodes from './_config/shortcodes.js';
import plugins from './_config/plugins.js';
import events from './_config/events.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	await eleventyConfig.addPlugin(baseline(settings));

	// ----------------------  ignore test files
	if (process.env.ELEVENTY_ENV != 'test') {
		eleventyConfig.ignores.add('src/content/system/pa11y.njk');
	}

	// ---------------------  Plugins pt.I
	eleventyConfig.addPlugin(plugins.htmlConfig);
	eleventyConfig.addPlugin(plugins.drafts);

	// --------------------- custom watch targets
	eleventyConfig.addWatchTarget('./src/_includes/**/*.{webc}');

	// --------------------- Passthrough File Copy

	// -- same path
	['src/assets/fonts/', 'src/assets/images/template'].forEach(path =>
		eleventyConfig.addPassthroughCopy(path)
	);

	eleventyConfig.addPassthroughCopy({
		// -- to root
		'src/assets/images/favicon/*': '/',

		// -- node_modules
		'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/components/`
	});

	// 	--------------------- Library and Data
	eleventyConfig.setLibrary('md', plugins.markdownLib);
	eleventyConfig.addDataExtension('yaml', contents => yamlLoad(contents));

	// No layout aliases. Front matter and the layout chain name real paths — an alias only
	// hides that `layout: 'page'` resolves to src/_includes/page.njk, which does not exist.

	// --------------------- Filters
	// Baseline already provides markdownify, relatedPosts, isString and the i18n filters,
	// and Eleventy core provides url and slugify. Only what the templates still need:
	eleventyConfig.addFilter('toIsoString', filters.toISOString);
	eleventyConfig.addFilter('formatDate', filters.formatDate);
	eleventyConfig.addFilter('markdownFormat', filters.markdownFormat);
	eleventyConfig.addFilter('splitlines', filters.splitlines);
	eleventyConfig.addFilter('shuffle', filters.shuffleArray);
	eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);

	// --------------------- Shortcodes
	// Not `image` — Baseline registers that one, and the call sites convert to its
	// options-object form.
	eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

	//	---------------------  Collections
	// showInSitemap is not a casualty of Baseline owning the sitemap: pa11y.njk iterates it
	// to build the a11y test config, and would silently test nothing without it.
	eleventyConfig.addCollection('allPosts', getAllPosts);
	eleventyConfig.addCollection('showInSitemap', showInSitemap);
	eleventyConfig.addCollection('tagList', tagList);

	// ---------------------  Plugins pt.II
	// Not HtmlBasePlugin — Baseline registers it, so htmlBaseUrl and
	// addPathPrefixToFullUrl are already available.
	eleventyConfig.addPlugin(plugins.rss);
	eleventyConfig.addPlugin(plugins.syntaxHighlight);

	eleventyConfig.addPlugin(plugins.webc, {
		components: ['./src/_includes/webc/**/*.webc'],
		useTransform: true
	});

	// Baseline registers the `image` shortcode but not the transform, both are wanted.
	// EXPERIMENT: skip the transform during Baseline's pre-pass.
	if (process.env.BASELINE_PREPASS_ACTIVE !== '1') {
		eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, {
			formats: ['webp', 'jpeg'],
			widths: ['auto'],
			htmlOptions: {
				imgAttributes: {
					loading: 'lazy',
					decoding: 'async'
				},
				pictureAttributes: {}
			}
		});
	}

	// --------------------- Events: before build
	eleventyConfig.on('eleventy.before', async () => {
		await events.buildAllCss();
		await events.buildAllJs();
	});

	// --------------------- Events: after build
	// Unconditional now that svgToJpeg writes into dist/ rather than src/.
	eleventyConfig.on('eleventy.after', events.svgToJpeg);
}

export const config = baselineConfig;
