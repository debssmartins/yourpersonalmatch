using MyPersonalMatchApi.Entities;
using MyPersonalMatchApi.Repositories;
using MyPersonalMatchApi.Specifications;
using System.IO;

namespace MyPersonalMatchApi.Services
{
    public class UserDataService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UserDataService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UserData?> CheckCredentials(string email, string pwd)
        {
            var user = await _userRepository.FirstOrDefaultAsync(new UserSpecification(email, pwd));
            return user;
        }

        public async Task<UserData?> CheckEmailAlreadyExists(string email)
        {
            var user = await _userRepository.FirstOrDefaultAsync(new UserSpecification(email));
            return user;
        }

        public async Task RegisterNewUser(LoginUser requestData)
        {
           await _userRepository.AddAsync(new UserData(Guid.NewGuid().ToString(), requestData.Email, requestData.Password));
           await _unitOfWork.SaveChangesAsync();
        }

        public async Task SaveModelStream(Stream fileStream, string userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        fileStream.Seek(0, SeekOrigin.Begin);
                        await fileStream.CopyToAsync(memoryStream);
                        user.StreamModel = memoryStream.ToArray();
                        _userRepository.Update(user);
                    }
                }

                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle the exception, log the details, or throw a more specific exception.
                Console.WriteLine("An error occurred: " + ex.Message);
            }
        }

        public async Task<byte[]> GetArrayOfModel(string userId)
        {
            byte[]? arrayModel = null;
            try
            {
               
                var user = await _userRepository.GetByIdAsync(userId);
                if (user != null)
                {
                    arrayModel = user.StreamModel;
                }
                return arrayModel;



            }
            catch (Exception ex)
            {
                // Handle the exception, log the details, or throw a more specific exception.
                Console.WriteLine("An error occurred: " + ex.Message);
               
            }
            return arrayModel;
        }
    }
}
