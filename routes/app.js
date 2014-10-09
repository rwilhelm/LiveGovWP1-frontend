// jshint esnext:true, noyield:true


////////////////////////////
// CLIENT SIDE APP ROUTES //
////////////////////////////


(function() {
  'use strict';

  module.exports = function(api, passport) {

    // render index html template
    api.get('/', function *index() {
      console.log('rendering index');
      yield this.render('index', {env: process.env.NODE_ENV});
    });

  };

})();