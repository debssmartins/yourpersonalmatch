using Microsoft.EntityFrameworkCore;
using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.Repositories
{

    public abstract class BaseUnitOfWork<DB> : IUnitOfWork, IDisposable where DB : DbContext
    {
        protected readonly DB _context;

        private bool disposed;

      

        public BaseUnitOfWork(DB context)
        {
            _context = context;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed && disposing)
            {
                _context.Dispose();
            }

            disposed = true;
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
