using FeedbackHandler.Models;
using System.Data.Entity.Migrations;

namespace FeedbackHandler.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<FeedbackHandlerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(FeedbackHandlerContext context)
        {
            context.Feedbacks.AddOrUpdate(x => x.Id,
                new Feedback()
                {
                    Id = 1,
                    Name = "Dmitriy Pavlovskiy",
                    Phone = 336308435,
                    Email = "p1973v@yandex.by",
                    Message = "I found many usefull info in that website. Recommendet by myself."
                }
            );
        }
    }
}
