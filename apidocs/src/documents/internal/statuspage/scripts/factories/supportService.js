app.factory('supportService', ['extractService', function(extractService){

  var supportService = {};

  var _prepareMaintenanceObject = function(obj){

    var returnObj = {};

    returnObj = extractService.ExtractScheduledItems(obj);


  }

  supportService.PrepareMaintenanceObject = _prepareMaintenanceObject;
  return supportService;
}])
