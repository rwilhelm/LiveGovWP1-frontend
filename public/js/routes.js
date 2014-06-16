/* jshint strict:true, devel:true, debug:true */
/* globals app */
'use strict'; // jshint -W097

app.config(function ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(false);
  // $locationProvider.hashPrefix('!');

  // NOTE paths to local fs must be relative and without leading ./ (e.g.
  // localhost:3001/#/rec)

  $routeProvider
    .when('/rec/:trip_id?', {
      templateUrl: 'partial/rec',
    })

    .when('/raw/:trip_id?', {
      templateUrl: 'partial/raw',
    })

    .when('/har/:trip_id?', {
      templateUrl: 'partial/har',
    })

    .otherwise({
     redirectTo: 'rec'
    });
});

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

// to know if there are any $http queries running
// https://docs.angularjs.org/api/ng/service/$http
app.config(function ($httpProvider, $provide) {
  $provide.factory('httpInterceptor', function ($q, $rootScope) {
    return {
      'request': function (config) {
        // intercept and change config: e.g. change the URL
        // config.url += '?nocache=' + (new Date()).getTime();
        // broadcasting 'httpRequest' event
        $rootScope.$broadcast('httpRequest', config);
        return config || $q.when(config);
      },
      'response': function (response) {
        // we can intercept and change response here...
        // broadcasting 'httpResponse' event
        $rootScope.$broadcast('httpResponse', response);
        return response || $q.when(response);
      },
      'requestError': function (rejection) {
        // broadcasting 'httpRequestError' event
        $rootScope.$broadcast('httpRequestError', rejection);
        return $q.reject(rejection);
      },
      'responseError': function (rejection) {
        // broadcasting 'httpResponseError' event
        $rootScope.$broadcast('httpResponseError', rejection);
        return $q.reject(rejection);
      }
    };
  });
  $httpProvider.interceptors.push('httpInterceptor');
});
