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

        /// <summary>
        /// Trains a machine learning model based on ESRB game data in the <paramref name="trainFilePath"/> and <paramref name="validationFilePath"/>.
        /// Once a model is trained, the <see cref="ClassifyData(SneInfo)">ClassifyData</see> method can be called to
        /// predict ratings, or the <see cref="SaveModel(string)">SaveModel</see> method can be called to save the model for future runs.
        ///
        /// See <see href="https://www.kaggle.com/imohtn/video-games-rating-by-esrb">Kaggle</see> for the dataset used for this application.
        /// </summary>
        /// <param name="trainFilePath">The file containing the comma separated values for model training</param>
        /// <param name="validationFilePath">The file containing the comma separated values for model validation</param>
        /// <param name="secondsToTrain">The number of seconds to spend training the machine learning model</param>
        /// <returns>Information about the best model</returns>
        /// 
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
        /// <summary>
        /// Validates that a trained model exists and creates a PredictionEngine as needed
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// Thrown if no model has been trained
        /// </exception>
        private void EnsurePredictorExists()
        {
            if (_model == null) throw new InvalidOperationException("You must train or load a model before predicting");

            _predictor ??= _context.Model.CreatePredictionEngine<Info, Prediction>(transformer: _model, inputSchema: _schema);
        }

        /// <summary>
        /// Predicts the ESRB ratings of a specified <paramref name="info"/> and returns it
        /// </summary>
        /// <param name="info">The game to classify</param>
        /// <returns>A prediction including certainty factors</returns>
        /// <exception cref="InvalidOperationException">
        /// Thrown if no model has been trained. Call <see cref="TrainModel(string, string, uint)"/> or <see cref="LoadModel(string)"/> first.
        /// </exception>
        public Prediction ClassifyData(Info info)
        {
            EnsurePredictorExists();

            Prediction prediction = _predictor!.Predict(info);

            return prediction;
        }

        /// <summary>
        /// Saves the model to disk
        /// </summary>
        /// <param name="filename">The path of the model file to save</param>
        /// <exception cref="InvalidOperationException">
        /// Thrown if no model has been trained. Call <see cref="TrainModel(string, string, uint)"/> or <see cref="LoadModel(string)"/> first.
        /// </exception>
        public void SaveModel(string filename)
        {
            if (_model == null) throw new InvalidOperationException("You must train or load a model before saving");

            _context.Model.Save(_model, _schema, filename);
        }

        /// <summary>
        /// Saves the model into stream
        /// </summary>
        /// <param name="stream">The stream of the blob storage to save</param>
        /// <exception cref="InvalidOperationException">
        /// Thrown if no model has been trained. Call <see cref="TrainModel(string, string, uint)"/> or <see cref="LoadModel(string)"/> first.
        /// </exception>
        public void SaveModel(Stream stream)
        {
            if (_model == null) throw new InvalidOperationException("You must train or load a model before saving");

            _context.Model.Save(_model, _schema, stream);
        }

        /// <summary>
        /// Loads the model from disk
        /// </summary>
        /// <param name="filename">The path of the model file to load</param>
        public void LoadModel(string filename)
        {
            _model = _context.Model.Load(filename, out _schema);

            //Whenever our model changes, it's nice to update the prediction engine
            _predictor = _context.Model.CreatePredictionEngine<Info, Prediction>(transformer: _model, inputSchema: _schema);
        }

        /// <summary>
        /// Loads the model from stream
        /// </summary>
        /// <param name="stream">The stream of the model file to load</param>
        public void LoadModel(Stream stream)
        {
            _model = _context.Model.Load(stream, out _schema);

            //Whenever our model changes, it's nice to update the prediction engine
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
                MissingFieldFound = null // Ignorar campos faltantes

            }))
            {
                var records = csv.GetRecords<Info>().ToList();
                return records;
            }
        }

    }
}


