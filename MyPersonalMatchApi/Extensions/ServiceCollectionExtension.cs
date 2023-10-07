using Microsoft.EntityFrameworkCore;
using MyPersonalMatchApi.DAL;

namespace MyPersonalMatchApi.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddSQLDBContext<T>(this IServiceCollection services, IConfiguration configuration, string connectionStringName) where T : DbContext
        {
            
            services.AddDbContext<T>(
                options => options.UseSqlServer(connectionStringName));

            return services;
        }
    }
}
