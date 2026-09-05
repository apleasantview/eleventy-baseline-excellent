import settings from './settings.js';
import * as meta from './meta.js';

/**
 * Identity for Baseline's JSON-LD graph. Write `schema`, read `seo`.
 *
 * `organization` and `person` are reserved — Baseline builds the spine nodes and
 * wires the @ids. `null` means "not set" and is stripped.
 *
 * `pieces` takes raw schema.org nodes, passed through untouched. Normal cascade
 * key, but ignored under `eleventyComputed` — the graph is assembled first.
 */

// Swap which one is null to model the site as an organisation instead.
const isPerson = meta.siteType === 'Person';

export default {
	organization: isPerson
		? null
		: {
				'@type': 'Organization',
				name: settings.title,
				url: settings.url
			},

	person: isPerson
		? {
				'@type': 'Person',
				name: meta.author.name,
				url: settings.url,
				// No origin, no image — undefined is stripped before output.
				image: settings.url ? new URL(meta.author.avatar, settings.url).href : undefined
			}
		: null,

	pieces: []
};
