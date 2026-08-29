export default {
	// Full path, not an alias. `layout: 'page'` would resolve to src/_includes/page.njk,
	// which does not exist — the layout aliases the starter used to register were the only
	// thing making the short name work.
	layout: 'layouts/page.njk',

	// Slugs are written out in front matter rather than computed. Directory-data permalink
	// functions run before eleventyComputed resolves, so a computed slug arrives undefined,
	// the guard below fires, and the warning names the template rather than the data file
	// that caused it.
	permalink: function ({ slug, page }) {
		if (!slug) {
			console.warn(`Warning: No slug found for ${page.inputPath}`);
			return false;
		}

		try {
			const normalizeSlug = this.slugify(slug);
			return `/${normalizeSlug}/`;
		} catch (error) {
			console.error(`Error generating permalink for ${page.inputPath}:`, error);
			return false;
		}
	}
};
