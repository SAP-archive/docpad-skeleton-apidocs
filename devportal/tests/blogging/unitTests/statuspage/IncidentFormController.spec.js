describe('IncidentFormController', function(){


beforeEach(module('statusPage'));

  var scope;
  var ctrl;
  var config;
  var helperService;
  var redirectFactory;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('IncidentFormController', {$scope: scope});

  }));

  it('expect title to be edit one', function(){
    //scope.edit = true;



  })
})
