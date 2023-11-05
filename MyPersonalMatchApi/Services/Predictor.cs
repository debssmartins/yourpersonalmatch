using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.ML;
using Microsoft.ML.AutoML;
using Microsoft.ML.Data;
using MyPersonalMatchApi.Entities;
using System.Globalization;

namespace MyPersonalMatchApi.Services
{
    public class Predictor
    {
        private MLContext _context = new();
        private ITransformer? _model;
        private DataViewSchema? _schema;
        private PredictionEngine<Info, Prediction>? _predictor;

        public Predictor()
        {

        }
        public RunDetail<MulticlassClassificationMetrics> TrainModel(
        Stream trainStream,
        uint secondsToTrain)
        {

            IEnumerable<Info> trainData = ReadCsvFromStream(trainStream);

            // Load training and validation data using LoadFromEnumerable
            IDataView data = _context.Data.LoadFromEnumerable(trainData);

            // Store the file schema for later. This helps performance slightly
            _schema = data.Schema;

            // Split our data into two parts - one for training and one for verification
            DataOperationsCatalog.TrainTestData trainTestSplit =
                _context.Data.TrainTestSplit(data, testFraction: 0.3);


            // Configure the experiment
            MulticlassExperimentSettings settings = new()
            {
                OptimizingMetric = MulticlassClassificationMetric.MacroAccuracy,
                MaxExperimentTimeInSeconds = secondsToTrain,
            };

            MulticlassClassificationExperiment experiment =
                _context.Auto().CreateMulticlassClassificationExperiment(settings);

            // Actually Train the model
            ExperimentResult<MulticlassClassificationMetrics> result =
                experiment.Execute(
                    trainData: trainTestSplit.TrainSet,
                    validationData: trainTestSplit.TestSet,
                    labelColumnName: nameof(Info.State),
                    preFeaturizer: null,
                    progressHandler: new MulticlassConsoleProgressReporter());

            // Process our finished result
            _model = result.BestRun.Model;

            // Return the best-performing model. This will include performance metrics
            return result.BestRun;
        }

        private void EnsurePredictorExists()
        {
            if (_model == null) throw new InvalidOperationException("You must train or load a model before predicting");

            _predictor ??= _context.Model.CreatePredictionEngine<Info, Prediction>(transformer: _model, inputSchema: _schema);
        }

        public Prediction ClassifyData(Info info)
        {
            EnsurePredictorExists();

            Prediction prediction = _predictor!.Predict(info);

            return prediction;
        }

        public void SaveModel(Stream stream)
        {
            if (_model == null) throw new InvalidOperationException("You must train or load a model before saving");

            _context.Model.Save(_model, _schema, stream);
        }

      
        public void LoadModel(Stream stream)
        {
            _model = _context.Model.Load(stream, out _schema);

            _predictor = _context.Model.CreatePredictionEngine<Info, Prediction>(transformer: _model, inputSchema: _schema);
        }

        private IEnumerable<Info> ReadCsvFromStream(Stream stream)
        {
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ",",
                AllowComments = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
                MissingFieldFound = null 

            }))
            {
                var records = csv.GetRecords<Info>().ToList();
                return records;
            }
        }

    }
}


