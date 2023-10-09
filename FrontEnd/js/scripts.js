
function tableToCSV() {
    // Variable to store the final csv data
    var csv_data = [];

    // Define column headers
    var columnHeaders = [
        "Hair",
        "Gender",
        "BodyType",
        "Zodiac",
        "Personality",
        "MusicTaste",
        "State"
    ];

    // Add column headers to the CSV data
    csv_data.push(columnHeaders.join(","));

    // Get each row data
    var rows = document.querySelectorAll('#mytable tbody tr');
    var numRowsToDuplicate = 3; // Change this to the number of times you want to duplicate each row

    rows.forEach(function (row) {
        // Get each column data
        var cols = row.querySelectorAll('td select');
        
        for (let i = 0; i < numRowsToDuplicate; i++) {
            // Stores each csv row data
            var csvrow = [];
            cols.forEach(function (col) {
                // Get the selected option's value of each <select> element
                var selectedOption = col.options[col.selectedIndex];
                if (selectedOption) {
                    csvrow.push(selectedOption.value);
                } else {
                    csvrow.push(''); // If no option is selected, push an empty string
                }
            });
            // Combine each column value with a comma
            csv_data.push(csvrow.join(","));
        }
    });

    // Combine each row data with a new line character
    csv_data = csv_data.join('\n');

    // We will use this function later to download the data in a csv file
    downloadCSVFile(csv_data);

    return csv_data;
}
function downloadCSVFile(csv_data) {
 
    // Create CSV file object and feed our
    // csv_data into it
    CSVFile = new Blob([csv_data], { type: "text/csv" });
 
    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');
 
    // Download csv file
    temp_link.download = "MyPersonalData.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
 
    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
 
    // Automatically click the link to trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}
 
function sendDataTrainModel() {
    showLoadingScreen();
       // Get the CSV data
       var csv_data = tableToCSV(); // You should implement this function to retrieve your CSV data

       // Create a FormData object to send the CSV file
       var formData = new FormData();
       formData.append('csv_file', new Blob([csv_data], { type: 'text/csv' })); // Assuming tableToCSV returns CSV content as a string
   
       // Get the authorization token
       let authToken = sessionStorage.getItem("authToken");
   
       // Make the POST request to your backend
       fetch('https://mypersonalmatch.bsite.net/trainmodel', {
           method: 'POST',
           body: formData,
           headers: {
               'Authorization': `Bearer ${authToken}`
           }
       })
       .then(response => {
           if (response.status === 401) {
               // Handle 401 Unauthorized here
               console.error('Unauthorized: You are not authenticated.');
               showModal();
           } else if (response.ok) {
           
             // Retrasar la ocultación del div de carga durante 2 segundos
          setTimeout(function() {
            hideLoadingScreen();
            // Redirigir a la página de entrenamiento después de ocultar la pantalla de carga
          
          }, 10000); // Cambia el valor de 2000 a la cantidad de milisegundos que deseas esperar
               return response.text();
           }else if (response.status == 400) {
            showModalFailToTrain();
        } else {
               throw new Error(`HTTP Error: ${response.statusText}`);
           }
       })
       .then(data => {
           console.log(data);
           // Handle the response from the backend here
       })
       .catch(error => {
           console.error('Error:', error);
       });
}

function showModal() {
    // Display the modal
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function OkButtonModal() {
    window.location.href = 'login.html';
   
   
}
function showLoadingScreen() {
    var loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.style.display = "flex";
  }
  
  function hideLoadingScreen() {
    var loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.style.display = "none";
  }
  
  function loginUser() {
    // Mostrar el div de carga cuando se hace clic en el botón de inicio de sesión
    showLoadingScreen();
  
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
  
    var data = {
      email: email,
      password: password
    };
  
    fetch('https://mypersonalmatch.bsite.net/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(async response => {
        if (response.ok) {
          const userId = await response.text();
  
          sessionStorage.setItem("authToken", JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") + "?" + userId);
  
          // Retrasar la ocultación del div de carga durante 2 segundos
          setTimeout(function() {
            hideLoadingScreen();
            // Redirigir a la página de entrenamiento después de ocultar la pantalla de carga
            window.location.href = 'trainmodel.html';
          }, 2000); // Cambia el valor de 2000 a la cantidad de milisegundos que deseas esperar
        } else {
          // Mostrar un mensaje de error en un div debajo del formulario de inicio de sesión
          var errorDiv = document.getElementById('submitErrorMessage');
          errorDiv.innerText = 'Login failed. Please check your credentials.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

function registerUser() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    var data = {
        email: email,
        password: password
    };
    
    fetch('https://mypersonalmatch.bsite.net/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                showModal();
               
            } else {
                // Show an error message in a div below the login form
                var errorDiv = document.getElementById('submitErrorMessage');
                errorDiv.innerText = 'Email already exists!';
            }
        })
        .catch(error => {
            console.error('Error:', error);
    });
}

function logoutUser() {
    showLoadingScreen();
    sessionStorage.clear();
     // Retrasar la ocultación del div de carga durante 2 segundos
     setTimeout(function() {
        hideLoadingScreen();
        // Redirigir a la página de entrenamiento después de ocultar la pantalla de carga
        window.location.href = 'index.html';
      }, 2000); // Cambia el valor de 2000 a la cantidad de milisegundos que deseas esperar
  
}

// Function to initialize the select elements
function initializeSelects() {

    addRowsToTable(10);
    initializeHairSelect();
    initializeBodySelect();
    initializeGenderSelect();
    initializeMusicSelect();
    initializePersonalitySelect();
    initializeSignSelect();
    initializeState();
    //initializeHairSelect();
    //initializeHairSelect();
    //initializeHairSelect();
    //initializeHairSelect();

    
}

function initializeHairSelect(){
    const commonSelects = document.querySelectorAll('.hair');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Black', text: 'Black' },
            { value: 'Blond', text: 'Blond' },
            { value: 'Brown', text: 'Brown' },
            { value: 'Other', text: 'Other' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializeBodySelect(){
    const commonSelects = document.querySelectorAll('.body');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Fat', text: 'Fat' },
            { value: 'Skinny', text: 'Skinny' },
            { value: 'Shred', text: 'Shred' },
            { value: 'Other', text: 'Other' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializeGenderSelect(){
    const commonSelects = document.querySelectorAll('.gender');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Male', text: 'Male' },
            { value: 'Female', text: 'Female' },
            { value: 'Other', text: 'Other' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializeMusicSelect(){
    const commonSelects = document.querySelectorAll('.music');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Rock', text: 'Rock' },
            { value: 'Reggaeton', text: 'Reggaeton' },
            { value: 'Pop', text: 'Pop' },
            { value: 'K-Pop', text: 'K-Pop' },
            { value: 'Other', text: 'Other' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializeSignSelect(){
    const commonSelects = document.querySelectorAll('.sign');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Aries', text: 'Aries' },
            { value: 'Taurus', text: 'Taurus' },
            { value: 'Gemini', text: 'Gemini' },
            { value: 'Cancer', text: 'Cancer' },
            { value: 'Leo', text: 'Leo' },
            { value: 'Virgo', text: 'Virgo' },
            { value: 'Libra', text: 'Libra' },
            { value: 'Scorpio', text: 'Scorpio' },
            { value: 'Sagittarius', text: 'Sagittarius' },
            { value: 'Capricorn', text: 'Capricorn' },
            { value: 'Aquarius', text: 'Aquarius' },
            { value: 'Pisces', text: 'Pisces' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializePersonalitySelect(){
    const commonSelects = document.querySelectorAll('.personality');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: 'Extroversion', text: 'Extroversion' },
            { value: 'Introversion', text: 'Introversion' },
            { value: 'Openness', text: 'Openness' },
            { value: 'Conscientiousness', text: 'Conscientiousness' },
            { value: 'Agreeableness', text: 'Agreeableness' },
            { value: 'Ambiversion', text: 'Ambiversion' },
            { value: 'Other', text: 'Other' }
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}

function initializeState(){
    const commonSelects = document.querySelectorAll('.state');

    // Initialize common select elements
    commonSelects.forEach(select => {
        // Clear any existing options
        select.innerHTML = '';

        // Define the common options
        const commonOptions = [
            { value: '1', text: 'True' },
            { value: '0', text: 'False' },
            // Add more common options as needed
        ];

        // Create option elements and append them to the select
        commonOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.text = optionData.text;
            select.appendChild(option);
        });
    });
}
function addRowsToTable(numRows) {
    const tableBody = document.getElementById("tableBody");

    // Define the list of column names
    const columnNames = ["hair", "gender", "body", "sign", "personality", "music", "state"];

    for (let i = 0; i < numRows; i++) {
        // Create a new row for each iteration
        const newRow = document.createElement("tr");

        // Create and append select elements for each column
        for (const columnName of columnNames) {
            const cell = document.createElement("td");
            const select = document.createElement("select");
            select.name = columnName;
            select.className = columnName;
            cell.appendChild(select);
            newRow.appendChild(cell);
        }

        // Append the new row to the table
        tableBody.appendChild(newRow);
    }
}

function evaluateModel(){
    // Get selected values from the <select> elements
    const hairValue = document.getElementById("hair").value;
    const genderValue = document.getElementById("gender").value;
    const bodyTypeValue = document.getElementById("bodytype").value;
    const signValue = document.getElementById("zodiac").value;
    const personalityValue = document.getElementById("personality").value;
    const musicValue = document.getElementById("musictaste").value;

    // Create an object with the selected values
    const info = {
        hair: hairValue,
        gender: genderValue,
        bodytype: bodyTypeValue,
        zodiac: signValue,
        personality: personalityValue,
        musictaste: musicValue
    };
  
  let authToken = sessionStorage.getItem("authToken");
    // Send the data to your backend API using a POST request
    fetch('https://mypersonalmatch.bsite.net/evaluateModel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(info)
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // If your API returns JSON data
        } else {
            // Handle errors, e.g., display an error message to the user
            console.error('Error:', response.statusText);
        }
    })
    .then(data => {
        // Handle the response data from your API
        displayModal(data);
    })
    .catch(error => {
        // Handle any network or fetch-related errors
        console.error('Fetch error:', error);
    });

    
}

function displayModal(data) {
    // Get references to modal and its content
    const modal = document.getElementById("resultModalEvaluate");
    const modalContent = modal.querySelector(".modal-contentEvaluate");

    // Populate modal content with data
    //document.getElementById("confidence").textContent = `Confidence: ${data.Confidence}`;
    document.getElementById("success").textContent = `Success: ${data.Success}`;
    document.getElementById("fail").textContent = `Fail: ${data.Fail}`;
    //document.getElementById("score").textContent = `Score: ${data.Score}`;
    if(data.State == true){
        document.getElementById("state").textContent = `State: Definilly a match!`;
    }else{
        document.getElementById("state").textContent = `State: Sorry! Won't work!`; 
    }

    // Display the modal
    modal.style.display = "block";

    // Add an event listener to the OK button to close the modal
    const okButton = document.getElementById("okButtonEvaluate");
    okButton.addEventListener("click", function () {
        // Hide the modal when OK is clicked
        modal.style.display = "none";
    });
}

function showModalFailToTrain(){
     // Obtén el modal y el texto del modal por sus IDs
     var modal = document.getElementById('modalTrainModel');
     var modalText = document.getElementById('modalText');
     hideLoadingScreen();
     // Establece el mensaje de error en el modal
     modalText.textContent = "To train a model you must submit a variety of data. Please provide a variety of data in the table (do not put the same data in all rows of the table).";
 
     // Muestra el modal
     modal.style.display = 'block';
 
     // Agrega un manejador de eventos al botón "OK" para cerrar el modal
     var modalOK = document.getElementById('buttonmodalOK');
     modalOK.addEventListener('click', function() {
         modal.style.display = 'none';
     });
}