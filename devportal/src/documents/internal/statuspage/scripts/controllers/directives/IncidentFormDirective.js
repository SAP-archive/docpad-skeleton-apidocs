app.directive('incidentForm', function() {
  return {
    restrict: 'A',
    scope: {
      action: '=',
      source: '=',
      isStage: '='
    },
    templateUrl: '/internal/statuspage/views/directives/IncidentForm.html',
    controller: 'IncidentFormController'
  }
});
