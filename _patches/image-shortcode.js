// Patch: Baseline's `image` shortcode, re-registered wrapping the original.
//
// Wrapping is the only route that does not edit node_modules — the defaults are module
// constants, the shortcode takes no registration options, the function is not re-exported,
// and the package `exports` map blocks a deep import.
//
// Must be added after the Baseline plugin: `addPlugin` queues, and plugins run in
// registration order.

// The starter's own defaults. Nine renditions per source rather than twelve, and no
// `'auto'` — the full-size original, the most expensive encode of the set.
const WIDTHS = [650, 960, 1400];
const FORMATS = ['avif', 'webp', 'jpeg'];

/**
 * Markup of the right shape, without encoding anything.
 *
 * The pre-pass renders in `dryRun` and discards the HTML, but eleventy-img writes through
 * its own fs path, so every rendition is generated anyway. The content graph needs the
 * shape, not the renditions.
 */
function stub({ src = '', alt, caption, figure }) {
	const altText = alt == null ? '' : String(alt);
	const captionText = String(caption ?? '');
	const picture = `<picture><img src="${src}" alt="${altText}"></picture>`;

	if (figure === false || !captionText) return picture;
	return `<figure>${picture}<figcaption>${captionText}</figcaption></figure>`;
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function patchImageShortcode(eleventyConfig) {
	const baselineImage = eleventyConfig.universal.shortcodes.image;
	if (!baselineImage) {
		throw new Error('[patch/image-shortcode] Baseline image shortcode not registered — check plugin order');
	}

	// `async` on both paths — Nunjucks errors if an async shortcode returns synchronously.
	eleventyConfig.addAsyncShortcode('image', async function (options = {}) {
		if (process.env.BASELINE_PREPASS_ACTIVE === '1') return stub(options);

		// Baseline hardcodes a `sizes` that guesses at the layout. `auto` lets the browser
		// use the width the image is laid out at, and is valid because these load lazily.
		const loading = options.loading ?? 'lazy';
		const sizes = loading === 'lazy' ? 'auto' : '100vw';

		// `options` last, so an explicit value at a call site still wins.
		return baselineImage.call(this, { widths: WIDTHS, formats: FORMATS, sizes, ...options });
	});
}
