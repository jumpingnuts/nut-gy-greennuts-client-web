define(['angular', 'angularResource'], function (angular) {
  'use strict';
  
  angular.module('userServices', [ 'ngResource'])
    .factory('User', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/user');
    }])
    .factory('Auth', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/auth/user', null, {'login':{method:'POST'}});
    }])
    .factory('UserLogin', [ 'Auth', '$route', '$q', function(Auth, $route, $q) {
      return function(id, pw) {
        var delay = $q.defer();
        new Auth.login({ 'email': id, 'password': pw }, function(res, code) {
          delay.resolve(res, code);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('UserReg', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/user');
    }])
    .factory('UserRegist', [ 'UserReg', '$route', '$q', function(UserReg, $route, $q) {
      return function(save) {
        var delay = $q.defer();
        new UserReg.save(save, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('UserConnectionLogin', [ 'Auth', '$route', '$q', function(Auth, $route, $q) {
      return function(email, type, key) {
        var delay = $q.defer();
        var param = {
          'email': email,
          'connectionProvider': type,
          'connectionKey': key
        };

        new Auth.login(param, function(res, code) {
          delay.resolve(res, code);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('UserConnection', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/userConnection/:id');
    }]);
});