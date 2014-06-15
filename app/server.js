// jshint esnext:true
var app = require('koa')();

var compress = require('koa-compress');

var env = process.env.NODE_ENV || 'development';

app.use(require('koa-logger')());
app.use(require('koa-body')());

app.use(require('koa-static')(__dirname + '/../public'));

app.use(require('koa-views')(__dirname + '/../public/html/src', {
  default: 'jade',
  cache: false
}));

// in development mode make sure to establish a ssh tunnel to the server:
// $ ssh -L 3333:141.26.69.238:5432 rene@141.26.69.238 # -Nf to detach/quiet
// $ psql -h localhost -p 3333 -U postgres liveandgov
app.use(require('koa-pg')('pg://postgres:liveandgov@localhost' +
  (process.env.NODE_ENV === 'production' ? '' : ':3333') +
  '/liveandgov'));

// api routes are served with the prefix '/api' and respond in json
var Router = require('koa-router');
var mount = require('koa-mount');

var dataApi = new Router();
require('./api/data/v1')(dataApi);
app.use(mount('/api', dataApi.middleware()));

var templateApi = new Router();
require('./api/templates/jade')(templateApi);
app.use(mount('/', templateApi.middleware()));

// production: port 4001, anything else: port 3001
app.listen(process.env.NODE_ENV === 'production' ? 4001 : 3001);

console.log('\n\nLIVE+GOV INSPECTION FRONT END RUNNING ON PORT ' +
  (process.env.NODE_ENV === 'production' ? 4001 : 3001) + ' IN ' +
  process.env.NODE_ENV.toUpperCase() + ' MODE.\n\n');
