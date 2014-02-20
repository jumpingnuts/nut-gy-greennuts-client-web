define(['angular'], function (angular) {
  'use strict';
  
  angular.module('nativeServices', [ 'ngResource' ])
    .factory('Noti', [ '$rootScope', '$resource', function($rootScope, $resource) {
      return $resource($rootScope.appInfo.api.baseUrl+'/api/notification/regist');
    }])
    
    .factory('NativeFunc', ['Noti', '$rootScope', function(Noti, $rootScope){
      return {
        'notiRegist': function(username, marketUrl){
          var self = this;
          var param = JSON.parse(window.android.getRegId());
          param.type = $rootScope.appInfo.android.appname;
          new Noti.save(param, function(res) {
            if(res.insertId > 0) {
              var data = {
                'type': 'text',
                'storyPostText': username+'님이 \''+$rootScope.appInfo.title+'\'앱을 시작하셨습니다.\n\n안드로이드 다운로드\n'+marketUrl
              };
              self.uploadStroryPost(data, null, '앱으로 가기', '/list/trends', '');
            }
          });
        },
        'uploadStroryPost': function(data, img, title, href, callback){
          var vars = [];
          if(img) {
            var vars = [
              {
                "type" : "image",
                "value" : img.split("|")[0],
                "x" : 0,
                "y" : 0
              }
            ];
          }
          
          window.android.kakaoStoryUpload(
            data.storyPostText,
            img ? JSON.stringify(vars) : null, //img url
            title,
            '#'+href,
            callback //callback $scope 테스트 필요
          );
        }
      };
    }]);
});