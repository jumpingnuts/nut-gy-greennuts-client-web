'use strict';

//requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define([
    'angular', //앵귤러 모듈을 사용하기 위해 임포트
    'controllers/main',
    'controllers/user',
    'directives/directives',
    'angularResource',
    'filters/filters'
  ],
  
/*
  이 부분도 주의깊게 살펴봐야한다.
  위의 디펜던시들이 모두 로드된 뒤에 아래의 콜백이 실행된다.
  디펜던시들이 리턴하는 객체들을 콜백함수의 파라메터로 받게 되는데,
  자세히보면 route-config와 같이 snake case로 된 파일명이,
  파라메터로 받을 때는 routeConfig와 같이 camel case로 바뀌는 것을 볼 수 있다.
*/
  //디펜던시 로드뒤 콜백함수
  function (angular) {
  
    //위의 디펜던시를 가져와서 콜백을 수행하게 되는데,
    //리턴하는 내용이 실제 사용되는 부분이겠지?
    //여기서는 myApp이라는 앵귤러 모듈을 리턴한다.

    //모듈 선언
    var app = angular.module(
      'nutsApp', [
        'mainCtrls',
        'userCtrls',
        'mainServices',
        'userServices',
        'nativeServices',
        'directives',
        'filters',
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ui.bootstrap'
      ]);
      
    app.config(function($routeProvider){
      //view1 경로 설정
        $routeProvider
          .when('/list/:type', {
            //template: '<div></div>',
            controller : 'ListCtrl',
            templateUrl : './views/list.html'
          })
          .when('/app/:contentId', {
            //template: '<div></div>',
            controller : 'ViewCtrl',
            resolve : {
              content :
                function(ContentLoader) {
                  return new ContentLoader();
                }
            },
            templateUrl : './views/view.html'
          })
          .when('/write', {
            controller : 'WriteCtrl',
            templateUrl : './views/write.html'
          })
          .when('/login', {
            controller : 'LoginCtrl',
            templateUrl : './views/signin.html'
          })
          .when('/regist', {
            controller : 'RegistCtrl',
            templateUrl : './views/regist.html'
          })
          .otherwise({redirectTo:'/list/trends'});
      }
    )
    .config(function($httpProvider){
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
    });
    
//    app.config();
    
    //공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
    app.controller(
      'CommonController', [
        '$rootScope',
        '$scope',
        '$location',
        '$timeout',
      function($rootScope, $scope, $location, $timeout) {
        $scope.contents = {
          type: 'trends',
          data: [],
          page: 1,
          scrollPos: 0
        };
        
        var appname = 'gagnuts';
        $scope.appInfo = $rootScope.appInfo = {
          'title': '개그너츠',
          'webUrl': 'http://nut.gy/'+appname,
          'mailto': 'mailto:nuts@jumpingnuts.com',
          'company': 'Jumping Nuts Inc.',
          'establishmentYear': '2013',
          'api' : {
            'baseUrl': 'http://api.jumpingnuts.com',  //상용
    //        'baseUrl': 'http://dev.jumpingnuts.com:9010', //개발
            'clientId': '0441c0011f37fec037843fcfe314366f',
            'responseType': 'token',
            'openType': 'iframe'//iframe, opener
          },
          'android': {
            'appname': appname,
            'appId': 'com.jumpingnuts.'+appname,
            'url' : 'https://play.google.com/store/apps/details?id='+'com.jumpingnuts.'+appname,
            'urlCustom' : 'market://details?id='+'com.jumpingnuts.'+appname
          }
        };

        $scope.nav = {
          'active': 'trends',
          'items': {
            'trends': {'name':'트랜드', 'order':1},
            'best': {'name': '베스트', 'order':2},
            'new': {'name': '새 글', 'order':3},
            //'mine': {'name': '내가 만든 앱', 'hide':true, 'order':4}
          },
        };
        
        $scope.$on('$routeChangeStart', function(){
          $scope.appInfo.currentUrl=$location.absUrl();
          $scope.appInfo.currentPath=$location.path();
          $scope.alerts = [];
          $scope.nav.navCollapsed = true;
        });
        
        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
        
        $scope.loadScroll = function() {
          $(window).scrollTop($scope.contents.scrollPos);
        };
        $scope.saveScrollMove = function(url, $event) {
          $scope.contents.scrollPos = $(window).scrollTop();
          $scope.move(url, $event);
        };
        $scope.move = function (url, $event) {
          if($event) { $scope.eventStop($event); }
          $location.url( url );
        };
        
        $scope.eventStop = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
        };
      }
    ]);
    
    app.controller('NativeCtrl', ['$scope', 'NativeFunc', 'UserConnectionLogin', function($scope, NativeFunc, UserConnectionLogin){
      if(!window.android){ return false; }
      window.android.loginCallback = $scope.loginCallback = function(res){
        if(JSON.parse(res).response === '200') {
          $scope.userInfo.connection.push('kakao');
          $scope.userConnection.kakao = JSON.parse(window.android.getUserInfo());
          NativeFunc.notiRegist($scope.userConnection.kakao.username, $scope.appInfo.android.url);

          if($scope.userConnection.kakao.properties.uid && $scope.userConnection.kakao.properties.key) {
            new UserConnectionLogin(
              $scope.userConnection.kakao.properties.uid,
              'kakao',
              $scope.userConnection.kakao.properties.key
            ).then(function(res){
              if(res.id) {
                $scope.setUserInfo(res);
              }
            });
          }
        }

      };
      //getUserInfo
      //setUserInfo
      //uploadStoryPost
    }]);
    
    return app;
  }
);
