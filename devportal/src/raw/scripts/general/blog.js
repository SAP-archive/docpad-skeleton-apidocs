
// set active tag on blog landing page 
$(document).on("click", ".tags .label", function() {
	
	var tags = $('.tags .label ')

	tags.click(function(){
		tags.removeClass('label-active');
		$(this).addClass('label-active');
	});

});

// scroll to the top of the page when clicked on a blog post title 
$(document).on("click", "#posts .title", function() {
	$("html, body").animate({
 		scrollTop:0
 		},"slow");
});