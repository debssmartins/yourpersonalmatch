
/** FUNCIONES RELACIONADAS A LA TABLA */

//PASA LA TABLA DE HTML A CSV 
function tableToCSV() {
    var csv_data = [];
    var columnHeaders = [
        "Hair",
        "Gender",
        "BodyType",
        "Zodiac",
        "Personality",
        "MusicTaste",
        "State"
    ];

    csv_data.push(columnHeaders.join(","));
    var rows = document.querySelectorAll('#mytable tbody tr');
    var numRowsToDuplicate = 3; 

    rows.forEach(function (row) {
        var cols = row.querySelectorAll('td select');
        
        for (let i = 0; i < numRowsToDuplicate; i++) {
            var csvrow = [];
            cols.forEach(function (col) {
                var selectedOption = col.options[col.selectedIndex];
                if (selectedOption) {
                    csvrow.push(selectedOption.value);
                } else {
                    csvrow.push(''); 
                }
            });
            csv_data.push(csvrow.join(","));
        }
    });
    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data);
    return csv_data;
}

//DESCARGA LA TABLA EN LOCAL
function downloadCSVFile(csv_data) {

    CSVFile = new Blob([csv_data], { type: "text/csv" });
    var temp_link = document.createElement('a');
    temp_link.download = "MyPersonalData.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
}

//INICIALIZA LA TABLA DEL HTML CON LOS VALORES
function initializeSelects() {

    addRowsToTable(10);
    initializeHairSelect();
    initializeBodySelect();
    initializeGenderSelect();
    initializeMusicSelect();
    initializePersonalitySelect();
    initializeSignSelect();
    initializeState();
    
}

function initializeHairSelect(){
    const commonSelects = document.querySelectorAll('.hair');

    commonSelects.forEach(select => {
        select.innerHTML = '';

        const commonOptions = [
            { value: 'Black', text: 'Black' },
            { value: 'Blond', text: 'Blond' },
            { value: 'Brown', text: 'Brown' },
            { value: 'Other', text: 'Other' },
            
        ];

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

    commonSelects.forEach(select => {
        select.innerHTML = '';

        const commonOptions = [
            { value: 'Fat', text: 'Fat' },
            { value: 'Skinny', text: 'Skinny' },
            { value: 'Shred', text: 'Shred' },
            { value: 'Other', text: 'Other' },
        ];

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

    commonSelects.forEach(select => {

        select.innerHTML = '';
        const commonOptions = [
            { value: 'Male', text: 'Male' },
            { value: 'Female', text: 'Female' },
            { value: 'Other', text: 'Other' },
            
        ];

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

    commonSelects.forEach(select => {

        select.innerHTML = '';

        const commonOptions = [
            { value: 'Rock', text: 'Rock' },
            { value: 'Reggaeton', text: 'Reggaeton' },
            { value: 'Pop', text: 'Pop' },
            { value: 'K-Pop', text: 'K-Pop' },
            { value: 'Other', text: 'Other' },

        ];

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

    commonSelects.forEach(select => {

        select.innerHTML = '';

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
        ];

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

    commonSelects.forEach(select => {
        select.innerHTML = '';

        const commonOptions = [
            { value: 'Extroversion', text: 'Extroversion' },
            { value: 'Introversion', text: 'Introversion' },
            { value: 'Openness', text: 'Openness' },
            { value: 'Conscientiousness', text: 'Conscientiousness' },
            { value: 'Agreeableness', text: 'Agreeableness' },
            { value: 'Ambiversion', text: 'Ambiversion' },
            { value: 'Other', text: 'Other' }
        ];

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

    commonSelects.forEach(select => {
        select.innerHTML = '';

        const commonOptions = [
            { value: '1', text: 'Yes' },
            { value: '0', text: 'No' },
        ];

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

    const columnNames = ["hair", "gender", "body", "sign", "personality", "music", "state"];

    for (let i = 0; i < numRows; i++) {
        const newRow = document.createElement("tr");

        for (const columnName of columnNames) {
            const cell = document.createElement("td");
            const select = document.createElement("select");
            select.name = columnName;
            select.className = columnName;
            cell.appendChild(select);
            newRow.appendChild(cell);
        }

        tableBody.appendChild(newRow);
    }
}
 
/**FUNCIONES RELACIONADAS AL ENTRENO Y EVALUACION DEL MODELO */

//ENVIA EL CSV A LA API PARA ENTRENAR EL MODELO
function sendDataTrainModel() {
    showLoadingScreen();
       var csv_data = tableToCSV();
       var formData = new FormData();
       formData.append('csv_file', new Blob([csv_data], { type: 'text/csv' })); 
       let authToken = sessionStorage.getItem("authToken");
   
       fetch('https://mypersonalmatch.azurewebsites.net/trainmodel', {
           method: 'POST',
           body: formData,
           headers: {
               'Authorization': `Bearer ${authToken}`
           }
       })
       .then(response => {
           if (response.status === 401) {
               console.error('Unauthorized: You are not authenticated.');
               showModal();
           } else if (response.ok) {
           
          setTimeout(function() {
            hideLoadingScreen();
          
          }, 10000); 
          showModalTrainModel();
               return response.text();
              
           }else if (response.status == 400) {
            showModalFailToTrain();
            
        } else {
               throw new Error(`HTTP Error: ${response.statusText}`);
           }
       })
       .then(data => {
        
           console.log(data);
       })
       .catch(error => {
           console.error('Error:', error);
       });
}


//EVALUA EL MODELO CARGADO Y ENSEÑA EL RESULTADO

function evaluateModel(){
    showLoadingScreen();
    var errorDiv = document.getElementById('submitErrorMessage');
    const hairValue = document.getElementById("hair").value;
    const genderValue = document.getElementById("gender").value;
    const bodyTypeValue = document.getElementById("bodytype").value;
    const signValue = document.getElementById("zodiac").value;
    const personalityValue = document.getElementById("personality").value;
    const musicValue = document.getElementById("musictaste").value;

    const info = {
        hair: hairValue,
        gender: genderValue,
        bodytype: bodyTypeValue,
        zodiac: signValue,
        personality: personalityValue,
        musictaste: musicValue
    };
  
  let authToken = sessionStorage.getItem("authToken");
    fetch('https://mypersonalmatch.azurewebsites.net/evaluateModel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(info)
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            console.error('Error:', response.statusText);
            hideLoadingScreen();
            errorDiv.style.display = 'block';
            errorDiv.innerText = 'No model was found! You should train your model first!';
        }
    })
    .then(data => {
        hideLoadingScreen();
        displayModal(data);
        errorDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Fetch error:', error);
        hideLoadingScreen();
    });

    
}


//**FUNCIONES DE MODAL Y BOTONES*/
function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
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
  
  function displayModal(data) {
    const modal = document.getElementById("resultModalEvaluate");
    const modalContent = modal.querySelector(".modal-contentEvaluate");
    document.getElementById("success").textContent = `Success: ${data.Success}`;
    document.getElementById("fail").textContent = `Fail: ${data.Fail}`;
    if(data.State == true){
        document.getElementById("state").textContent = `State: Definilly a match!`;
    }else{
        document.getElementById("state").textContent = `State: Sorry! Won't work!`; 
    }
    modal.style.display = "block";
    const okButton = document.getElementById("okButtonEvaluate");
    okButton.addEventListener("click", function () {
        modal.style.display = "none";
    });
}

function showModalFailToTrain(){
     var modal = document.getElementById('modalTrainModel');
     var modalText = document.getElementById('modalText');
     hideLoadingScreen();
     modalText.textContent = "To train a model you must submit a variety of data. Please provide a variety of data in the table (do not put the same data in all rows of the table).";
     modal.style.display = 'block';
     var modalOK = document.getElementById('buttonmodalOK');
     modalOK.addEventListener('click', function() {
         modal.style.display = 'none';
     });
}

function showModalTrainModel(){
    var modal = document.getElementById('modalTrainModel');
    var modalText = document.getElementById('modalText');
    modalText.textContent = "Your model has been successfully trained. You will now be redirected to the page to evaluate and check if the person you're interested in is a match!";
    modal.style.display = 'block';
    var modalOK = document.getElementById('buttonmodalOK');
    modalOK.addEventListener('click', function() {
        modal.style.display = 'none';
        window.location.href = 'evaluate.html';
    });
}

function checkMail(email){
    var errorDiv = document.getElementById('submitErrorMessage');
    if(email.includes("@")){
        errorDiv.style.display = 'block';
        errorDiv.innerText = 'The username '+email+' is invalid due to the presence of the character @. For reference, consider the example username: Debora_Jesus.';
    }else{
        errorDiv.style.display = 'none';
    }
}

function setupInputEvent(variable) {
    var inputField = document.getElementById(variable);

    if (inputField) {
      inputField.addEventListener('input', function(event) {
        checkMail(inputField.value)
        console.log('Input value:', event.target.value);
      });
    } else {
      console.error('Input field not found!');
    }
  }

/**FUNCIONES DE LOGIN, REGISTRO Y LOGOUT */
  function loginUser() {
    showLoadingScreen();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
      email: email,
      password: password
    };
  
    fetch('https://mypersonalmatch.azurewebsites.net/login', {
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
          setTimeout(function() {
            hideLoadingScreen();
            window.location.href = 'trainmodel.html';
          }, 2000); 
        } else {
          var errorDiv = document.getElementById('submitErrorMessage');
          hideLoadingScreen();
          errorDiv.innerText = 'Login failed. Please check your credentials.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


 
  function registerUser() {
    showLoadingScreen();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
        Email: email,
        Password: password
    };
    
    fetch('https://mypersonalmatch.azurewebsites.net/register', {
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
            var errorDiv = document.getElementById('submitErrorMessage');
            errorDiv.innerText = 'Email already exists!';
            hideLoadingScreen();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoadingScreen();
    });
}

function logoutUser() {
    showLoadingScreen();
    sessionStorage.clear();
     setTimeout(function() {
        hideLoadingScreen();
        window.location.href = 'index.html';
      }, 2000);
  
}


/**FUNCION QUE ENVIA SMS */

 function submitMessage(){
    showLoadingScreen();
    var sms = document.getElementById("messageContact").value;
    var email = document.getElementById("emailContact").value;
    var phone = document.getElementById("phoneContact").value;
    var name = document.getElementById("nameContact").value;
    var data = {
        Email: email,
        Sms: sms,
        Phone: phone,
        Name: name

    };
      fetch('https://mypersonalmatch.azurewebsites.net/sendsms', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (response.ok) {
            hideLoadingScreen();
            showModal();
            setTimeout(function() {
            hideModal();
            var errorDiv = document.getElementById('submitErrorMessage');
            errorDiv.style.display = 'none';
            const formToReset = document.getElementById('contactForm');
            formToReset.reset();
          }, 3000); 
        } else {
            hideLoadingScreen();
            var errorDiv = document.getElementById('submitErrorMessage');
            errorDiv.style.display = 'block';
            errorDiv.innerText = 'An error occur while sending the message!';
            
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


/**Eventos que verifican los inputs de username*/
document.addEventListener('DOMContentLoaded', setupInputEvent('email'));
document.addEventListener('DOMContentLoaded', setupInputEvent('emailContact'));
