app.controller('mainCtrl', ['$scope', '$rootScope', '$route', function($scope, $rootScope, $route) {
  console.log('ctrl: mainCtrl');

  if (!$rootScope.httpRequests) $rootScope.httpRequests = 0;
  if (!$rootScope.httpRequestErrors) $rootScope.httpRequestErrors = false;

  $scope.$on('$routeChangeSuccess', function() {
    console.log('route changed');
    $scope.template = $route.current.templateUrl;
  });

  $scope.$on('httpRequest', function(e) {
    // console.log('http request started');
    $rootScope.httpRequests++;
  });

  $scope.$on('httpResponse', function(e) {
    // console.log('http request finished');
    $rootScope.httpRequests--;
  });

  $scope.$on('httpRequestError', function(e) {
    console.error('http request error');
    $rootScope.httpRequestErrors = true;
  });

  $scope.$on('httpResponseError', function(e) {
    console.error('http response error');
    $rootScope.httpRequests--;
  });
}]);

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
