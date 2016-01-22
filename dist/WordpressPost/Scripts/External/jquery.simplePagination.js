/**
* simplePagination.js v1.4
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function ($) {

    var methods = {
        init: function (options) {
            var o = $.extend({
                items: 1,
                itemsOnPage: 1,
                pages: 0,
                displayedPages: 5,
                edges: 2,
                currentPage: 1,
                hrefText: '#page-',
                prevText: 'Prev',
                nextText: 'Next',
                ellipseText: '&hellip;',
                cssStyle: 'light-theme',
                selectOnClick: true,
                activPageHoverInput: false, //Flag when is set on true then the draw function add hover input to current page.
                onPageClick: function (pageNumber) {
                    // Callback triggered when a page is clicked
                    // Page number is given as an optional parameter
                },
                onInit: function () {
                    // Callback triggered immediately after initialization
                },
                onRedrawEnd: function () {
                    // Callback triggered after draw
                },
                onInputMouseEnter: function (e) {
                    //Function set hover input width from current page span.
                    var spanWidth = $(e.currentTarget).width();
                    $(e.currentTarget).next("input").width(spanWidth);
                    $(e.currentTarget).next("input").attr("data-activrPage", $(e.currentTarget).text());
                    $(e.currentTarget).next("input").val($(e.currentTarget).text());
                    $(e.currentTarget).parent(".currentDiv").addClass("setActivePage");
                    $(e.currentTarget).next("input").focus();

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                },
                onCheckPages: function () {
                    return(true);
                }
            }, options || {});

            var self = this;

            o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
            o.currentPage = o.currentPage - 1;
            o.halfDisplayed = o.displayedPages / 2;

            this.each(function () {
                self.addClass(o.cssStyle).data('pagination', o);
                methods._draw.call(self);
            });

            o.onInit();

            if (o.activPageHoverInput) {

                //This function is use to set a width to hover input.
                self.find(".activPageLink").unbind();
                self.on('click', ".activPageLink", function (e) { o.onInputMouseEnter(e) });

                //This function set activ page when we leve hover input.
                self.find(".currentDiv input").unbind();
                self.on('blur', ".currentDiv input", function (e) {

                    var inputValue = $(e.currentTarget).val().toInt();
                    var activePage = $(e.currentTarget).attr("data-activrPage").toInt();
                    if ($.isNumeric(inputValue) && inputValue > 0 && activePage != inputValue && o.onCheckPages(inputValue)) {
                        $.proxy(methods.selectPage, self)(inputValue);
                    }

                    self.find(".currentDiv").removeClass("setActivePage");

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
                //This function set activ page whem we clikc enter on hover input.
                self.find(".currentDiv input").unbind();
                self.on('keyup', ".currentDiv input", function (e) {

                    if (e.which == 13) {
                        var inputValue = $(e.currentTarget).val().toInt();
                        var activePage = $(e.currentTarget).attr("data-activrPage").toInt();
                        if ($.isNumeric(inputValue) && inputValue > 0 && activePage != inputValue && o.onCheckPages(inputValue)) {
                            $.proxy(methods.selectPage, self)(inputValue);
                        }

                        self.find(".currentDiv").removeClass("setActivePage");
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            }

            return this;
        },

        selectPage: function (page) {
            methods._selectPage.call(this, page - 1);
            return this;
        },

        prevPage: function () {
            var o = this.data('pagination');
            if (o.currentPage > 0) {
                methods._selectPage.call(this, o.currentPage - 1);
            }
            return this;
        },

        nextPage: function () {
            var o = this.data('pagination');
            if (o.currentPage < o.pages - 1) {
                methods._selectPage.call(this, o.currentPage + 1);
            }
            return this;
        },

        destroy: function () {
            this.html("");
            //this.empty();
            return this;
        },

        redraw: function () {
            methods._draw.call(this);
            return this;
        },

        disable: function () {
            var o = this.data('pagination');
            o.disabled = true;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        enable: function () {
            var o = this.data('pagination');
            o.disabled = false;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        _draw: function () {
            var $panel = this,
				o = $panel.data('pagination'),
				interval = methods._getInterval(o),
				i;

            methods.destroy.call(this);

            // Generate Prev link
            if (o.prevText) {
                methods._appendItem.call(this, o.currentPage - 1, { text: o.prevText, classes: 'prev' });
            }

            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {
                var end = Math.min(o.edges, interval.start);
                for (i = 0; i < end; i++) {
                    methods._appendItem.call(this, i);
                }
                if (o.edges < interval.start && o.ellipseText) {
                    $panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
                }
            }

            // Generate interval links
            for (i = interval.start; i < interval.end; i++) {
                methods._appendItem.call(this, i);
            }

            // Generate end edges
            if (interval.end < o.pages && o.edges > 0) {
                if (o.pages - o.edges > interval.end && o.ellipseText) {
                    $panel.append('<span class="ellipse">' + o.ellipseText + '</span>');
                }
                var begin = Math.max(o.pages - o.edges, interval.end);
                for (i = begin; i < o.pages; i++) {
                    methods._appendItem.call(this, i);
                }
            }

            // Generate Next link
            if (o.nextText) {
                methods._appendItem.call(this, o.currentPage + 1, { text: o.nextText, classes: 'next' });
            }

            o.onRedrawEnd(o.currentPage + 1);
        },

        _getInterval: function (o) {
            return {
                start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
                end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
            };
        },

        _appendItem: function (pageIndex, opts) {
            var self = this, options, $link, o = self.data('pagination');

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

            options = $.extend({
                text: pageIndex + 1,
                classes: ''
            }, opts || {});

            if (pageIndex == o.currentPage || o.disabled) {

                //
                if (o.activPageHoverInput && o.prevText != options.text && o.nextText != options.text) {
                    $link = $('<div class="currentDiv"><span class="current">' + (options.text) + '</span><input value="' + (options.text) + '"/></div>');
                }
                else {
                    $link = $('<span class="current">' + (options.text) + '</span>');
                }

                //Add class to current page span.
                if (o.prevText != options.text && o.nextText != options.text) {
                    $link.find("span").addClass("activPageLink");
                }
            } else {
                $link = $('<a href="' + o.hrefText + (pageIndex + 1) + '" class="page-link">' + (options.text) + '</a>');
                $link.click(function () {

                    if (!$(this).hasClass("disable")) {
                        $(this).addClass("disable")
                        methods._selectPage.call(self, pageIndex);
                    }

                });
            }

            if (options.classes) {
                $link.addClass(options.classes);
            }

            self.append($link);
        },

        _selectPage: function (pageIndex) {
            var o = this.data('pagination');
            o.currentPage = pageIndex;
            if (o.selectOnClick) {
                o.onPageClick(pageIndex + 1);
                methods._draw.call(this);
            } else {
                o.onPageClick(pageIndex + 1);
            }
        }

    };

    $.fn.pagination = function (method) {

        // Method calling logic
        if (methods[method] && method.charAt(0) != '_') {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.pagination');
        }

    };

})(jQuery);