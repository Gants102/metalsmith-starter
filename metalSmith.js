var metalsmith = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var highlighter = require('highlighter');
var templates  = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var stylus = require('metalsmith-stylus');
var autoprefixer = require('autoprefixer-stylus');
var links = require("metalsmith-relative-links");
var ancestry = require("metalsmith-ancestry");
var axis = require('axis');
var snippet = require('metalsmith-snippet');
var define = require('metalsmith-define');
var assets = require('metalsmith-assets');
var tag = require('html-tag');
var disqus = require('metalsmith-disqus');

module.exports = function metalSmith(){
return metalsmith(__dirname)
  .source('src')

  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(define({
    moment: require('moment')
  }))
  .use(links())
  .use(markdown({
    gfm: true,
    tables: true,
    highlight: highlighter()
  }))
  .use(snippet({
      "maxLength": 300
    }))
  .use(permalinks())
  .use(templates({
    engine: 'jade',
    directory: 'templates',
    tagGenerator({ tagName, attributes, content }) {
      return tag(tagName, attributes, content);
    }
  }))
  // discus comments
  //.use(disqus({
    //siteurl: 'https://antique-dealer-mariam-57100.netlify.com/',
    //shortname: 'london-to-istanbul'
  //}))
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  .use(stylus({
	compress: true,
	// Use the 'nib' plug-in
	use: [autoprefixer()],
  use: [axis()]
  }))
  .destination('build')
  .build(function(err,files){
      if (err){ console.log(err); }
    });
};
