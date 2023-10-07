using FluidMix.DAL.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.DAL
{
    public class SqlDbContext : DbContext
    {
        public virtual DbSet<UserData> UserDatas => Set<UserData>();
     

        public SqlDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new UserDataConfiguration());
       
        }
    }
}
