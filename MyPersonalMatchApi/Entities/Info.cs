using CsvHelper.Configuration.Attributes;
using Microsoft.ML.Data;

namespace MyPersonalMatchApi.Entities
{
    public class Info
    {

        [LoadColumn(0)]
        public string Hair { get; set; }

        [LoadColumn(1)]
        public string Gender { get; set; }

        [LoadColumn(2)]
        public string BodyType { get; set; }

        [LoadColumn(3)]
        public string Zodiac { get; set; }

        [LoadColumn(4)]
        public string Personality{ get; set; }

        [LoadColumn(5)]
        public string MusicTaste { get; set; }

        [LoadColumn(6)]
        public bool State { get; set; }
    }
}
