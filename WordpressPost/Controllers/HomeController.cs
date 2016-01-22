using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WordpressPost.Models;

namespace WordpressPost.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ViewPost(string siteName, int postID)
        {
            if (String.IsNullOrEmpty(siteName) || postID == 0)
            {
                return RedirectToAction("Index");
            }

            return View(new WordpressPostModel() { siteName = siteName, postID = postID });
        }
    }
}
