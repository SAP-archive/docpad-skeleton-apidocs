(function(){

// 'use strict';

jQuery.fn.sequenceNav = ( function jq_sequenceNav(){

	var
		$_this = $(this),
		$_subsections = $_this.next().find('div.how_to_subsection'),
		$_lis,
		$_links,
		navLis =[],
		$_prev = $('.prev_btn'),
		$_next = $('.next_btn'),
		hash = window.location.hash.substring(1) - 1;

	$_this.addClass( 'steps_' + $_subsections.size() );

	// bulid <li> 
	function navMitize(i,desc){

		var activeCheck = '';
		
		if(hash == i){ 

			activeCheck = 'class="active"'

		} 
		return [
			'<li '+ activeCheck +'>',
				// '<span class="icon-hexagon"></span>',
				'<a class="step_number" href="#', i + 1,'" id="step-', i + 1,'"><span class="step_description">',(i + 1) + '</span> <span class="step_caption">' + desc,'</span></a>',
				// '<span class="hidden-xs">',,'</span></p>',
			'</li>'
		].join('');

	}

	// disable previous and next links on first and last step
	function disablePrevNext(){

		var first = $('.sequence_nav ul li:first-child'),
			last = $('.sequence_nav ul li:last-child');

		if ( first.hasClass('active') ) { 

			$('.prev_btn, next_btn').attr("disabled", "disabled");;
			$('.next_btn').removeAttr("disabled", "disabled");;

		} else if ( last.hasClass('active') ){

			$('.next_btn').attr("disabled", "disabled");;
			$('.prev_btn').removeAttr("disabled", "disabled");;				

		} else {

			$('.prev_btn').removeAttr("disabled", "disabled");;
			$('.next_btn').removeAttr("disabled", "disabled");;
		}
	}

	// set hash utility
	function setHash(){

		var i = $_this.find("li.active").index() + 1;
		window.location.hash = i;

	}

	// process sub section content 
	$_subsections.each( function(i){

		var $_subsec = $(this);
		navLis.push( navMitize( i, $_subsec.find('h2.p1:first').text() ) );
	
	} );

	$_this.find('nav > ul:first').html(navLis.join(''));
	$_lis = $_this.find('li');
	$_links = $_this.find('a.step_number');


	$(document).on('click', '.step_caption, .step_description', function(){

		var i = $(this).parent().parent().index();
		console.log(i);
		
		if(i !== -1){
			$_this.find('ul > li').removeClass('active').eq(i).addClass('active');
			$_subsections.removeClass('active').eq(i).addClass('active');
			$('html,body').animate({ scrollTop: 0 }, 700);
		}

		disablePrevNext();

	});
	
	$('.next-prev-controls').show();

	$_prev.click( function(e){

		$('html,body').animate({scrollTop:0},600);
		
		if( !$_links.eq(0).parent().hasClass('active') ){
			$_this.find('li.active').prev().find('.step_description').click();
		}

		e.preventDefault();
		disablePrevNext();
		setHash();

	} );

	$_next.click( function(e){
		
		$('html,body').animate({scrollTop:0},600);

		if( !$_links.eq( $_links.size() - 1 ).parent().hasClass('active') ){
			$_this.find('li.active').next().find('.step_description').click();
		}

		e.preventDefault();
		disablePrevNext();
		setHash();

	} );

	// set first step as active if no valid has tag found.
	var stepLength = $(".sequence_nav").find('ul li').length;

	if( hash == -1 || hash >= stepLength || isNaN(hash) ) {
		
		$('.sequence_nav').find('ul li:first-child').addClass('active');		
		$_subsections.eq(0).addClass('active');
	
	} else {

		$_this.eq(hash).addClass('active');
		$_subsections.eq(hash).addClass('active');
	}

	disablePrevNext();

	// disable nav if only one step in the guide
 	if($('.step_number').length == 1 ){

		// console.log('two steps found ');
		$('.sequence_nav nav').hide();
		$('.how_to_subsection h2').hide()
		$('.how_to_subsection').css('margin-top', '70px');
		$('.next-prev-controls').hide();
	}

} );

// check to sequence_nav exists before running the function. 
if( $('.sequence_nav').length ) {

	$('.sequence_nav').sequenceNav();

	var sidebarWidth =  $('#sidebar').width(),
		leftMargin = 	$('#sidebar').css('left'),
		navWidth =		(leftMargin == '0px') && $(window).width() - sidebarWidth || $(window).width(),
		nav  =			$('.sequence_nav');

	function setWidth(){
		(leftMargin == '0px') && $(nav).css('margin-left', sidebarWidth) || $(nav).css('margin-left', '0px');
		nav.css('width', navWidth);
	}

	// mini sticky nav iife
	(function () {

		$('.sequence_nav').appendTo('.navbar-super-holder');
		// setWidth();

	})();

	// $(window).resize(setWidth);

}

} )();
