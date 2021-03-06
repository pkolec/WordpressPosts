describe("Ajax callback", function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function (done) {

        wordpressPost.BaseSiteUrl = "http://localhost:50195/";
        wordpressPost.wordpressPosts.IsHistory = true;

        wordpressPost.wordpressPosts.form.fields.domainName = $('<input name="domainName" data-valid-domain="true">');
        wordpressPost.wordpressPosts.form.fields.phrase = $('<input name="phrase">');
        wordpressPost.wordpressPosts.form.fields.sortBy = $('<input name="sortBy">');
        wordpressPost.wordpressPosts.form.fields.postNumber = $('<input name="postNumber">');

        wordpressPost.wordpressPosts.form.fields.domainName.val('developer.wordpress.com');

        wordpressPost.wordpressPosts.viewModel.getData(done);
    });


    it("Ajax response form developer.wordpress.com to be greather than 0", function (done) {

        expect(wordpressPost.wordpressPosts.viewModel.total()).toBeGreaterThan(0);
        done();
    });
});

describe("Common", function () {


    it("Ajax response form developer.wordpress.com to be greather than 0", function (done) {

        expect(wordpressPost.wordpressPosts.viewModel.total()).toBeGreaterThan(0);
        done();
    });

    it("Error for invalid domain name", function () {

        wordpressPost.wordpressPosts.form.fields.domainName.val('tmp');
        var result = wordpressPost.wordpressPosts.viewModel.validateForm();

        expect(result).toBe(false);
    });
});

describe("Conditions", function () {

    beforeEach(function (done) {

        wordpressPost.BaseSiteUrl = "http://localhost:50195/";
        wordpressPost.wordpressPosts.IsHistory = true;

        wordpressPost.wordpressPosts.form.fields.domainName = $('<input name="domainName" data-valid-domain="true">');
        wordpressPost.wordpressPosts.form.fields.phrase = $('<input name="phrase">');
        wordpressPost.wordpressPosts.form.fields.sortBy = $('<input name="sortBy">');
        wordpressPost.wordpressPosts.form.fields.postNumber = $('<input name="postNumber">');

        wordpressPost.wordpressPosts.form.fields.domainName.val('developer.wordpress.com');
        wordpressPost.wordpressPosts.form.fields.postNumber.val(100);

        wordpressPost.wordpressPosts.viewModel.getData(done);
    });

    it("Is no title", function (done) {

        expect(wordpressPost.wordpressPosts.viewModel.total()).toBeGreaterThan(0);
        done();

        var item = { title: "" };

        wordpressPost.wordpressPosts.ItemViewModel(item);

        expect(wordpressPost.wordpressPosts.title()).toBe('No title');
    });
});

describe("Ajax Error", function () {

    beforeEach(function (done) {

        wordpressPost.MessageBox.init();

        wordpressPost.BaseSiteUrl = "http://localhost:50195/";
        wordpressPost.wordpressPosts.IsHistory = true;
        wordpressPost.wordpressPosts.postGrid = $('<div>');

        wordpressPost.wordpressPosts.form.fields.domainName = $('<input name="domainName" data-valid-domain="true">');
        wordpressPost.wordpressPosts.form.fields.phrase = $('<input name="phrase">');
        wordpressPost.wordpressPosts.form.fields.sortBy = $('<input name="sortBy">');
        wordpressPost.wordpressPosts.form.fields.postNumber = $('<input name="postNumber">');

        wordpressPost.wordpressPosts.form.fields.domainName.val('tmp.tmp');

        wordpressPost.wordpressPosts.viewModel.getData(done);
    });

    it("Ajax Error", function (done) {

        expect(wordpressPost.wordpressPosts.postGrid.css('display')).toBe('none');
        done();
    });
});

describe("Invalid data Ajax", function () {

    beforeEach(function (done) {

        wordpressPost.MessageBox.init();

        wordpressPost.BaseSiteUrl = "http://localhost:50195/";
        wordpressPost.wordpressPosts.IsHistory = true;
        wordpressPost.wordpressPosts.postGrid = $('<div>');

        wordpressPost.wordpressPosts.form.fields.domainName = $('<input name="domainName" data-valid-domain="true">');
        wordpressPost.wordpressPosts.form.fields.phrase = $('<input name="phrase">');
        wordpressPost.wordpressPosts.form.fields.sortBy = $('<input name="sortBy">');
        wordpressPost.wordpressPosts.form.fields.postNumber = $('<input name="postNumber">');

        wordpressPost.wordpressPosts.form.fields.domainName.val('tmp');

        wordpressPost.wordpressPosts.viewModel.getData(done);
    });

    it("Ajax Error", function (done) {

        expect(wordpressPost.wordpressPosts.postGrid.css('display')).toBe('none');
        done();
    });
});