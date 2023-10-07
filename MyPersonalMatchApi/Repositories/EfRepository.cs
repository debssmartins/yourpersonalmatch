using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MyPersonalMatchApi.Repositories
{
 
        public abstract class EfRepository<DB, T> : IRepository<T>, IDisposable where DB : DbContext where T : BaseEntity, IAggregateRoot
        {
            protected DB _dbContext;

            private bool disposed;

            public EfRepository(DB dbContext)
            {
                _dbContext = dbContext;
            }

            public void Add(T entity)
            {
                _dbContext.Set<T>().Add(entity);
            }

            public async Task AddAsync(T entity)
            {
                await _dbContext.Set<T>().AddAsync(entity);
            }

            public async Task AddRangeAsync(IEnumerable<T> entities)
            {
                await _dbContext.Set<T>().AddRangeAsync(entities);
            }

            public async Task<int> CountAsync()
            {
                return await _dbContext.Set<T>().CountAsync();
            }

            public async Task<int> CountAsync(ISpecification<T> spec)
            {
                return await ApplySpecification(spec).CountAsync();
            }

            public void Delete(T entity)
            {
                _dbContext.Set<T>().Remove(entity);
            }

            public void DeleteRange(IEnumerable<T> entities)
            {
                _dbContext.Set<T>().RemoveRange(entities);
            }

            public async Task<T> FirstAsync(ISpecification<T> spec)
            {
                return await ApplySpecification(spec).FirstAsync();
            }

            public async Task<T?> FirstOrDefaultAsync(ISpecification<T> spec)
            {
                return await ApplySpecification(spec).FirstOrDefaultAsync();
            }

            public virtual async Task<T?> GetByIdAsync(object id)
            {
                return await _dbContext.Set<T>().FindAsync(id);
            }

            public async Task<IReadOnlyList<T>> ListAllAsync()
            {
                return await _dbContext.Set<T>().ToListAsync();
            }

            public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
            {
                return await ApplySpecification(spec).ToListAsync();
            }

            public void Update(T entity)
            {
                _dbContext.Update(entity);
            }

            private IQueryable<T> ApplySpecification(ISpecification<T> spec)
            {
                return new SpecificationEvaluator().GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
            }

            protected virtual void Dispose(bool disposing)
            {
                if (!disposed && disposing)
                {
                    _dbContext.Dispose();
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
