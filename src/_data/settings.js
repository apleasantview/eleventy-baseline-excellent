// Imported by eleventy.config.js, so this runs before anything reads process.env.
import 'dotenv/config';

// Parse and scheme-check. Anything that is not an http(s) URL resolves to undefined.
const baseUrl = URL.parse(process.env.BASELINE_URL ?? process.env.URL ?? '');
const siteUrl = baseUrl?.protocol === 'https:' || baseUrl?.protocol === 'http:' ? baseUrl.href : undefined;
const absolute = (path) => (siteUrl ? new URL(path, siteUrl).href : undefined);

export default {
	// Identity
	title: "Eleventy Excellent",
	tagline: "A site built with Baseline and Eleventy Excellent",
	description: "Eleventy starter for building modern, resilient websites",

	// Canonical origin. Baseline warns if this is missing — it anchors canonicals,
	// sitemap entries and the structured-data graph. Must be an absolute http(s) URL.
	url: siteUrl,

	// Flip to true for staging origins to emit noindex site-wide.
	noindex: false,

	defaultLocale: "en",

	// Alias of defaultLocale, but the seo-graph reads this key directly. Without it,
	// `og:locale` and the graph's `inLanguage` are silently omitted.
	defaultLanguage: "en",

	// Site-wide head extras. Page front matter merges over these; meta dedupes on
	// name/property/charset, link on rel + hreflang + href.
	head: {
		link: [
			{ rel: 'stylesheet', href: '/assets/css/global/index.css' },
			{ rel: 'stylesheet', href: '/assets/css/local/index.css' },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: "author", href: "/humans.txt" },
			{
				rel: "preload",
				href: "/assets/fonts/redhat/red-hat-display-v7-latin-900.woff2",
				as: "font",
				type: "font/woff2",
				crossorigin: true
			},
			{
				rel: "preload",
				href: "/assets/fonts/atkinson/atkinson-hyperlegible-regular.woff2",
				as: "font",
				type: "font/woff2",
				crossorigin: true
			}
		],
		script: [{ src: '/assets/js/index.js', defer: true, module: true }],
		meta: [
			// Disable automatic detection and formatting of possible phone numbers.
			{ name: "format-detection", content: "telephone=no" },
			// Supports both schemes; the page author prefers light as the default.
			{ name: "color-scheme", content: "light dark" }
		],
		style: []
	},

	// Site-wide SEO defaults. Per-page `ogImage` in front matter overrides this;
	// posts get their generated card via posts.11tydata.js.
	seo: {
		ogImage: {
			url: absolute("/assets/images/template/opengraph-default.jpg"),
			width: 1200,
			height: 630,
			alt: "An Eleventy starter with CUBE CSS, Every Layout, design tokens and Tailwind utility classes. A workflow for building modern and resilient websites, introduced by Andy Bell's project buildexcellentwebsit.es"
		}
	}
};
