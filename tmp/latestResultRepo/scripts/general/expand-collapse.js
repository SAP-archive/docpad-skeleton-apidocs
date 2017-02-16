
$(function(){

    // build needed markup
    $(".expand-collapse").each(function(){

        $(this).wrap( "<div class='seperator'></div>" );

        var preMarkup = "<a href='#' class='circle code-toggle'><span class='glyphicon glyphicon-plus'></span> <span class='glyphicon glyphicon-minus'></span></a><hr><span class='caption'></span>";
        $(this).parent().prepend(preMarkup);
        
        var caption = $(this).attr("data-caption");
        $(this).parent().find('.caption').text(caption);

    });

    // code snippet toggle
    $('.code-toggle').click(function(e){

        e.preventDefault();
        $(this).toggleClass('open-circle');
        $(this).parent().find('.expand-collapse').slideToggle();
        $(this).find('.glyphicon-plus, .glyphicon-minus').toggle();

    });

    // expand all control
    $('.expand-all').click(function(e){

        e.preventDefault();
        $('.code-toggle').addClass('open-circle');
        $('.code-toggle').parent().find('.expand-collapse').slideDown();
        $('.code-toggle').find('.glyphicon-plus').hide();
        $('.code-toggle').find('.glyphicon-minus').show();

    }); 

    // collapse all control
    $('.collapse-all').click(function(e){

        e.preventDefault();
        $('.code-toggle').removeClass('open-circle');
        $('.code-toggle').parent().find('.expand-collapse').slideUp();
        $('.code-toggle').find('.glyphicon-plus').show();
        $('.code-toggle').find('.glyphicon-minus').hide();

    });

});