using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WordpressPost.Helper
{
    public static class GlobalHelper
    {
        public static string BaseSiteUrl
        {
            get { return System.Configuration.ConfigurationManager.AppSettings["BaseSiteUrl"]; }
        }
    }
}