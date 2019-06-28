using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using FeedbackHandler.Models;

namespace FeedbackHandler.Controllers
{
    public class FeedbacksController : ApiController
    {
        private FeedbackHandlerContext db = new FeedbackHandlerContext();

        // GET: api/Feedbacks
        public IQueryable<FeedbackDTO> GetFeedbacks()
        {
            var feedbacks = from fbs in db.Feedbacks
                            select new FeedbackDTO()
                            {
                                Id = fbs.Id,
                                Name = fbs.Name
                            };
        
            return feedbacks;
        }

        // GET: api/Feedbacks/5
        [ResponseType(typeof(FeedbackDetailDTO))]
        public async Task<IHttpActionResult> GetFeedback(int id)
        {
            var feedbackDerivable = await db.Feedbacks.Select(fbs =>
            new FeedbackDetailDTO()
            {
                Id = fbs.Id,
                Name = fbs.Name,
                Phone = fbs.Phone,
                Email = fbs.Email,
                Message = fbs.Message
            }).SingleOrDefaultAsync(fbs => fbs.Id == id);

            var feedbackDispatched = new FeedbackDispatchedDetailDTO();
            feedbackDispatched.Id = feedbackDerivable.Id;
            feedbackDispatched.Name = feedbackDerivable.Name;
            feedbackDispatched.Phone = Convert.ToString(feedbackDerivable.Phone);
            feedbackDispatched.Email = feedbackDerivable.Email;
            feedbackDispatched.Message = feedbackDerivable.Message;

            if (feedbackDispatched.Phone == "0")
            {
                feedbackDispatched.Phone = "Empty";
            }

            if (feedbackDispatched.Email == null)
            {
                feedbackDispatched.Email = "Empty";
            }

            return Ok(feedbackDispatched);
        }

        // PUT: api/Feedbacks/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutFeedback(int id, Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != feedback.Id)
            {
                return BadRequest();
            }

            db.Entry(feedback).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Feedbacks
        [ResponseType(typeof(FeedbackDTO))]
        public async Task<IHttpActionResult> PostFeedback(Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Feedbacks.Add(feedback);
            await db.SaveChangesAsync();

            var dto = new FeedbackDTO()
            {
                Id = feedback.Id,
                Name = feedback.Name
            };

            return CreatedAtRoute("DefaultApi", new { id = feedback.Id }, dto);
        }

        // DELETE: api/Feedbacks/5
        [ResponseType(typeof(Feedback))]
        public async Task<IHttpActionResult> DeleteFeedback(int id)
        {
            Feedback feedback = await db.Feedbacks.FindAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }

            db.Feedbacks.Remove(feedback);
            await db.SaveChangesAsync();

            var feedbacks = from fbs in db.Feedbacks
                            select new FeedbackDTO()
                            {
                                Id = fbs.Id,
                                Name = fbs.Name
                            };

            return Ok(feedbacks);

            // return Ok(GetFeedbacks());
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FeedbackExists(int id)
        {
            return db.Feedbacks.Count(e => e.Id == id) > 0;
        }
    }
}