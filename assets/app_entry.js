// Initialize Firebase
var config = {
  apiKey: "AIzaSyD1nyE-SfenxVwBoxuoL92zFCEsZb0GUqo",
  authDomain: "studybuddy-bc331.firebaseapp.com",
  databaseURL: "https://studybuddy-bc331.firebaseio.com",
  projectId: "studybuddy-bc331",
  storageBucket: "studybuddy-bc331.appspot.com",
  messagingSenderId: "21013901811"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

var name = "";
var street = "";
var city = "";
var state = "";
var zip = "";
var hours = "";
var endtime;

//  disabling form submissions if there are invalid fields
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {

        event.preventDefault();
        var userForm = document.getElementById('userForm');
        var isValid = userForm.checkValidity();

        if (isValid) {

          var zipCodeInput = $('#zip_code_address').val().length;
          var cityInput = $('#city_address').val().length;
          var streetInput = $('#street_address').val().length;
          var nameInput = $('#name').val().length;

          name = $("#name").val().trim();
          street = $("#street_address").val().trim();
          street = street.replace(/\s+/g, '+');
          city = $("#city_address").val().trim();
          city = city.replace(/\s+/g, '+');
          state = $("#state_address").val().trim();
          state = state[1] + state[2]; // just need the two letter acronym e.g. PA from the state address field
          zip = $("#zip_code_address").val().trim();
          hours = $("#hoursAvailable").val().trim();

          // Calculate endtime based on current time
          endtime = moment() + (parseInt(hours) * 3600 * 1000); // time stamp in firebase is miliseconds

          // Clear local storage and store the address to local storage
          localStorage.clear();
          localStorage.setItem("name", name);
          localStorage.setItem("street", street);
          localStorage.setItem("city", city);
          localStorage.setItem("state", state);
          localStorage.setItem("zip", zip);

          // Ajax code to geocod.io to convert text address to latitude and longitude
          var queryURL2 = "https://api.geocod.io/v1.3/geocode?street=" + street + "&city=" + city + "&state=" + state + "&api_key=6446f59bc5ec449c45ce44c9c4466c5f61816e1";

          var tempCoordinates = [];

          $.ajax({
            url: queryURL2,
            method: "GET"
          }).then(function (response) {

            //Storing latitude and longitude
            var lat = response.results[0].location.lat;
            var lng = response.results[0].location.lng;
            tempCoordinates = [lat, lng];

            // Code for handling the push
            database.ref("users").push({
              name: name,
              street: street,
              city: city,
              state: state,
              zip: zip,
              coordinates: tempCoordinates,
              hours: hours,
              infoAdded: firebase.database.ServerValue.TIMESTAMP,
              endtime: endtime
            });

            window.location.href = "maplistselect.html";

          });
        }

        else { alert("Please complete all required fields") }
      }, false);
    });
  }, false);
})();