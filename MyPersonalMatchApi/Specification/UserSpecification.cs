using Ardalis.Specification;
using MyPersonalMatchApi.Entities;

namespace MyPersonalMatchApi.Specifications
{
    public class UserSpecification : Specification<UserData>
    {

        public UserSpecification(string email, string pwd)
        {
            Query.Where(u => u.Email.Equals(email) && u.Password.Equals(pwd));
        }

        public UserSpecification(string email)
        {
            Query.Where(u => u.Email.Equals(email));
        }
    }
}
