// jshint esnext:true

(function() {
	'use strict';

  var lodash = require('lodash'),
      Promise = require('bluebird');

  var app        = require('koa')(),
      bodyparser = require('koa-bodyparser'),
      compress   = require('koa-compress'),
      logger     = require('koa-logger'),
      mount      = require('koa-mount'),
      Router     = require('koa-router'),
      serve      = require('koa-static'),
      views      = require('koa-views');

  // random middleware
  app.use(logger());
  app.use(bodyparser());
  app.use(compress());

  // views
  app.use(views('views', {
    default: 'html',
    cache: true
  }));

  // postgres
  var pg = require('koa-pg');
  app.use(pg('pg://postgres:liveandgov@localhost:3333/liveandgov_dev'));

  // sessions
  var session = require('koa-generic-session');
  app.keys = ['your-session-secret'];
  app.use(session({
    key: 'livegovwp1.sid', // cookie name
  }));

  // authentication
  var auth = new Router();
  var passport = require('koa-passport');
  app.use(passport.initialize());
  app.use(passport.session());
  require ('./routes/auth')(app, auth, passport);
  app.use(auth.middleware());

  app.use(function*(next) {
    if (this.isAuthenticated()) {
      console.log('authenticated');
      yield next;
    } else {
      console.log('not authenticated');
      console.log("redirecting to /login");
      this.redirect('/login');
    }
  });

  var helper = new Router();
  require ('./routes/helper')(helper);
  app.use(mount('/api', helper.middleware()));

  var api = new Router();
  require ('./routes/api')(api);
  app.use(mount('/api', api.middleware()));

  app.use(serve('public'));
  app.use(mount('/', serve('views')));
  app.use(mount('/lib', serve('bower_components')));

	app.listen(3000);

}());
