
$(function(){

	///////////////////
	// API HEADER 
	//////////////////

	(function () {

		$('.sticky-page-header').appendTo('.navbar-super-holder').show();

		// setWidth();

	})();

	/////////////////////
	// api link tooltip
	////////////////////

	// // cache aipLink from the right nav
	// var apiLink = $( '#right-nav a[href^="#ApiConsole"]' );

	// // show tooltip, add class and then use the class for placement 
	// var apiTooltipPosition = function(){

	// 	// append tooltip
	// 	$( apiLink ).tooltip( { 'show': true, 'placement': 'right', 'title': 'Try it out!' } );

	// 	$( apiLink ).tooltip( 'show' );
	// 	$( apiLink ).next().addClass( 'api-tooltip' );
	// 	$( '.api-tooltip' ).css( 'left', '90px' );
	// 	$( '.api-tooltip .tooltip-arrow' ).css( 'top', '50%' );
	// };

	// // initilaize tooltip 
	// apiTooltipPosition();

	// // show on hover
	// $(apiLink).hover(apiTooltipPosition);

	// hide tooltip after 5 seconds.
	// setTimeout( function() { $(apiLink).tooltip('hide'); }, 5000 );

	// end  tool tip // 
	
	////////////////////////////
	// right nav mobile version.
	////////////////////////////

	var mobileRightNav = function(){

		// build needed markup 
		var rightNav = [];

		rightNav.push('<nav class="navbar navbar-default right-nav-mobile visible-xs">');
		rightNav.push('<ul class="nav navbar-nav">');
		rightNav.push('<li class="dropdown">');
		rightNav.push('<a href="#" class="dropdown-toggle nav-header" data-toggle="dropdown" role="button" aria-expanded="false">Quick Links <span class="caret"></span></a>');
		rightNav.push('<ul class="dropdown-menu right-nav-mobile-list" role="menu">');
		rightNav.push('</ul>');
		rightNav.push('</ul>');
		rightNav.push('</li>');
		rightNav.push('</ul>');
		rightNav.push('</nav>');

		// join and append markup
		var el = rightNav.join("");
		$(el).appendTo('.navbar-super-holder');

		// clean up unwanted markup 
		$("#right-nav").children().clone().appendTo(".right-nav-mobile-list");
		$(".right-nav-mobile-list li ul").remove();
		$('.right-nav-mobile-list a[href^="#ApiConsole"] ~ div').remove();

		// menu click functionality
		$(".right-nav-mobile-list li a").click(function(){

	   		$(".right-nav-mobile .dropdown-toggle").html($(this).text() + ' <span class="caret"></span>');

	  	});

	};

	// check if there is a right nav before doing everyhting. 
	// disable mobile nav for now.
	// if( $('#right-nav').length ){ mobileRightNav(); }

	// end right nav mobile version //

});

///////////////////////////////////////
// copy service url button in right nav
///////////////////////////////////////

var apiLink = new ZeroClipboard( document.getElementById("copy-api-button") );

apiLink.on( "ready", function( readyEvent ) {

  	apiLink.on( "aftercopy", function( event ) {
	  	// update tooltip content once url is copied 
	    $('#copy-api-button').attr('data-original-title', 'Copied!').tooltip('show');
  	});

});

var apiSpecLink = new ZeroClipboard( document.getElementById("copy-api-spec") );

apiSpecLink.on( "ready", function( readyEvent ) {

  	apiSpecLink.on( "aftercopy", function( event ) {
	  	// update tooltip content once url is copied 
	    $('#copy-api-spec').parent().parent().hide();
  });

});

$('#raml-download-link').click(function(){
	$(this).parent().parent().hide();
})

// end copy service url // 

///////////////////////////////////////
// api specification url 
///////////////////////////////////////

$('#api-spec-btn').click(function(){

	$('#api-spec-list').toggle();

});

// end api specificatio button





