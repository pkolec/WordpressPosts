wordpressPost.helper = {};

wordpressPost.helper.htmlDecode = function(html) {
    var a = document.createElement('a'); a.innerHTML = html;
    return a.textContent;
};

wordpressPost.helper.getUrlParameter = function (name, url) {

    if (url == undefined) {
        url = window.location.href;
    }

    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);

    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

wordpressPost.helper.removeUrlParameter = function (parameter, url) {

    if (!url) {
        url = document.location.href;
    }

    var urlparts = url.split('?');

    if (urlparts.length >= 2) {
        var urlBase = urlparts.shift();
        var queryString = urlparts.join("?");

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = queryString.split(/[&;]/g);
        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlBase + '?' + pars.join('&');
    }

    var index = url.indexOf('?');
    if (index != -1 && index == url.length - 1) {
        url = url.substring(0, index);
    }

    return url;
}

wordpressPost.helper.removeUrlParemeterAndReplace = function (parameter) {

    var url = this.removeUrlParameter(parameter);

    try {
        window.history.replaceState({}, document.title, url);
    }
    catch (ex) {

    }
}

wordpressPost.helper.addUrlParameter = function (url, name, value) {

    if (url.indexOf('?') != -1) {
        url += '&';
    }
    else {
        url += '?';
    }

    url += name + '=' + value;

    return url;
}

wordpressPost.helper.domainNameValid = function (domain) {

    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
        return true;
    }
    else {
        return false;
    }
}

wordpressPost.helper.centerOnWindow = function (element, notIncludeScroll) {

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var left = (windowWidth / 2) - (element.outerWidth() / 2);
    var top = (windowHeight / 2) - (element.outerHeight() / 2);

    if (!notIncludeScroll) {
        top += window.pageYOffset;
    }

    element.css({
        "left": left,
        "top": top,
        "position": 'absolute'
    })

    //element.style('position', 'absolute', 'important');
}