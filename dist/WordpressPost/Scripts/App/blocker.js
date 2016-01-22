wordpressPost.Blocker = {};
wordpressPost.Blocker.class = ".blocker";

wordpressPost.Blocker.init = function () {

    this.setEvents();
    this._preinit();
};

wordpressPost.Blocker._preinit = function () {

    if (!this.isPreinited) {

        this.preloaderHolder = $('#preloaderHolder');
        this.actionPreloader = this.preloaderHolder.find(".actionPreloader");
        this.isGloballyBlocked = false;
        this.isPreinited = true;
    }
};

wordpressPost.Blocker.setEvents = function () {

    $(document).on("click mouseover mouseout mouseenter mouseleave dbclick mousedown", this.class, function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
};

wordpressPost.Blocker.startAction = function () {

    this._preinit();
    if (!this.isGloballyBlocked) {

        $.blockUI({
            css: {
                border: 'none',
                padding: '0px',
                backgroundColor: 'none',
                opacity: 1,
                color: '#fff',
                width: '100%',
                height: '100%',
                top: '0px',
                left: '0px',
                zIndex: 7000,
                cursor: "default"
            },
            fadeIn: 20,
            fadeOut: 20,
            overlayCSS: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                opacity: 1,
                zIndex: 7000
            },
            message: this.actionPreloader
        });

        this.isGloballyBlocked = true;
        this.isBlocked = true;
    }
};

wordpressPost.Blocker.stopAction = function () {

    this._preinit();

    $.unblockUI();
    this.isGloballyBlocked = false;
};