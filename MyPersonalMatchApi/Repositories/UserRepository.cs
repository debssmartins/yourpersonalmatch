using MyPersonalMatchApi.DAL;
using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.Repositories
{
    public class UserRepository : EfRepository<SqlDbContext, UserData>, IUserRepository
    {
        public UserRepository(SqlDbContext dbContext) : base(dbContext)
        {
        }
    }
}
