'use strict'

app.controller('ShowTipCtrl',['$scope','$modalInstance', 'AccountFactory', 'helperService', 'isSaveButton', function($scope, $modalInstance, AccountFactory, helperService, isSaveButton){

    $scope.text = isSaveButton ? "Only people listed below can save posts that are visible to all YaaS users: " : "Only people listed below can publish or unpublish posts that are visible to all YaaS users: ";

    AccountFactory.GetUsersOfRole('Publisher').then(function(response){
        $scope.people = helperService.ExtractUsersFromResponse(response);
    })

    $scope.ok = function () {
        $modalInstance.close();
    };


}])