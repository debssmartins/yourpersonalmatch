using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPersonalMatchApi.Entities;

namespace FluidMix.DAL.Data.Configurations
{
    public class UserDataConfiguration : IEntityTypeConfiguration<UserData>
    {
        public void Configure(EntityTypeBuilder<UserData> builder)
        {
            builder.ToTable("UserData");

            builder.HasKey(e => e.UserId);
            builder.Property(e => e.UserId)
                .HasColumnName("userId")
                .IsRequired();

            builder.Property(e => e.Email)
                .HasColumnName("email");

            builder.Property(e => e.Password)
                .HasColumnName("pwd");

            builder.Property(e => e.StreamCsv)
                .HasColumnName("streamCsv");

            builder.Property(e => e.StreamModel)
                .HasColumnName("streamModel");

            builder.Property(e => e.isActive)
               .HasColumnName("isActive");

        }
    }
}
