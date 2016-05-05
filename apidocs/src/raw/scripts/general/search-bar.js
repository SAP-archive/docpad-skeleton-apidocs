// cache needed elements
var searchInput = $('#lunr-input'),
    searchInputInline = $('#lunr-input2'),
    closeButton = $('.close-button'),
    closeButtonInline = $('.close-button-inline'),
    searchTerm = localStorage.getItem("searchTerm");

// Check browser support
if (typeof(Storage) != "undefined") {

    // inititat local storege element if it does not exist other wise, set search bar value
    (!localStorage.searchTerm) ? localStorage.setItem("searchTerm", "") : searchInput.val(searchTerm);
    
}

// search results display functionality
var searchBar = function(){

    if (searchInput.val().length > 0){

        searchInput.addClass('active');
        $('#lunr-results').show();
        closeButton.show();

    } else {

        searchInput.removeClass('active');
        $('#lunr-results').hide();
        closeButton.hide();
    }
};

// search results display functionlity for inline search bar
var searchBarInline = function(){

    if (searchInputInline.val().length > 0){

        searchInputInline.addClass('active');
        $('#lunr-results2').show();
        closeButtonInline.show();

    } else {

        searchInputInline.removeClass('active');
        $('#lunr-results2').hide();
        closeButtonInline.hide();
    }
};

// search bar clear functionality
var clearSearch = function(){

    $(this).hide();
    $('#lunr-results').hide();
    searchInput.val('').focus();

};

// search bar clear functionality for inline 
var clearSearchInline = function(){

    $(this).hide();
    $('#lunr-results2').hide();
    searchInputInline.val('').focus();

};

// save search term to local storage
var saveSearch = function(){

     localStorage.searchTerm =  searchInput.val();
};

// search bar
$(function(){

    // initiate search bar
    searchBar();
    $( '#lunr-input' ).keyup(searchBar);

    // clear results functionality
    closeButton.click(clearSearch);

    // save search term to local storage
    $(window).unload(saveSearch);

    // inititate search bar on term input
    if($('#lunr-input2').length){

        searchBarInline();
        $( '#lunr-input2' ).keyup(searchBarInline);
        closeButtonInline.click(clearSearchInline);

    }


});
