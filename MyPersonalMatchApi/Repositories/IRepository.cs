using Ardalis.Specification;

namespace MyPersonalMatchApi.Repositories
{
   
        public interface IRepository<T> : IDisposable where T : BaseEntity, IAggregateRoot
        {
            void Add(T entity);

            Task AddAsync(T entity);

            Task AddRangeAsync(IEnumerable<T> entities);

            Task<int> CountAsync();

            Task<int> CountAsync(ISpecification<T> spec);

            void Delete(T entity);

            void DeleteRange(IEnumerable<T> entities);

            Task<T> FirstAsync(ISpecification<T> spec);

            Task<T?> FirstOrDefaultAsync(ISpecification<T> spec);

            Task<T?> GetByIdAsync(object id);

            Task<IReadOnlyList<T>> ListAllAsync();

            Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);

            void Update(T entity);
        }
    
}
