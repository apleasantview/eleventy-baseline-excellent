/**
 * Site identity for Baseline.
 *
 * Default export only. A named export beside it makes the data cascade hand
 * templates the module namespace instead of this object, so `settings.url`
 * resolves to undefined in every template — silently, with a green build.
 */

const siteUrl = process.env.BASELINE_URL || 'http://localhost:8080/';
const absolute = path => new URL(path, siteUrl).href;

export default {
  title: 'Eleventy Excellent',
  description: 'Eleventy starter for building modern, resilient websites',
  url: siteUrl,

  // en_EN in meta.js, but og:locale wants the xx_XX form and Baseline derives it
  // from the locale, so give it the locale rather than the short code.
  defaultLanguage: 'en',
  defaultLocale: 'en-GB',

  seo: {
    // Must be absolute — Baseline passes the value through untouched.
    ogImage: {
      url: absolute('/assets/images/template/opengraph-default.jpg'),
      width: 1200,
      height: 630,
      alt: "Visible content: An Eleventy starter with CUBE CSS, Cube CSS, Every Layout, Design Tokens and Tailwind for uitility classes. A workflow for building modern and resilient websites, introduced by Andy Bell's project buildexcellentwebsit.es"
    }
  },

  head: {
    // theme-color is emitted from base.njk instead.
    meta: [
      {name: 'color-scheme', content: 'light dark'},
      {name: 'format-detection', content: 'telephone=no'},
      {name: 'fediverse:creator', content: '@lene@front-end.social'}
    ],

    link: [
      // Empty string, not `true`: attrs pass through to the serialiser raw, so
      // `crossorigin: true` would emit crossorigin="true".
      {
        rel: 'preload',
        href: '/assets/fonts/redhat/red-hat-display-v7-latin-900.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
      },
      {
        rel: 'preload',
        href: '/assets/fonts/atkinson/atkinson-hyperlegible-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
      },
      {rel: 'stylesheet', href: '/assets/css/global/index.css'},
      {rel: 'stylesheet', href: '/assets/css/local/index.css'},
      {rel: 'author', href: '/humans.txt'},
      {rel: 'me', href: 'https://front-end.social/@lene'},
      {rel: 'alternate', type: 'application/atom+xml', title: 'Atom Feed: Eleventy Excellent', href: '/feed.xml'},
      {rel: 'alternate', type: 'application/json', title: 'JSON Feed: Eleventy Excellent', href: '/feed.json'},
      {rel: 'icon', href: '/favicon.ico', sizes: 'any'},
      {rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml'},
      {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
      {rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials'}
    ],

    script: [{src: '/assets/js/index.js', defer: true, module: true}]
  }
};
