(function(){

'use strict';

//	bare-bones data should look like this:
//	var data = {
//		"List Item 1":{},
//		"List Item 2 With Subcategories":{
//			subCategories:{
//				"Subcategory List Item":{},
//				"SubCatList item with Subcat":{
//					subCategories:{
//						etc...
//					}
//				}
//			}
//		},
//		"List Item 3":{}
//	}
//
//	Add whatever other properties you want that could be relevant to an alternate nodeFormatter.
//	The default node formatter will ignore any property adjacent to subCategories

jQuery.fn.hierarchyList = (function jq_hierarchyList(optionsIn){
	var $_these = $(this);
	$_these.each( function(){

	var
		$_this = $(this),

		minSubCatHeight = false,

		options = {
			additionalClasses:['default'],
			nodeFormatter:defaultNodeFormatter,
			expandCollapse:true,
			oneOpenBehavior:true,
			data:false
		},

		presets = {
			'bootstrap_accordion':{
				additionalClasses:['panel-group'],
				nodeFormatter:(function jq_hierarchyList_bs_accordion_formatter(itemName, nodeObj, hasChildren){
					var node = [
						'<div class="panel panel-default">',
							'<h4 class="panel-heading panel-title">',
								itemName,
								hasChildren ? '<i class="pull-right glyphicon glyphicon-chevron-right"></i>' : '',
							'</h4>',
						'</div>'
					].join('');
					return node;
				} )
			}
		}
	;

	if(typeof optionsIn === 'object'){
		options = $.extend(options,optionsIn || {});
	}
	else if (typeof optionsIn === 'string'){
		options = $.extend(options,presets[optionsIn]);
	}

	if(options.data === false){
		expandCollapseBehavior($_this);
		return $_this;
	}

	$_this.addClass( options.additionalClasses.join(' ') );

	var nodeFormatter = options.nodeFormatter;


	$_this.html(buildTreeNodes(data));

	if(options.expandCollapse){
		expandCollapseBehavior($_this);
	}


	function buildTreeNodes(currentNode){
		var ntList=[];
		for (var x in currentNode){

			var childNodes = currentNode[x].subCategories;
			childNodes = childNodes ? buildTreeNodes(childNodes) : '';

			var parentClass = childNodes ? ' class="parent_node"' : '';

			ntList.push( ['<li',parentClass,'>', nodeFormatter(x, currentNode[x], !!childNodes),childNodes, '</li>' ].join('') );
		}
		ntList = ['<ul>', ntList.join(''), '</ul>'].join('');

		return ntList;
	}

	//nodeFormatters builds and injects content like so:

	//<li class="parent_node"> <FORMATTER CONTENT> <ul>...</ul></li>

	//or nonparent nodes:

	//<li> <FORMATTER CONTENT> </li>

	function defaultNodeFormatter(itemName, nodeObj, hasChildren){ //nodeObj for alternate nodeFormatters
		return [ hasChildren ? '<span class="toggle_symbol"></span>' : '', '<span>',itemName,'</span>'].join('');
	}

	function expandCollapseBehavior($_list){

		if(options.oneOpenBehavior){

			setMaxHeight();

			var resizeCheck = true;

			$(window).resize( function(){

				if(resizeCheck){
					resizeCheck = false;
					setTimeout(function(){
						resizeCheck = true;
						setMaxHeight();
					}, 100);
				}

			} );
		}


		$_list.off('click').on('click', 'ul > li', function(e){
			e.stopPropagation();

			if($(this).hasClass('parent_node')){

				var $_this = $(this);
				var $_ul = $_this.find('ul:first');
				var $_otherNodes = $_this.siblings('.parent_node.open');
				var $_glyphIcon = $_this.find('i.glyphicon:first');

				if( ! $_this.hasClass('open') ){

					$_glyphIcon.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
					$_ul.addClass('measure_hidden');

					var ulHeight = $_ul.height();
					$_ul.removeClass('measure_hidden');

					$_ul.animate({height:ulHeight+'px'}, 250, function(){ $_ul.css('height','auto'); });

					$_this.addClass('open');

					if(options.oneOpenBehavior){
						setMaxHeight();
						$_otherNodes.find('i.glyphicon:first').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
						$_otherNodes.find('ul:first').animate({height:'0px'}, 250, function(){
							$(this).removeAttr('style').parent().removeClass('open');
							$("li.nav-header").addClass("back");
							} );
					}

				}
				else if( ! options.oneOpenBehavior ) {
					$_glyphIcon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
					$_ul.animate({height:'0px'}, 250, function(){
						$_ul.removeAttr('style');
					} );

					$_this.removeClass('open');
				}

			}
		} );


		function setMaxHeight(){
			var $_listCats = $_list.find('.parent_node > span');
			var winHeight = $(window).height();
			var offsetTop = $_list.offset().top - $(document).scrollTop();
			var listCatsHeight = $_listCats.outerHeight() * $_listCats.size();
			var maxHeight = winHeight - offsetTop - listCatsHeight - 5; //no idea why it needs the 5

			$_list.find('.parent_node > ul').css('max-height',maxHeight+'px');
		}

	}

	} );
	return $_these;
} );



var //block
	researchTree = {
		"Laser Weapons":{
			"subCategories":{
				"Laser Pistol":{},
				"Laser Rifle":{},
				"Laser Spatula":{}
			}
		},
		"Plasma Weapons":{
			"subCategories":{
				"Plasma Rifle":{},
				"Kablooie Plasma Tech":{
					"subCategories":{
						"FU Cannon":{},
						"Bizarro Bomb":{}
					}
				},
				"Plasma Spatula":{}
			}
		},
		"Alien Alloys":{
			"subCategories":{
				"Energy Resistant Pajamas":{},
				"Powered Armor":{},
				"Super Teflon":{
					"subCategories":{
						"No-Stick Spatulas":{
							"subCategories":{
								"No-Stick Laser Spatula Upgrade":{},
								"No-Stick Plasma Spatula Upgrade":{}
							}
						},
						"Easy-Clean Powered Armor Upgrade":{}
					}
				}
			}
		}
	},

	$_list = $('.hierarchy_list');
; //end block

$_list.hierarchyList();
//$_list.hierarchyList(researchTree);

//$('#default').click( function(){ $_list.hierarchyList(researchTree); });
//$('#bootstrap_accordion').click( function(){ $_list.hierarchyList(researchTree,'bootstrap_accordion'); });

//devportal specific
var $_bsNav = $('#right_nav_hl');
var scrollEventBuffer = false;

$(document).scroll( function(){

	if(!scrollEventBuffer){

		//$_list.find('li.active:not(".parent_node"):first').parents('.parent_node:first').click();

		scrollEventBuffer = true;
		setTimeout( function(){

			var $_activeLi = $_bsNav.find('> li > ul > li.active');

			if($_activeLi.size() === 0){
				$_activeLi = $_bsNav.find('.parent_node:first > ul > li:first');
				$_activeLi.addClass('active');
			}

			var $_ul = $_activeLi.parent();
			var $_parentNode = $_activeLi.parents('.parent_node:first');
			var top = $_activeLi.position().top;
			var bottom = top + $_activeLi.height();
			var maxHeight = parseInt($_ul.css('max-height'));

			$_parentNode.click();

			console.log(['max:'+maxHeight,'top:'+top,'bottom:'+bottom].join('\n'));

			if( top < 0 ) {
				var newPos = $_ul.scrollTop() - (top * -1 + $_activeLi.height() );
				console.log('newPos:'+newPos);
				$_ul.animate({scrollTop:newPos}, resetBuffer);
			}
			else if (bottom > maxHeight){
				newPos = $_ul.scrollTop() + bottom - maxHeight;
				console.log('newPos:'+newPos);
				$_ul.animate({scrollTop:newPos+'px'}, resetBuffer);
			}
			else {
				resetBuffer();
			}

			function resetBuffer(){ scrollEventBuffer = false; }

		}, 100 );
	}
} );

$(document).scroll();




} )();
