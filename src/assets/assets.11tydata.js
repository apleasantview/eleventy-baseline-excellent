// Passthrough-copied assets are enumerated as collection members, and therefore as sitemap
// URLs — 49 of them here. Excluding them from collections also removes them from the
// sitemap; the coupling is implicit, and it is why this one key is the whole fix.
export default {
	eleventyExcludeFromCollections: true
};
