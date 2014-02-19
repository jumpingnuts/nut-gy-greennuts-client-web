define(['angular', 'services/comment'], function (angular) {
  'use strict';

  angular.module('commentCtrls', ['commentServices'])
    .controller('CommentCtrl', [ '$scope', 'CommentLoader', 'CommentWrite', function($scope, CommentLoader, CommentWrite){
      $scope.comment = {
        content: '',
        page: 1,
        type: 'new',
        data: []
      };
      $scope.commentLoad = function(){
        new CommentLoader($scope.comment.page, $scope.appInfo.currentUrl, $scope.comment.type).then(function(res){
          $scope.comment.data = res;
        });
      };
      $scope.commentLoad();
      
      $scope.commentWrite = function(){
        if(!$scope.isLogin()) {
          $scope.moveLogin();
          return false;
        }
        new CommentWrite($scope.appInfo.currentUrl, $scope.comment.content, $scope.userInfo.id).then(function(){
          $scope.commentLoad();
          $scope.comment.content = '';
        });
      };
    }]);
});
