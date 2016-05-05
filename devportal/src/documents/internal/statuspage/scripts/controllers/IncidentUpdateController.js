app.controller('IncidentUpdateController', ['$scope', 'IncidentFormHelper', function($scope,IncidentFormHelper){

    $scope.incident = {};
    $scope.ResolveClick = function(){
        if(action == 'add')
            add();
        else if(action=='update')
            update();
        else edit();
    }

    var save = function(){

    }

    var update = function() {

    }

    var edit = function() {

    }

}])
