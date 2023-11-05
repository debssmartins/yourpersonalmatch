using Microsoft.AspNetCore.Mvc;
using MyPersonalMatchApi.Entities;
using Vonage;
using Vonage.Request;

namespace MyPersonalMatchApi.Controllers
{
    public class NexmoController : Controller
    {
        [HttpPost("sendsms")]
        public IActionResult SendSMS([FromBody] SmsInfo info)
        {
            string msg = "Name: " + info.Name + ", Phone: " + info.Phone + ", Email: " + info.Email + ", Message: " + info.Sms;
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
