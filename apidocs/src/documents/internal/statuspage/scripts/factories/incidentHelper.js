app.factory('incidentHelper', ['$filter', function($filter){

  var incidentHelper = {};

  var _extractScheduledItems = function(incidents){

    var scheduled = [];
    angular.forEach(incidents, function(element){
      if(element.scheduled_for && element.scheduled_until)
        scheduled.push(element);
    })

    return scheduled;
  }

  var _prepareMaintenanceObject = function(obj){

    var returnObj = {};

    returnObj = _extractScheduledItems(obj);

    return returnObj;
  }

  var _findById = function(arr, id) {
    var selected;
     var found = $filter('filter')(arr, {id: id}, true);
     if (found.length) {
         selected = found[0];
     } else {
         selected = 'Not found';
     }

     return selected;
 }

  incidentHelper.ExtractScheduledItems = _extractScheduledItems;
  incidentHelper.FindById = _findById;
  return incidentHelper;
}])
