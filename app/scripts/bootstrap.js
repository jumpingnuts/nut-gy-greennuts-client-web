require.config({
  baseUrl: './scripts',
  paths: {
    angular: '../bower_components/angular/angular',
    angularMocks: '../bower_components/angular-mocks/angular-mocks',
    angularRoute: '../bower_components/angular-route/angular-route',
    angularResource: '../bower_components/angular-resource/angular-resource',
    angularSanitize: '../bower_components/angular-sanitize/angular-sanitize',
    angularCookies: '../bower_components/angular-cookies/angular-cookies',
    angularMD5: '../bower_components/angular-md5/angular-md5',
    angularBootstrap: '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    jquery: '../bower_components/jquery/dist/jquery.min',
    kakao: 'lib/kakao.link.min',
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angularMocks': {
      deps:['angular'],
      'exports':'angular.mock'
    },
    'angularRoute': { deps:['angular'] },
    'angularResource': { deps:['angular'] },
    'angularSanitize': { deps:['angular'] },
    'angularCookies': { deps:['angular'] },
    'angularMD5': { deps:['angular'] },
    'angularBootstrap': { deps:['angular'] }
  },
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'angular',
  'jquery',
  'app',
  'angularCookies',
  'angularRoute',
  'angularSanitize',
  'angularBootstrap'
], function(angular, $) {
  'use strict';
  $(document).ready(function () {
    //위의 디펜던시 중 nutsApp이 포함된 app.js가 로드된 이후에 아래가 수행된다.
    //임의로 앵귤러 부트스트래핑을 수행한다.
    
    angular.bootstrap(document, ['nutsApp']);
    
  });
});