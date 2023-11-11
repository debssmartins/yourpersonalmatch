using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ML.AutoML;
using Microsoft.ML.Data;
using MyPersonalMatchApi.Entities;
using MyPersonalMatchApi.Services;
using Newtonsoft.Json;
using Vonage;
using Vonage.Request;

namespace MyPersonalMatchApi.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserDataService _userService;
        private readonly Predictor _predictor;

        public HomeController(UserDataService userService, Predictor predictor)
        {
            _userService = userService;
            _predictor = predictor;
        }

        [HttpPost("trainModel")]
        public async Task<IActionResult> ReceiveDataAsync()
        {

            string token = HttpContext?.Request?.Headers["Authorization"].FirstOrDefault() ?? "null";
            token = token.Replace("Bearer ", "");
            if (token.Contains("null"))
            {
                // Token is missing or not provided
                return Unauthorized("No token provided");
            }

            try
            {
                var file = Request.Form.Files["csv_file"]; // Get the uploaded file

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                var userData = token.Split("?");
                var userId = userData[1];

                // Get the underlying stream from the uploaded file
                using (var fileStream = file.OpenReadStream())
                {
                    // Process the file stream using _predictor.TrainModel
                    RunDetail<MulticlassClassificationMetrics> bestRun;
                    bestRun = _predictor.TrainModel(fileStream, 10);

                    // Create a new memory stream to save the model
                    using (var modelMemoryStream = new MemoryStream())
                    {
                        _predictor.SaveModel(modelMemoryStream);

                        // Pass the modelMemoryStream to the SaveModelStream method
                        await _userService.SaveModelStream(modelMemoryStream, userId);
                    }

                    return Ok("CSV file received and processed successfully." + "Best model: " + bestRun.TrainerName + bestRun.ValidationMetrics.ConfusionMatrix.GetFormattedConfusionTable());
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions 
                return BadRequest("To train a model you must submit a variety of data. Please provide a variety of data in the table (do not put the same data in all rows of the table).");
            }
        }



        [HttpPost("evaluateModel")]
        public async Task<IActionResult> EvaluateDataAsync([FromBody] Info info)
        {

            string token = HttpContext?.Request?.Headers["Authorization"].FirstOrDefault() ?? "null";
            token = token.Replace("Bearer ", "");
            if (token.Contains("null"))
            {
                // Token is missing or not provided
                return Unauthorized("No token provided");
            }

            try
            {

                var userData = token.Split("?");
                var userId = userData[1];
                byte[] arrayByte = await _userService.GetArrayOfModel(userId);
                // Deserialize the JSON payload into a SneInfo object


                // Return a response
                using (MemoryStream memoryStream = new MemoryStream(arrayByte))
                {

                    _predictor.LoadModel(memoryStream);
                }
               
                Prediction? result = info != null ? _predictor.ClassifyData(info) : null;
                var json = JsonConvert.SerializeObject(result);
             
                return Ok(json);
            }
            catch (Exception ex)
            {
                // Error occurred while deserializing JSON
               
                return BadRequest();
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUser requestData)
        {
            if(requestData.Email.IsNullOrEmpty() || requestData.Password.IsNullOrEmpty())
            {
                return BadRequest("Invalid email or password");
            }

            UserData? user = await _userService.CheckCredentials(requestData.Email?? string.Empty, requestData.Password ?? string.Empty);

            if (user == null)
            {
                return BadRequest("Invalid email or password");
            }
            else
            {
                return Ok( user.UserId);
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginUser? requestData)
        {

            if (requestData == null)
            {
                return BadRequest("Invalid email or password");
            }

            if (requestData.Email.Equals(string.Empty) || requestData.Password.Equals(string.Empty)) 
            {
                return BadRequest("Invalid email or password");
            }

            var user = await _userService.CheckEmailAlreadyExists(requestData.Email ?? string.Empty);

            if (user != null)
            {
                return BadRequest("Email already exists!");
            }
            else
            {
                await _userService.RegisterNewUser(requestData);
                return Ok("Correctly register");
            }
        }



        [HttpPost("sendsms")]
        public IActionResult SendSMS([FromBody] SmsInfo info)
        {
            string msg = "Name: " + info.Name + ", Phone: " + info.Phone + ", UserName: " + info.Email + ", Message: " + info.Sms;
            var credentials = Credentials.FromApiKeyAndSecret(
             "47c3cd92",
             "UlAbOy5Odj9algRg"
             );

            var VonageClient = new VonageClient(credentials);

            var response = VonageClient.SmsClient.SendAnSms(new Vonage.Messaging.SendSmsRequest()
            {
                To = "34641208005",
                From = "Vonage APIs",
                Text = msg
            });

            return Ok();
        }
    }
}
