
$(function(){

    // cache code block class
    var codeBlock = $('.highlight');

    // add copy button
    codeBlock.each(function(){

        // capture text to be copied
        var code = $(this).text(),
            $this = $(this);

        // add the copy button
        $this.prepend('<button class="btn btn-link copy-code-block" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Copy Code"><span class="glyphicon glyphicon-duplicate"></span></button>');

        // enable tooltip on the copy button
        $('body').tooltip({
            selector: '.copy-code-block'
        });

        // find button for each code block and create a clipboard
        var targetElm = $this.find('button'),
            copyButton = new ZeroClipboard( targetElm );        

        // copy when button is pressed.
        copyButton.on( "copy", function (event) {
          var clipboard = event.clipboardData;
          clipboard.setData( "text/plain", code );
        });

        // update tooltip content once code is copied 
        copyButton.on( "aftercopy", function( event ) {
            $this.find('.copy-code-block').attr('data-original-title', 'Copied!').tooltip('show');
        });

    });

});

// code block 
// $(function(){     
    
//     $("div.code").each(function(i, block){

//         var codeData = $(this).html(),
//             caption = $(this).attr("data-caption");

//         $(this).html('');

//         var template = [];
//         template.push('<pre class="highlight">');
//         template.push('<code>');
//         template.push('<h3>' + caption + '</h3>');
//         template.push(codeData);
//         template.push('</pre>');
//         template.push('</code>');

//         $(this).html(template.join(''));

//         var elem = $(this).find('code')[0]

//         hljs.highlightBlock(elem);

//     });

// });