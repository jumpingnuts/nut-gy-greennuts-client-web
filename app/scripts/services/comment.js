define(['angular'], function (angular) {
  'use strict';
  
  angular.module('commentServices', [ 'ngResource' ])
    .factory('Comment', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/comment');
    }])
    .factory('CommentLoader', [ 'Comment', '$q', function(Comment, $q) {
      return function(page, key, type) {
        if(!key) { return false; }
        page = page || 1;
        type = type || 'new';
        var limit = 200;
        var order = null;
        
        switch(type) {
          case 'new':
            order = 'created desc';
            break;
          case 'best':
            order = 'created desc';
            break;
          default:
            order = 'created desc';
        }
        
        var param = {
          'key': key,
          'offset': (page-1)*limit,
          'limit': limit,
          'order': order
        };
        
        var delay = $q.defer();
        Comment.query(param, function(simnuts) {
          delay.resolve(simnuts);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    .factory('CommentWrite', [ 'Comment', '$q', function(Comment, $q) {
      return function(key, content, userId) {
        if(!key) { return false; }
        
        var param = {
          'key': key,
          'content': content,
          'user_id': userId
        };
        
        var delay = $q.defer();
        Comment.save(param, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }]);
});