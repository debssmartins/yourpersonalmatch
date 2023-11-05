using MyPersonalMatchApi.Repositories;

namespace MyPersonalMatchApi.Entities
{
    public class UserData : BaseEntity, IAggregateRoot
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public byte[]? StreamModel { get; set; }

        public UserData(string userId, string email, string password)
        {
            UserId = userId;
            Email = email;
            Password = password;
        }
    }

  
}
