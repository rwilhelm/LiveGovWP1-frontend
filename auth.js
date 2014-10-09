
var passport = require('koa-passport');
var lodash = require('lodash');

passport.serializeUser(function(user, done) {
  console.log('serializing user', user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializing user', id);
  done(null, user);
});

// var pg = require('koa-pg');
// app.use(pg('pg://postgres:liveandgov@localhost:3333/liveandgov_dev'));

// module.exports = {
//   authenticate: function (users, credentials) {
//     return !!lodash.filter(users, ctx.request.body).length;
//   }
// };


// var pg = require('koa-pg');
// app.use(pg('pg://postgres:liveandgov@localhost:3333/liveandgov_dev'));

// module.exports = function(app, passport) {
//   var ctx = this;
//   var LocalStrategy = require('passport-local').Strategy;
//   passport.use(new LocalStrategy(
//     function(username, password, done) {
//       console.log('login!');
//       var users = ctx.pg.db.client.query_(queries.auth());

//       return done(null, {username: username});

//     }
//   ));

// };

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     // var ctx = this;
//     console.log('login!');
//     var users = this.pg.db.client.query_(queries.auth());

//     return done(null, {username: username});

//     // var user = lodash.filter(this.users, ctx.request.body);
//       // if (err) { return done(err); }

//       // if (lodash.filter(this.users, ctx.request.body).length) {
//       //   return done(null, true);
//       // }

//     // User.findOne({ username: username }, function(err, user) {
//     //   if (err) { return done(err); }
//     //   if (!user) {
//     //     return done(null, false, { message: 'Incorrect username.' });
//     //   }
//     //   if (!user.validPassword(password)) {
//     //     return done(null, false, { message: 'Incorrect password.' });
//     //   }
//     //   return done(null, user);
//     // });
//   }
// ));

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('incoming auth:', username, password);
      var ctx = this;

      // var users = ctx.pg.db.client.query_(queries.auth());
      debugger
      if (true) {
      // if (lodash.filter(this.users, ctx.request.body).length) {
      // if (authenticate(ctx.request.body)) {
        console.log('login successful');
        done(null, {username: 'asdf'});
      } else {
        console.log('login failed');
        done(null, false);
      }
    }
  ));
};
