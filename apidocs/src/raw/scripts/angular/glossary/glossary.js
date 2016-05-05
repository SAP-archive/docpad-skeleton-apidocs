
// set list options
var options = {
  valueNames: ['term', 'description']
};

// instantiate a list object
var userList = new List('glossary', options);

$(document).ready(function(){
  userList.sort('term', {asc: true});
});

$(function(){

  // cache needed elements
  var glossaryInput        = $('#glossary-input'),
      glossaryClear        = $('.clear-glossary-input'),
      glossarynoResults    = $('.no-glossary-results');

  // bind clear function on keyup and change of glossary filter term
  glossaryInput.bind('keyup change', function(){

    ($(this).val().length > 0) ? glossaryClear.show() : glossaryClear.hide();
    ($('.table-glossary tr').length < 2) ? glossarynoResults.show() : glossarynoResults.hide();

   });

  // clear glossary filter
  glossaryClear.click(function(){

    userList.search();
    glossaryInput.val('').focus();
    glossarynoResults.hide();
    $(this).hide();

  });

});
