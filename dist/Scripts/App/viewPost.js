wordpressPost.viewPost = {};

wordpressPost.viewPost.init = function () {

    this.getPost = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/$post_ID";

    this.wordpressPost = $('#wordpressPost');

    var domain = wordpressPost.viewPost.siteName;
    var postID = wordpressPost.viewPost.postID;

    if (domain && postID) {

        var path = this.getPost.replace("$site", domain);
        path = path.replace("$post_ID", postID);

        wordpressPost.Blocker.startAction();

        $.ajax({
            url: path, type: "GET",
            success: function (data) {

                var title = $('<h2>');
                title.html(data.title);

                wordpressPost.viewPost.wordpressPost.prepend(data.content);
                wordpressPost.viewPost.wordpressPost.prepend(title);

                wordpressPost.viewPost.wordpressPost.css('display', 'block');
                wordpressPost.Blocker.stopAction();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                wordpressPost.MessageBox.show('Error', errorThrown, wordpressPost.MessageBox.modes.simple, null, true);
                wordpressPost.Blocker.stopAction();
            }
        });
    }
    else {
		wordpressPost.MessageBox.show('Error', 'No post were found', wordpressPost.MessageBox.modes.simple, null, true);
    }
}