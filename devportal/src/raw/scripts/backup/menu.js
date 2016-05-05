$(document).ready(function () {
    $('.accordion-menu').each(function(){
        var $node = $(this);
        $node.find( "ul").each(function(){
                $(this).hide();
        });
    });

    // temp placement for scroll spy 
    // $('body').scrollspy({ target: '.scroll-points' });
});