define(['angular', 'angularResource', 'kakao'], function (angular) {
  'use strict';
  
  angular.module('mainServices', [ 'ngResource' ])
    .factory('Content', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/gag/article/:id');
    }])
    .factory('MultiContentLoader', [ 'Content', '$q', function(Content, $q) {
      return function(page, type, userId) {
        page = page?page:1;
        type = type?type:'trends';
        var limit = 20;
        var order = null;

        switch(type) {
          case 'trends':
            order = '(recent_vote_count+recent_view_count) desc';
            break;
          case 'best':
            order = 'vote_count desc, created desc';
            break;
          case 'new':
            order = 'created desc';
            break;
          case 'mine':
            order = 'created desc';
            break;
          default:
            order = 'created desc';
        }
        
        var param = {
          'offset':(page-1)*limit,
          'limit':limit,
          'order':order
        };

        if(type==='mine' && userId) {
          param.user_id = userId;
        }
        
        var delay = $q.defer();
        Content.query(param, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    .factory('ContentLoader', [ 'Content', '$route', '$q', function(Content, $route, $q) {
      return function() {
        var delay = $q.defer();
        Content.get({ id : $route.current.params.contentId }, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('ContentSave', [ 'Content', '$q', function(Content, $q) {
      return function(data) {
        var tmp = [];
        for(var i in data.variables) {
          tmp.push(data.variables[i].value);
        }
        data.variables = tmp;
        var delay = $q.defer();
        Content.save(data, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('Like', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/kakaoapp/like/:like_id');
    }])
    .factory('LikeView', [ 'Like', '$q', function(Like, $q) {
      return function(contentId, userId) {
        var delay = $q.defer();
        Like.get({ 'app_id' : contentId, 'user_id' : userId}, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    .factory('LikeOn', [ 'Like', '$q', function(Like, $q) {
      return function(contentId, userId) {
        var delay = $q.defer();
        Like.save({ 'app_id': contentId, 'user_id': userId}, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    .factory('LikeOff', [ 'Like', '$q', function(Like, $q) {
      return function(contentId, userId, likeId) {
        var delay = $q.defer();
        Like.delete({ 'app_id': contentId, 'user_id': userId, 'like_id': likeId}, function(res) {
          delay.resolve(res);
        }, function(res) {
          delay.reject(res);
        });
        return delay.promise;
      };
    }])
    
    .factory('ShareFunc', function(){
      return {
        kakaoTalk: function(data){
          kakao.link('talk').send({
            msg : data.title+'\n\n'+data.content+'\n\n'+data.currentUrl+'\n\n',
            url : data.marketUrl,
            appid : data.appId,
            appver : '1.0',
            appname : data.appName,
            type : 'link'
          });
        },
        
        kakaoStory: function(data){
          kakao.link('story').send({
            post : '['+data.appName+'] '+data.title+'\n\n'+data.content+'\n\n'+data.currentUrl+'\n\n안드로이드 : '+data.marketUrl,
            appid : data.appId,
            appver : '1.0',
            appname : data.appName,
            urlinfo : JSON.stringify({
              title: data.title,
              desc: data.content.substring(0,80)+'...',
              imageurl:[data.currentImage],
              type:'app'
            })
          });
        },

        twitter: function(data){
          window.location.href = 'https://twitter.com/intent/tweet?'+
            'original_referer='+encodeURIComponent(data.currentUrl)+
            '&text='+encodeURIComponent('['+data.appName+'] '+data.title+'\n'+data.content.replace(/\n/gi, ' ').substring(0,60))+'\n\n'+
            '&url='+encodeURIComponent(data.marketUrl);
        },
  
        facebook: function(data){
          window.location.href = 'http://www.facebook.com/sharer.php?m2w&s=100'+
            '&p[url]='+encodeURIComponent(data.marketUrl)+
            '&p[images][0]='+encodeURIComponent(data.currentImage)+
            '&p[title]='+data.title+
            '&p[summary]='+data.content;
        },
        
        postText : function(data){
          return '['+data.appName+'] '+data.title+'\n\n'+data.content+'\n\n안드로이드 : '+data.marketUrl;
        }
      };
    });
});