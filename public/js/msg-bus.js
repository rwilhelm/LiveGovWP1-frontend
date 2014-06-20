/* vi:set ft=javascript,tw=78 */
/* jshint strict:true, devel:true, debug:true */
/* global angular, app */
/* Fri Jun 20 03:28:04 CEST 2014 */

(function() {
  'use strict';

  app.config(function($provide) {
    $provide.factory('msgBus', ['$rootScope', function($rootScope) {
      var msgBus = {};
      msgBus.emitMsg = function(msg) {
        $rootScope.$emit(msg);
      };
      msgBus.onMsg = function(msg, scope, func) {
        var unbind = $rootScope.$on(msg, func);
        scope.$on('$destroy', unbind);
      };
      return msgBus;
    }]);
  });

}());
//eof
