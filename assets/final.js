$(document).ready(function () {
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

    // $("#enterform").on("click", function (event) {

    // event.preventDefault();

    // Retrieve user and chosen study buddy locations from local storage
    var userCoordinates = localStorage.getItem("userCoordinates");
    userCoordinates = userCoordinates.split(',');
    var userName = localStorage.getItem("name");
    var chosenCoordinates = localStorage.getItem("chosenCoordinates");
    chosenCoordinates = chosenCoordinates.split(',');
    var chosenName = localStorage.getItem("chosenName");

    // Calculating the midpoint between user and selected student
    var midpointCoordinates = [];
    var midpointLat;
    var midpointLong;


    // Determining latitude
    if (userCoordinates[0] > chosenCoordinates[0]) {
        midpointLat = parseFloat(chosenCoordinates[0]) + Math.abs((parseFloat(userCoordinates[0]) - parseFloat(chosenCoordinates[0])) / 2);
    } else if (userCoordinates[0] < chosenCoordinates[0]) {
        midpointLat = parseFloat(chosenCoordinates[0]) - Math.abs((parseFloat(userCoordinates[0]) - parseFloat(chosenCoordinates[0])) / 2);
    } else if (userCoordinates[0] === chosenCoordinates[0]) {
        midpointLat = userCoordinates[0];
    }

    // Determining longitude (this is a little trickier because longitude is a negative number, hence the parseFloats)
    if (parseFloat(userCoordinates[1]) > parseFloat(chosenCoordinates[1])) {
        midpointLong = parseFloat(userCoordinates[1]) - Math.abs((parseFloat(userCoordinates[1]) - parseFloat(chosenCoordinates[1])) / 2);
    } else if (parseFloat(userCoordinates[1]) < parseFloat(chosenCoordinates[1])) {
        midpointLong = parseFloat(chosenCoordinates[1]) - Math.abs((parseFloat(chosenCoordinates[1]) - parseFloat(userCoordinates[1])) / 2);
    } else if (userCoordinates[1] === chosenCoordinates[1]) {
        midpointLong = userCoordinates[1];
    }

    midpointCoordinates = [midpointLat, midpointLong];

    // var street = localStorage.getItem("street");
    // var city = localStorage.getItem("city");
    // var state = localStorage.getItem("state");
    // var location = street + city + state;
    // user city and state from form here


    // Determining map zoom level and number of cafes based on distance between user and chosen buddy
    var distance = localStorage.getItem("distance");
    var zoom;
    var limit;
    if (distance < 500) {
        zoom = 16;
        limit = 5;
    } else if (distance < 2500) {
        zoom = 15;
        limit = 10;
    } else if (distance < 5000) {
        zoom = 14;
        limit = 10;
    } else if (distance < 10000) {
        zoom = 13;
        limit = 20;
    } else if (distance < 20000) {
        zoom = 12;
        limit = 20;
    } else {
        zoom = 11;
        limit = 20;
    }


    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=cafe&limit=" + limit + "&latitude=" + midpointLat + "&longitude=" + midpointLong + "&radius=" + distance;
    //api call to Yelp for cafe names and coordinates 
    $.ajax({
        url: queryURL,
        headers: {
            'Authorization': 'Bearer 41tlAJAR11jbsyWiat9oNyy0ohqgPTYunAzX3vPpHAAWX8uAi4mtLb2XbpPu0IS3o_CL-nlwYIYZyzRWlGiFmHDn7JhFKbCKADufGYvnFuj5vHVkf3upw1EXHAccXHYx'
        },
        method: "GET"
    }).then(function (response) {

        console.log(response);

        //create the map
        var map = tomtom.L.map('map', {
            key: 'sYDNGj8wET1YxX9MvoISZSyPtefiwHDM',
            basePath: '/sdk',
            center: midpointCoordinates,
            zoom: zoom
        });

        //Adding user flag icon
        var userMarker = tomtom.L.marker(userCoordinates).addTo(map).bindPopup("Your are here").openPopup();

        //Adding chosen study buddy icon
        var chosenMarker = tomtom.L.marker(chosenCoordinates, {
            icon: tomtom.L.icon({
                iconUrl: 'sdk/images/ic_map_poi_027-black.png',
                iconSize: [40, 40]
            })
        }).addTo(map).bindPopup(chosenName);

        // Adding midpoint as a marker(to check if the calculations are correct)
        // var midpointMarker = tomtom.L.marker(midpointCoordinates).addTo(map).bindPopup('Midpoint (delete this popup once you know it works)');

        for (var i = 0; i < response.businesses.length; i++) {
            var lat = response.businesses[i].coordinates.latitude;
            var lng = response.businesses[i].coordinates.longitude;
            var coordinates = [lat, lng];
            var name = response.businesses[i].name;
            var webUrl = response.businesses[i].url;
            // store in firebase

            tomtom.L.marker(coordinates, {
                icon: tomtom.L.icon({
                    iconUrl: 'assets/coffee.png',
                    iconSize: [30, 30]
                })
            }).addTo(map).bindPopup(name);

        };

    }); // close ajax

}); // close document.ready