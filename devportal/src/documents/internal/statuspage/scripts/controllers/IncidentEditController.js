app.controller('IncidentEditController', ['$scope', 'IncidentFactory', 'incidentHelper', '$route', function($scope, IncidentFactory, incidentHelper, $route){

  $scope.incidents = IncidentFactory.GetAllStageProdIncidents();
  $scope.scheduledIncidents = incidentHelper.ExtractScheduledItems($scope.incidents);
  var id = $route.current.params.id;
  console.log($scope.incidents);
  console.log($scope.scheduledIncidents);

  $scope.incident = incidentHelper.FindById($scope.scheduledIncidents, id);
  console.log($scope.incident);
  // $scope.$on('editIncident', function(response) {
  //     $scope.incident = response;
  //     console.log('edited');
  //   })

}])
