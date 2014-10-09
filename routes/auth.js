// jshint esnext:true, noyield:true


///////////////////
// PUBLIC ROUTES //
///////////////////

var lodash = require('lodash');

(function() {
  'use strict';

  // var passport = require('koa-passport');
  // var lodash = require('lodash');

  // var queries = require('../config/database/queries');
  // var LocalStrategy = require('passport-local').Strategy;

  // function *isAuthenticated() {
  //   passport.authenticate('local', {
  //     successRedirect: '/app',
  //     failureRedirect: '/'
  //   });
  // };

  // var LocalStrategy = require('passport-local').Strategy;
  // passport.use(new LocalStrategy(
  //   function(username, password, done) {
  //     console.log('incoming auth:', username, password);
  //     var ctx = this;

  //     // var users = ctx.pg.db.client.query_(queries.auth());
  //     debugger
  //     if (true) {
  //     // if (lodash.filter(this.users, ctx.request.body).length) {
  //     // if (authenticate(ctx.request.body)) {
  //       console.log('login successful');
  //       done(null, {username: 'asdf'});
  //     } else {
  //       console.log('login failed');
  //       done(null, false);
  //     }
  //   }
  // ));

  var secured = function *(next) {
    if (this.isAuthenticated()) {
      yield next;
    } else {
      this.status = 401;
    }
  };

  module.exports = function(app, api, passport) {

    // get auth table (users, passwords) WEAK!
    var users;
    var queries = require('../config/database/queries');
    app.use(function *(next) {
      if (!users) {
        var result = yield this.pg.db.client.query_(queries.auth());
        users = result.rows;
        console.log('getting auth table\n', users);
        yield next;
      } else {
        yield next;
      }
    });

    // input user object, store id/username to session
    // defines what is saved in session, i.e. username only
    passport.serializeUser(function(user, done) {
      console.log('serializing user', user);
      done(null, user.username);
    });

    // input id/username, get user object
    passport.deserializeUser(function(username, done) {
      var user = lodash.filter(users, {username: username});
      console.log('deserializing user', username);
      done(null, user[0]);
    });

    //
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
      function(username, password, done) {
        console.log('incoming auth:', username, password);
        var ctx = this;

        var user = lodash.filter(users, {username: username, password: password});

        if (user.length) {
          console.log('login successful');
          done(null, user[0]);
        } else {
          console.log('login failed');
          done(null, false);
        }
      }
    ));

    app.use(function *(next) {
      yield next;
    });

    // POST /login
    api.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
      })
    );

    api.get('/login', function *() {
      console.log("rendering login");
      yield this.render('login');
    });

    api.get('/logout', function*() {
      this.logout();
      this.redirect('/login');
    });

  };

})();