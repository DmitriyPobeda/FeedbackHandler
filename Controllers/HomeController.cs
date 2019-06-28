using System.Web.Mvc;

namespace FeedbackHandler.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "FeedbackHandler";

            return View();
        }
    }
}
