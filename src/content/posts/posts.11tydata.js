export default {
  layout: 'post',
  tags: 'posts',
  permalink: '/blog/{{ title | slugify }}/index.html',
  type: 'article',
  articleType: 'BlogPosting',
  ogImage: false
};
