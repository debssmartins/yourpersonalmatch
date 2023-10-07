using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
       
        void SaveChanges();

        Task SaveChangesAsync();
    }
}