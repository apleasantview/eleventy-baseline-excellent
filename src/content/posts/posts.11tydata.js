export default {
	tags: 'posts',
	layout: 'layouts/post.njk',

	// Suppresses Baseline's site-default share card on posts.
	ogImage: '',
	type: 'article',
	articleType: 'BlogPosting',

	permalink: function ({ slug, page }) {
		if (!slug) {
			console.warn(`Warning: No slug found for ${page.inputPath}`);
			return false;
		}

		try {
			return `/blog/${this.slugify(slug)}/`;
		} catch (error) {
			console.error(`Error generating permalink for ${page.inputPath}:`, error);
			return false;
		}
	}
};
