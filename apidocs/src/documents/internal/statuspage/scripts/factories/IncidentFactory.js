app.factory('IncidentFactory',function(){

    var indidentFactory = {};
    var mockAllIncidents_stage =
     [{
      "name":"Test maintenance - dont respond",
      "status":"scheduled",
      "created_at":"2015-06-16T10:19:09.835+02:00",
      "updated_at":"2015-06-16T10:19:10.068+02:00",
      "monitoring_at":null,
      "resolved_at":null,
      "impact":"none",
      "shortlink":"http://stspg.io/1G4e",
      "postmortem_ignored":true,
      "postmortem_body":null,
      "postmortem_body_last_updated_at":null,
      "postmortem_published_at":null,
      "postmortem_notified_subscribers":false,
      "postmortem_notified_twitter":false,
      "backfilled":false,
      "scheduled_for":"2015-06-17T00:00:00.000+02:00",
      "scheduled_until":"2015-06-18T00:00:00.000+02:00",
      "scheduled_remind_prior":false,
      "scheduled_reminded_at":null,
      "impact_override":null,
      "scheduled_auto_in_progress":true,
      "scheduled_auto_completed":true,
      "id":"2dd8nl5nd0qg",
      "page_id":"34xc119125xv",
      "incident_updates":
      [{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd","incident_id":"2dd8nl5nd0qg"
      },{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd3","incident_id":"2dd8nl5nd0qg"
      },{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd2","incident_id":"2dd8nl5nd0qg"
      }]
    }]

    var mockAllIncidents_prod =
     [{
      "name":"Test maintenance - dont respond ----prod",
      "status":"scheduled",
      "created_at":"2015-06-16T10:19:09.835+02:00",
      "updated_at":"2015-06-16T10:19:10.068+02:00",
      "monitoring_at":null,
      "resolved_at":null,
      "impact":"none",
      "shortlink":"http://stspg.io/1G4e",
      "postmortem_ignored":true,
      "postmortem_body":null,
      "postmortem_body_last_updated_at":null,
      "postmortem_published_at":null,
      "postmortem_notified_subscribers":false,
      "postmortem_notified_twitter":false,
      "backfilled":false,
      "scheduled_for":"2015-06-17T00:00:00.000+02:00",
      "scheduled_until":"2015-06-18T00:00:00.000+02:00",
      "scheduled_remind_prior":false,
      "scheduled_reminded_at":null,
      "impact_override":null,
      "scheduled_auto_in_progress":true,
      "scheduled_auto_completed":true,
      "id":"2dd8nl5nd0qg",
      "page_id":"34xc119125xv",
      "incident_updates":
      [{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd","incident_id":"2dd8nl5nd0qg"
      },{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd4","incident_id":"2dd8nl5nd0qg"
      },{
        "status":"scheduled",
        "body":"for testing purposes",
        "created_at":"2015-06-16T10:19:10.066+02:00",
        "wants_twitter_update":false,
        "twitter_updated_at":null,
        "updated_at":"2015-06-16T10:19:10.066+02:00",
        "display_at":"2015-06-16T10:19:10.066+02:00",
        "id":"3wtl8jskc7sd2","incident_id":"2dd8nl5nd0qg"
      }]
    }]



    var _createIncident = function(){

    }

    var _editIncident = function(){

    }

    var _deleteIncident = function(){

    }
    var _getAllStageProdIncidents = function(){
      return mockAllIncidents_stage;
    }
    var _getAllIncidents = function(isStage){

      if(isStage)
        return mockAllIncidents_stage; //stage way
      else return mockAllIncidents_prod; //prod way
    }

    var _getUnresolvedIncidents = function(enviroment) {
      if(isStage)
        return mockAllIncidents_stage; //stage way
      else return mockAllIncidents_prod; //prod way
    }


    indidentFactory.CreateIncident = _createIncident;
    indidentFactory.EditIncident = _editIncident;
    indidentFactory.DeleteIncident = _deleteIncident;
    indidentFactory.GetAllIncidents = _getAllIncidents;
    indidentFactory.GetUnresolvedIncidents = _getUnresolvedIncidents;
    indidentFactory.GetAllStageProdIncidents = _getAllStageProdIncidents;

    return indidentFactory;
});
