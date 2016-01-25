wordpressPost.browserHistory = {};

wordpressPost.browserHistory.popState = function (callback) {

    if (window.history.pushState != null) {
        $(window).unbind('popstate').on('popstate', callback);
    }
    else {
        History.Adapter.bind(window, 'statechange', callback);
    }
}

wordpressPost.browserHistory.pushState = function (state, title, url) {

    if (window.history.pushState != null) {
        window.history.pushState(state, title, url);
    }
    else {

        if (History.getHashByUrl(url)) {
            return;
        }

        History.pushState(state, title, url);
        History.replaceState(state, title, url);
    }
}

wordpressPost.browserHistory.replaceState = function (state, title, url) {

    if (window.history.pushState != null) {
        window.history.replaceState(state, title, url);
    }
    else {

        if (History.getHashByUrl(url)) {
            return;
        }
        
        History.replaceState(state, title, url);
    }
}