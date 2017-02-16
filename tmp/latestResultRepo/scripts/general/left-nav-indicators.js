(function(){
  $('.left-nav li a').each(function() {
    var $anchor = $(this);

    // Append visual indicators to all navigation elements that do have subnavigation
    var $listItem = $anchor.parent();
    if ($listItem.find('ul').length !== 0) {
      $anchor.find('.left-nav__icon').removeClass('u-hide-permanently').addClass('left-nav__icon--is-visible');
    }

    // Append play buttons to all navigation elements that do have tutorials
    var section = $anchor.attr('href');
    var parent = $anchor.closest('ul').closest('li').children('a');
    if (section.indexOf('#') > -1) {
      if ($(section).find('.interactive-tutorial').length !== 0) {
        $anchor.find('.left-nav__play-button').removeClass('u-hide-permanently').addClass('left-nav__play-button--is-visible');
        parent.find('.left-nav__play-button').removeClass('u-hide-permanently').addClass('left-nav__play-button--is-visible');
      }
    }
  });
})();
