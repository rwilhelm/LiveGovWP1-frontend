// jshint esnext:true
var app = require('koa')();

app.use(require('koa-logger')());
app.use(require('koa-body')());

// serve static files
var serve = require('koa-static');
var mount = require('koa-mount');
app.use(serve('./public'));
app.use(mount('/bower_components', serve('./bower_components')));

// render templates
app.use(require('koa-views')('./views', {
  default: 'jade',
  // enable caching in production mode
  cache: process.env.NODE_ENV === 'production'
}));

// database
// in development mode make sure to establish a ssh tunnel to the server:
// $ ssh -L 3333:141.26.69.238:5432 rene@141.26.69.238 # add -Nf to let it detach quietly
// $ psql -h localhost -p 3333 -U postgres liveandgov
var pg = require ('koa-pg');
app.use(pg('pg://postgres:liveandgov@localhost' + (process.env.NODE_ENV === 'production' ? '' : ':3333') + '/liveandgov'));

var Router = require('koa-router');

// api routes are served with the prefix '/api' and respond in json
var api = new Router();
require('./routes/api')(api);
app.use(mount('/api', api.middleware()));

// jade templates are served w/o prefix
var routes = new Router();
require('./routes')(routes);
app.use(mount('/', routes.middleware()));

// production: port 4001, anything else: port 3001
app.listen(process.env.NODE_ENV === 'production' ? 4001 : 3001);

console.log('\n\nLIVE+GOV INSPECTION FRONT END RUNNING ON PORT ' +
  (process.env.NODE_ENV === 'production' ? 4001 : 3001) + ' IN ' +
  process.env.NODE_ENV.toUpperCase() + ' MODE.\n\n');
