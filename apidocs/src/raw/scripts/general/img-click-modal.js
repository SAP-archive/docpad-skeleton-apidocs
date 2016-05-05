// opens up a bootstrap modal to show the image that contains a class 'img-click-modal'.
$(function () {

  // Get the real width of the given image (returns pixel less value).
  function imgRealWidth(img) {
    var $img = $(img);
    var $tmpImg;

    // Conditional added due to possible compatibility issues
    if ($img.prop('naturalWidth')) {
      $tmpImg = $('<img/>').attr('src', $img.attr('src'));
      $img.prop('naturalWidth', $tmpImg[0].width);
    }
    return $img.prop('naturalWidth');
  }

  // Build modal markup
  var modalMarkup = '<div class="modal fade" id="imgClickModal" tabindex="-1" role="dialog" aria-labelledby="imgClickModalTitle" aria-hidden="true"> <div class="modal-dialog modal-lg u-center-horizontally width-auto"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" id="imgModalClose" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title" id="imgClickModalTitle">Modal title</h4> </div> <div class="modal-body"> <img id="mimg" src="" class="img-responsive"> </div> </div> </div> </div> ';
  if ($('.img-click-modal')[0]){
    $('body').append(modalMarkup);
  }

  $('.img-click-modal').on('click', function() {

    var imgModal = $('#imgClickModal');

    var src = $(this).attr('src'),
      title = $(this).attr('alt');

    $('#mimg').attr('src', src);
    var width = imgRealWidth('#mimg'),
      modalWidth = width + parseInt(imgModal.find('.modal-body').css('padding-left')) + parseInt(imgModal.find('.modal-body').css('padding-right'));
    $('#imgClickModalTitle').text(title);
    imgModal.find('.modal-dialog').css('max-width', modalWidth);
    imgModal.modal('show');

  });

});
