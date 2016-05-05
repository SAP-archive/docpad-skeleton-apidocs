'use strict'

app.factory('IncidentFormHelper', function(){

    var incidentFormHelper = {};

    var _prepareTitle = function(action){
        return action == 'add' ? 'Adding a Maintenance' : (action == 'update' ? 'Updating a Maintenance' : 'Editing a Maintenance');
    }

    var _prepareButtonText = function(action){
        if(action == 'add')
            return "Add maintenance";
        else if(action == 'update')
            return "Update maintenance";
        else if(action == 'edit')
            return "Edit maintenance";
    }
    incidentFormHelper.PrepareTitle = _prepareTitle;
    incidentFormHelper.PrepareButtonText = _prepareButtonText;

    return incidentFormHelper;
})