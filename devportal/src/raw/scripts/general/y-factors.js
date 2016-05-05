$( function() {

  var cardDetail = $('.y-factors__card-detail');

  // hide sticky header and remove tools-wrapper class because we don't need it on this page.
  if( $('.y-factors').length ) {

    $('.sticky-page-header').hide();
    $('.tools-wrapper').removeClass('tools-wrapper');



    // close detail card
    $('.y-factors__close-card').click( function() {

      cardDetail.slideUp();
      $('.dataCard .cardRow').addClass('cardRowClickable');
      $('.dataCard').removeClass('active');

    } );

    // show card details when clicked on card
    $(document).on( 'click', '.dataCard, .dataList', function() {

      var $this = $(this),
          card = '#' + $this.data('card'),
          location;

      $this.hasClass('dataCard') ? location = $this : location =  $('.dataCard[data-card="' + card.substr(1) + '"]');

      if (!location.hasClass('active')) {
        cardDetail.slideUp();
        $('.dataCard').removeClass('active');
        $('.dataCard .cardRow').addClass('cardRowClickable');
        location.find('.cardRow').removeClass('cardRowClickable').parent().addClass('active');
      }

      if ($(window).width() < 768) {
        $(card).removeClass('row');
        location.after( $(card) );
        } else {
          $(card).addClass('row');
        location.parent().after( $(card) );
      }

      $(card).slideDown();

    } );

    // build left nav
    var yFactorLeftNav = ( function() {

      var menu = [],
          cards = $('.dataCard'),
          cardTitle,
          cardData;

      cards.each( function() {

        cardTitle = $(this).find('p').text();
        cardData = $(this).data('card');
        menu.push('<li><a href="#" data-card="' + cardData + '" class="dataList">' + cardTitle + '</a></li>');

      } );

      $('#left_nav .nav .nav-header').after(menu);

    } )();

    // fix card detail position when window is resized
    var positionCard = function() {

      var activeCard = $('.dataCard.active'),
          activeCardDetail = $('.y-factors__card-detail:visible');

      if ( activeCard.length ){

        if ( $(window).width() < 768 ) {
          $(activeCardDetail).removeClass('row');
          activeCard.after( activeCardDetail );
          } else {
            $(activeCardDetail).addClass('row');
          activeCard.parent().after( activeCardDetail );
         }
      }
    };
  }
  // reposition card when windows size is changed
  $(window).resize(positionCard);

} );
