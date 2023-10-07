using MyPersonalMatchApi.DAL;
using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.Repositories
{
    public class UnitOfWork: BaseUnitOfWork<SqlDbContext>, IUnitOfWork
    {
        private IUserRepository? _userRepository;


        public UnitOfWork(SqlDbContext context) : base(context)
        {
        }

        public IRepository<UserData> UserRepository
        {
            get
            {
                if (_userRepository == null)
                {
                    _userRepository = new UserRepository(_context);
                }
                return _userRepository;
            }
        }
    }
}
