'use strict'

app.directive('InformationDirective', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.source);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                // var htmlObj = $('<div/>').html(value).contents();
                //
                // var counter = htmlObj.find('[id^=hl-]').length;
                // for(var i = 0 ; i < counter ; i++){
                //   //arr.push()
                //   var el = htmlObj.find('#hl-'+i)
                //   var text = el.html();
                //   el.html('<div ng-non-bindable>' + text + '</div>');
                //   console.log(el.html());
                // }
                // //console.log(htmlObj)
                element.html(value);
                // element.find('[id^=hl-]').text(function(i, text){
                //   return text.replace('&lt;', '<').replace('&gt;', '>');
                // })
                // console.log(element.html());
                //element.contents().replace('&lt;','<');
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
                // for(var j = 0 ; j < counter ; j++){
                //   element.contents().find('#hl-'+j).html(arr[j]);
                // }

            })}
}]);
