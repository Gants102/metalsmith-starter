var metalsmith = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var highlighter = require('highlighter');
var templates  = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var browserSync = require('metalsmith-browser-sync');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
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
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv);

if (!argv.deploy) {
    browserSync({
        server: 'build',
        files: ['src/*.md', 'templates/*.jade', 'assets/*.*'],
        middleware: function (req, res, next) {
            build(next);
        }
    })
}

else {
    build(function () {
        console.log('Done building.');
    })
}

function build (callback) {
metalsmith(__dirname)
  .source('src')
  .destination('build')
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


  // Build everything!
  .build(function (err) {
    var message = err ? err : 'Build complete';
    console.log(message);
    callback();
        });
}
