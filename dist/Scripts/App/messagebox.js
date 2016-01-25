
wordpressPost.MessageBox = {};

wordpressPost.MessageBox.init = function () {

    this.container = $('#message-box-hidden-container');
    this.container.click($.proxy(this._containerClick, this));

    this.messageBox = $('#message-box');

    //message containers
    this.title = this.messageBox.find('.message-box-header');
    this.message = this.messageBox.find('.message-box-content');

    //#region buttons

    this.closeButton = this.messageBox.find('.message-box-close');
    this.closeButton.click($.proxy(this._closeButtonClick, this));

    this.buttonsContainer = this.messageBox.find('.message-box-buttons');

    this.applyButton = this.buttonsContainer.find('.apply');
    this.applyButton.click($.proxy(this._applyButtonClick, this));

    this.cancelButton = this.buttonsContainer.find('.cancel');
    this.cancelButton.click($.proxy(this._cancelButtonClick, this));

    this.buttons = {};
    this.buttons.apply = 'apply';
    this.buttons.cancel = 'cancel';

    this.allButtons = [this.buttons.apply, this.buttons.cancel];

    //#endregion buttons

    //modes
    this.modes = {};
    this.modes.simple = 1;
    this.modes.buttons = 2;

    this._activeMode = this.modes.simple;
}

wordpressPost.MessageBox.show = function (title, message, mode, buttons, overlay, applyCallback,
    cancelCallback, callbackParameter, delay, positionTop) {

    this.close(true);

    this._activeMode = mode;

    this.title.text(title);
    this.message.html(message);

    this.overlay = overlay;

    this.buttonsContainer.hide();
    if (this._activeMode == this.modes.buttons) {
        this.buttonsContainer.show();

        this.buttonsContainer.find('.message-box-button').hide();
        for (var i = 0, length = buttons.length; i < length; i++) {
            this.buttonsContainer.find('.' + buttons[i]).show();
        }
    }

    this.applyCallback = applyCallback;
    this.cancelCallback = cancelCallback;
    this.callbackParameter = callbackParameter;

    this.container.css({ display: 'block' });

    wordpressPost.helper.centerOnWindow(this.messageBox);
    if (positionTop)
        this.messageBox.css({top: positionTop})

    if (overlay) {
        this.container.css({ display: 'none' });
        this.container.addClass('active');

        this.container.fadeIn(300);
    }

    if (delay) {
        setTimeout($.proxy(wordpressPost.MessageBox.close, this), parseInt(delay));
    }    
}

wordpressPost.MessageBox.close = function (preventOverlay) {

    if (this.overlay && !preventOverlay) {
        this.container.fadeOut(300, function () {
            wordpressPost.MessageBox.container.css({ display: 'none' });
            wordpressPost.MessageBox.container.removeClass('active');
        });
    }
    else {
        this.container.css({ display: 'none' });
        this.container.removeClass('active');
    }
}

wordpressPost.MessageBox._containerClick = function (e) {

    if (this._activeMode != this.modes.buttons && !$(e.target).closest('.message-box').length) {
        this.close();
    }
}

wordpressPost.MessageBox._closeButtonClick = function (e) {

    if ($.isFunction(this.cancelCallback)) {
        this.cancelCallback(this.callbackParameter);
    }

    this.close();
}

//#region apply/cancel

wordpressPost.MessageBox._applyButtonClick = function (e) {

    if ($.isFunction(this.applyCallback)) {
        this.applyCallback(this.callbackParameter);
    }

    this.close();
}

wordpressPost.MessageBox._cancelButtonClick = function (e) {

    if ($.isFunction(this.cancelCallback)) {
        this.cancelCallback(this.callbackParameter);
    }

    this.close();
}

//#endregion apply/cancel
