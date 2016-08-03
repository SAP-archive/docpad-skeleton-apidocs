$(document).ready(function () {

  // check if left nav is collapsed and show the right buttons
  var isCollapsed = function(){

    if ($('.sidebar-offcanvas').css('left') === "0px"){

      // $('.collapse-left-nav').hide();
      $('.expand-left-nav').show();

    } else {

      // $('.collapse-left-nav').show();
      $('.expand-left-nav').hide();

    }

  }

  // collapse left nav function
  var collapseLeftNav = function(e){

    $('.sidebar-offcanvas').addClass('left-nav-collapsed');
    $('.container-wrapper').addClass('left-nav-collapsed-content');
    $('.sticky-page-header').addClass('left-nav-collapsed-header');
    $('.notebook-notification').addClass('notebook-notification--has-no-margin');
    $('.sequence_nav').addClass('left-nav-collapsed-header');
    $('.collapse-left-nav').css('left', '-25px');

    isCollapsed();
    e.preventDefault();

  };

  // expand left nav function
  var expandLeftNav = function(e){

    $('.sidebar-offcanvas').removeClass('left-nav-collapsed');
    $('.container-wrapper').removeClass('left-nav-collapsed-content');
    $('.sticky-page-header').removeClass('left-nav-collapsed-header');
    $('.notebook-notification').removeClass('notebook-notification--has-no-margin');
    $('.sequence_nav').removeClass('left-nav-collapsed-header');
    $('.collapse-left-nav').css('left', '226px');
    isCollapsed();
    e.preventDefault();

  };

  // hamburger nav toggle
  $('[data-toggle=offcanvas]').click(function () {

    $('.sidebar-offcanvas').removeClass('left-nav-collapsed');
    $('.container-wrapper').removeClass('left-nav-collapsed-content');
    $('.sticky-page-header').removeClass('left-nav-collapsed-header');
    $('.notebook-notification').removeClass('notebook-notification--has-no-margin');
    $('.sequence_nav').removeClass('left-nav-collapsed-header');
    $('.row-offcanvas').toggleClass('active');
    $('.sequence_nav').toggleClass('sequence_nav-offcanvas');
    $('.sticky-page-header').toggleClass('sticky-page-header-offcanvas');
    $('.sequence_nav').toggleClass('sticky-page-header-offcanvas');
    $('.right-nav-mobile').toggleClass('mobile-right-nav-active');

  });

  // bind collapse and expand function to thier buttons
  $('.collapse-left-nav').click(collapseLeftNav);
  $('.expand-left-nav').click(expandLeftNav);


  // clone desktop nav for mobile for pages with no side-bar
  $('#desktop-menu > li').not('#desktop-menu li ul a').clone().appendTo('#mobile-menu');


});
