app.controller('IncidentFormController', ['$scope', 'IncidentFactory',  'IncidentFormHelper', function($scope, IncidentFactory, IncidentFormHelper){

  $scope.buttonText = IncidentFormHelper.PrepareButtonText($scope.action)
  $scope.title = IncidentFormHelper.PrepareTitle($scope.action);


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


  $scope.model = {
    'incident[name]' : '',
    'incident[status]' : '',
    'incident[wants_twitter_update]' : 'n',
    'incident[message]' : ''
  }

  $scope.startDate = new Date(); // (formatted: 6/26/15 12:55 PM)
  $scope.endDate = new Date() ;// (formatted: 6/26/15 12:55 PM)

  $scope.initialize = function(){
    $scope.title = $scope.edit ? "Editing a Incident" : "Adding a Incident";


  }
   var fillOutModel = function(){
     $scope.model = {
       'incident[name]' : $scope.source.name,
       'incident[status]' : $scope.source.status,
       'incident[wants_twitter_update]' : 'n',
       'incident[message]' : ''
     }
   }


  $scope.add = function(){
      //we have access for isStage variable from directive - it will what we edit/add
  }

  $scope.save = function(){

  }
//============================================
$scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };


  $scope.open_start = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_start = true;
  };

  $scope.open_end = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened_end = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.format = 'shortDate';

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };




}])
