'use strict'


app.factory('MessageFactory', function(config){

    var messageFactory = {};

    var _anonTokenFailedMessage = 'Server access error. Posts can not be displayed. Try again later.';

    var _anonTokenFailedMessageDetail = 'Server access error. The post can not be displayed. Try again later.';

    var _productGetFailedMessages = 'Something went wrong. Posts can not be displayed. Try again later.';

    var _productGetFailedOneMessage = 'Something went wrong. The post can not be displayed. Try again later.';

    var _productDetailNotFoundMessage = 'The post does not exist.';

    var _productDetailFailedMessage = 'Something went wrong. The post can not be displayed. Try again later.';



    var _productSubmitFailedMessage = 'Something went wrong. Actions can not be performed. Try again later.';

    var _productPublishSuccessMessage = 'Post has been published.';

    var _productUnPublishSuccessMessage = 'Post has been unpublished.';

    var _productDeleteSuccessMessage = 'Post has been deleted.';

    var _productSaveSuccessMessage = 'Post has been saved.';

    var _productCreateSuccessMessage = 'Post has been added but its not published by default.';


    var _createInfoMessage = function(isError, type, id){
      var messageInfo = '';

      switch(type) {

      case 'save':
        messageInfo = _productSaveSuccessMessage;
        break;
      case 'create':
        messageInfo = _productCreateSuccessMessage + ' Click <a href="" ng-click="redirectToPost(\'' + id + '\')"> here </a> to edit your post.';
        break;
      case 'publish':
        messageInfo = _productPublishSuccessMessage;
        break;
      case 'unpublish':
        messageInfo = _productUnPublishSuccessMessage;
        break;
      case 'delete':
        messageInfo = _productDeleteSuccessMessage;
        break;
      }

      return messageInfo;
    };

    var _createAuthorWarningMessage = function() {
      return 'You didn\'t specify your YaaS first name and last name in the Builder. ' +
             'If you create a post, your email address will be exposed in the author field. ' +
             'Click <a href="#" ng-click="redirectToBuilder()">here</a> to complete your profile and then click <a href="#" ng-click="logoutAndRedirect()">here</a> to login again.' +
             '<br/>If you wrote some content already, it won\'t be lost on logout. We will keep the content for you. <br/><br/>  From Wookiees with Love.'
    };

    messageFactory.ProductGetFailedOneMessage = _productGetFailedOneMessage;
    messageFactory.ProductGetFailedMessages = _productGetFailedMessages;
    messageFactory.ProductDetailNotFoundMessage = _productDetailNotFoundMessage;
    messageFactory.ProductDetailFailedMessage = _productDetailFailedMessage;
    messageFactory.AnonTokenFailedMessageDetail = _anonTokenFailedMessageDetail;
    messageFactory.AnonTokenFailedMessage = _anonTokenFailedMessage;
    messageFactory.ProductSubmitFailedMessage = _productSubmitFailedMessage;
    messageFactory.ProductPublishSuccessMessage = _productPublishSuccessMessage;
    messageFactory.ProductUnPublishSuccessMessage = _productUnPublishSuccessMessage;
    messageFactory.ProductDeleteSuccessMessage = _productDeleteSuccessMessage;
    messageFactory.ProductSaveSuccessMessage = _productSaveSuccessMessage;
    messageFactory.CreateInfoMessage = _createInfoMessage;
    messageFactory.CreateAuthorWarningMessage = _createAuthorWarningMessage;



    return messageFactory;
  });
