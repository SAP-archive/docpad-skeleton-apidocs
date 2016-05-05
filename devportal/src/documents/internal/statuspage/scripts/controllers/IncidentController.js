app.controller('IncidentController', ['$scope', 'IncidentFactory', 'incidentHelper', 'isStage', '$modal', '$location', function($scope, IncidentFactory, incidentHelper, isStage, $modal, $location){

    $scope.incidents = IncidentFactory.GetAllIncidents(isStage);
    $scope.scheduledIncidents = incidentHelper.ExtractScheduledItems($scope.incidents);


    $scope.showDetails = function(_incident){
      var modalInstance = $modal.open({
      templateUrl: 'views/modals/detailIncident.html',
      controller: 'IncidentDetailController',
      size: 'lg',
      resolve: {
        incident: function(){
          return _incident;
        }
      }
    });
    }

    $scope.edit = function(id){
        $location.path('/incidents/edit/'+id);
    }

    $scope.update = function(id){

    }
   $scope.delete = function(){
       //ask modal about "are you sure..."

   }

}])
