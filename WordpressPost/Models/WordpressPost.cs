using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WordpressPost.Models
{
    public class WordpressPostModel
    {
        /*
        public WordpressPostAuthor author { get; set; }

        [AllowHtml]
        public string title { get; set; }

        [AllowHtml]
        public string content { get; set; }
         */

        public int postID { get; set; }
        public string siteName { get; set; }
    }

    public class WordpressPostAuthor
    {
        [AllowHtml]
        public string avatar_URL { get; set; }
        public string login { get; set; }
    }
}