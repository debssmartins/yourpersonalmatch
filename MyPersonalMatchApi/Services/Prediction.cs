using Microsoft.ML.Data;

namespace MyPersonalMatchApi.Services
{
    public class Prediction
    {
        [ColumnName("PredictedLabel")]
        public bool State { get; set; }

        public float[] Score { get; set; } // [ P:F, P:S]
        //1 to won 0 to lose
        public string Confidence => (Score.Max() * 100).ToString("0.###") + "%";
        
        public string Fail => (Score[0] * 100).ToString("0.###") + "%";
        public string Success => (Score[1] * 100).ToString("0.###") + "%";
        public override string ToString()
        {
            return $"State: {State}, Succes: {Success:P}, Fail: {Fail:P}, Confidence: {Confidence}";
        }

    }
}
