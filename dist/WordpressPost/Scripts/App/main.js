(function (_nmsp, $, undefined) {

    var _bodyElement;

    var filter;
    var currentPage;
    var baseURL = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/";

    _nmsp.init = function () {

        prepareData();
        setInitData();

        _nmsp.viewModel.initData();
    }

    var prepareData = function () {

        // history
        _bodyElement = $('body');

        _nmsp.postGrid = $('#postGrid');

        _nmsp.form = $('#wordpressPostForm');

        _nmsp.form.fields = {};
        _nmsp.form.fields.domainName = $('#domainName');
        _nmsp.form.fields.phrase = $('#phrase');
        _nmsp.form.fields.sortBy = $('#sortBy');
        _nmsp.form.fields.postNumber = $('#postNumber');
        _nmsp.form.fields.submit = $('#submit');

        setSavedFilter();
        wordpressPost.browserHistory.popState($.proxy(popHistory, this));
    }

    var setInitData = function () {

        _nmsp.viewModel = new ViewModel();

        _nmsp.form.fields.submit.click($.proxy(_nmsp.viewModel.submitForm, this));

        _nmsp.form.fields.domainName.blur($.proxy(validateElement, this, _nmsp.form.fields.domainName));
        _nmsp.form.fields.phrase.blur($.proxy(validateElement, this, _nmsp.form.fields.phrase));
        _nmsp.form.fields.postNumber.blur($.proxy(validateElement, this, _nmsp.form.fields.postNumber));
    }

    // Knockout set session list data
    _nmsp.ItemViewModel = function (item) {

        var _that = this;

        _that.postID = ko.observable(item.ID);
        var title = wordpressPost.helper.htmlDecode(item.title);
        if (!title) {
            title = "No title";
        }

        _that.title = ko.observable(title);

        var d = new Date(item.date);
        _that.createDate = ko.observable(d.toLocaleDateString("pl-PL"));

        d = new Date(item.modified);
        _that.modificationDate = ko.observable(d.toLocaleDateString("pl-PL"));
    }

    // Knockout ViewModel
    var ViewModel = function () {

        var _that = this;
        var getDataContainer;

        //#region pagination

        _that.total = ko.observable(0);

        _that.take = ko.observable(20);
        _that.page = ko.observable(1);
        _that.skip = ko.computed(function () {
            return (_that.page() - 1) * _that.take();
        });

        // pagination Filter
        _that.getFilter = function (fromPage) {

            _that.page(currentPage);

            if (filter == null) {
                filter = {
                    Skip: _that.skip(),
                    Take: _that.take()
                };
            }
            else {
                filter.Skip = _that.skip();
                filter.Take = _that.take();
            }

            if (!fromPage) {
                filter.DomainName = _nmsp.form.fields.domainName.val();
                filter.Phrase = _nmsp.form.fields.phrase.val();
                filter.SortBy = _nmsp.form.fields.sortBy.val();
                filter.PostNumber = _nmsp.form.fields.postNumber.val();
            }

            return filter;
        }

        _that.setPagination = function (id, onPageClick) {

            _that.pagination = $(id);

            _that.pagination.pagination({
                itemsOnPage: _that.take(),
                items: _that.total(),
                currentPage: currentPage,
                cssStyle: 'light-theme',
                onPageClick: $.proxy(onPageClick),
                displayedPages: 10
            });

            _that.removePaginationHashs();
        }

        _that.removePaginationHashs = function (items) {

            $('.page-link').attr('href', 'javascript:void(0)');
        }

        _that.setPage = function (page) {
            _that.page(page);

            currentPage = page;

            _that.getData(null, null, true);
        }

        _that.setOnlyPage = function (page) {
            _that.page(page);
        }

        //#endregion pagination

        _that.initData = function () {

            _that.items = ko.observableArray();

            _that.getData(_that._initData);
        }

        _that._initData = function () {

            ko.applyBindings(_that);
        }

        // set multiple data
        _that.setData = function (data) {

            if (!_that.items) {
                _that.items = ko.observableArray(ko.utils.arrayMap(data, function (item) {
                    return new _nmsp.ItemViewModel(item);
                }));
            }
            else {
                _that.items(ko.utils.arrayMap(data, function (item) {
                    return new _nmsp.ItemViewModel(item);
                }));
            }
        };

        _that.getData = function (callback, validRequired, fromPage) {

            var valid = _that.validateForm(validRequired);

            if (valid || fromPage) {

                filter = _that.getFilter(fromPage);

                wordpressPost.Blocker.startAction();

                var path = baseURL.replace("$site", filter.DomainName);

                path = wordpressPost.helper.addUrlParameter(path, 'offset', filter.Skip);
                path = wordpressPost.helper.addUrlParameter(path, 'order', 'ASC');

                if (filter.Phrase.length) {
                    path = wordpressPost.helper.addUrlParameter(path, 'search', encodeURI(filter.Phrase));
                }

                if (filter.SortBy.length) {
                    path = wordpressPost.helper.addUrlParameter(path, 'order_by', filter.SortBy);
                }

                if (filter.PostNumber.length) {

                    _that.take(filter.PostNumber);
                    path = wordpressPost.helper.addUrlParameter(path, 'number', filter.PostNumber);
                }
                else {
                    _that.take(20);
                }

                $.ajax({
                    url: path, type: "GET",
                    success: function (data) {

                        _that.removePaginationHashs();

                        updateBrowserURL(fromPage);

                        wordpressPost.Blocker.stopAction();

                        _that.setData(data.posts);
                        _that.total(data.found);

                        _that.setPagination('#pagination', _that.setPage);

                        if (data.found > 0) {
                            _nmsp.postGrid.show();
                        }
                        else {
                            _nmsp.postGrid.hide();
                        }

                        if (callback && $.isFunction(callback)) {
                            callback();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                        wordpressPost.MessageBox.show('Error', errorThrown, wordpressPost.MessageBox.modes.simple, null, true);
                        _nmsp.postGrid.hide();
                        wordpressPost.Blocker.stopAction();

                        if (callback && $.isFunction(callback)) {
                            callback();
                        }
                    }
                });
            }
            else {

                _nmsp.postGrid.hide();

                if (callback && $.isFunction(callback)) {
                    callback();
                }
            }
            
        }

        _that.submitForm = function () {

            currentPage = 1;
            _that.setOnlyPage(1);
            _that.getData(null, true);
        }

        _that.validateForm = function (validRequired) {

            var isValid = true;

            var domainVaild = validateElement(_nmsp.form.fields.domainName, validRequired);
            var phraseVaild = validateElement(_nmsp.form.fields.phrase);
            var postNumberVaild = validateElement(_nmsp.form.fields.postNumber);

            if (!domainVaild || !phraseVaild || !postNumberVaild) {
                isValid = false;
            }

            return isValid;
        }

        _that.postClicked = function () {

            var domain = getValue(_nmsp.form.fields.domainName);
            var postID = this.postID();

            var path = wordpressPost.BaseSiteUrl + 'ViewPost/' + domain + '/' + postID;
            window.location = path;
        }
    }

    //#region validation

    var validateElement = function (element, validRequired) {

        var isValid = true;

        var value = getValue(element);

        if (Boolean(element.attr('data-required')) == true) {
            if (!value.length) {
                if (validRequired) {
                    addError(element, 'empty');
                }
                isValid = false;
            }
            else {
                hideError(element, 'empty');
            }
        }

        if (Boolean(element.attr('data-valid-domain')) == true) {
            if (!wordpressPost.helper.domainNameValid(value)) {
                if (validRequired) {
                    addError(element, 'domainerror');
                }
                isValid = false;
            }
            else {
                hideError(element, 'domainerror');
            }
        }

        var length = parseInt(element.attr('data-length'));
        if (length > 0) {
            if (value.length > length) {
                addError(element, 'toolong');
                isValid = false;
            }
            else {
                hideError(element, 'toolong');
            }
        }

        var number = parseInt(element.attr('data-min-number'));
        if (number) {

            var integer = value == "" ? 20 : parseInt(value);
            if (!integer) {
                addError(element, 'notanumber');
                isValid = false;
            }
            else {
                hideError(element, 'notanumber');
            }

            if (integer < number) {
                addError(element, 'belovemin');
                isValid = false;
            }
            else {
                hideError(element, 'belovemin');
            }
        }

        number = parseInt(element.attr('data-max-number'));
        if (number) {

            var integer = value == "" ? 20 : parseInt(value);
            if (!integer) {
                addError(element, 'notanumber');
                isValid = false;
            }
            else {
                hideError(element, 'notanumber');
            }

            if (integer > number) {
                addError(element, 'abovemax');
                isValid = false;
            }
            else {
                hideError(element, 'abovemax');
            }
        }

        return isValid;
    }

    var getValue = function (htmlObject) {

        return htmlObject.val();
    }

    var addError = function (element, error) {

        var parent = element.closest('.formItem');
        parent.find('.message.error.' + error).show();

        manageErrorContainer(parent);
    }

    var hideError = function (element, error) {

        var parent = element.closest('.formItem');
        parent.find('.message.error.' + error).hide();

        manageErrorContainer(parent);
    }

    var manageErrorContainer = function (parent) {

        var anyError = false;
        parent.find('.message.error').each(function (index, el) {
            if ($(el).is(":visible") == true) {
                anyError = true;
            }
        });

        if (anyError) {
            parent.addClass('error');
        }
        else {
            parent.removeClass('error');
        }
    }
    
    //#endregion validation

    //#region history

    var setSavedFilter = function () {

        var domainName = wordpressPost.helper.getUrlParameter('dn');
        _nmsp.form.fields.domainName.val("");

        if (domainName) {
            _nmsp.form.fields.domainName.val(decodeURIComponent(domainName));
        }

        var phrase = wordpressPost.helper.getUrlParameter('p');
        _nmsp.form.fields.phrase.val("");

        if (phrase) {
            _nmsp.form.fields.phrase.val(decodeURIComponent(phrase));
        }

        var sort = wordpressPost.helper.getUrlParameter('s');
        _nmsp.form.fields.sortBy.val("date");

        if (sort) {
            _nmsp.form.fields.sortBy.val(sort);
        }

        var postNumber = wordpressPost.helper.getUrlParameter('pn');
        _nmsp.form.fields.postNumber.val("");

        if (postNumber) {
            _nmsp.form.fields.postNumber.val(postNumber);
        }

        var page = wordpressPost.helper.getUrlParameter('page');
        currentPage = 1;

        if (page) {
            currentPage = page;
        }
    }

    var updateBrowserURL = function (fromPage) {

        if (!_nmsp.IsHistory) {

            var count = 0;

            var url = wordpressPost.BaseSiteUrl;

            if (filter.DomainName != "") {
                url = wordpressPost.helper.addUrlParameter(url, 'dn', filter.DomainName);
                count++;
            }

            if (filter.Phrase != "") {
                url = wordpressPost.helper.addUrlParameter(url, 'p', filter.Phrase);
                count++;
            }

            if (filter.SortBy != "date") {
                url = wordpressPost.helper.addUrlParameter(url, 's', filter.SortBy);
                count++;
            }

            if (filter.PostNumber != "") {
                url = wordpressPost.helper.addUrlParameter(url, 'pn', filter.PostNumber);
                count++;
            }

            if (currentPage > 1) {
                url = wordpressPost.helper.addUrlParameter(url, 'page', currentPage);
                count++;
            }

            if (count > 0) {
                pushHistory(url);
            }
            else {
                if (wordpressPost.BaseSiteUrl != location) { this.pushHistory(wordpressPost.BaseSiteUrl); }
            }
        }

        _nmsp.IsHistory = false;
    }

    var pushHistory = function (url) {

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        if (window.location.origin.indexOf("www") != -1 && url.indexOf("www") == -1) {
            if (url.indexOf("http://") != -1) {
                url = url.substring("http://".length, url.length);
                url = "http://www." + url;
            } else if (url.indexOf("https://") != -1) {
                url = url.substring("https://".length, url.length);
                url = "https://www." + url;
            }
            else {
                url = "http://www." + url;
            }
        }

        wordpressPost.browserHistory.pushState(_bodyElement.html(), "BrandingThemes", url);
    }

    var popHistory = function () {

        _nmsp.IsHistory = true;

        setSavedFilter();
        setFilter();
    }

    var setFilter = function () {

        viewModel.setPage(currentPage);
        viewModel.setPagination();
    }

    //#endregion history

    $(document).ready(function () {

        _nmsp.init();
    });

})(wordpressPost.wordpressPosts = wordpressPost.wordpressPosts || {}, jQuery);