export default {
	// content.11tydata.js sets `layout: 'layouts/page.njk'` for everything under src/content/.
	// The machine-output templates in here would inherit it and ship as full HTML pages —
	// robots.txt, feed.xml, feed.json, humans.txt, carbon.txt, _redirects and site.webmanifest
	// all with a doctype and a rendered head, on a green build.
	layout: false,

	// The same opt-out Baseline uses for its own synthetic sitemap pages. Skips page-context,
	// the SEO graph and the content graph. Page-context is what registers slugs into the
	// wikilink index, so these templates never claim a slug — which is why none of them needs
	// an invented `title` or `slug`, and why neither slug collision can happen here at all.
	_internal: true,

	// Hoisted: every template in here set this individually.
	eleventyExcludeFromCollections: true
};
