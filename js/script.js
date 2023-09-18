



$(document).ready(function(){
    if($('#preloader').length){
        $("#preloader").delay(1000).fadeOut('slow', function(){
            $(this).remove();
        });
    }

    // Loading CountryBorders.geo.json and populating Datalist

    // $("#getJson").on("click",function(){

        console.log("Loading CountryBorders.geo.json...");

        $.ajax({

            type: "GET",
            url: "php/countryCodes.php",
            dataType: 'json',

            success: function(result){
                // console.log("The result is: " + (JSON.stringify(result)));

                console.log(result['data'].length);

                console.log("Country Borders loaded...");

                for(index = 0; index < result['data'].length; index++){

                    let countryName = result['data'][index]["properties"]['name'];
           
                    let countryCode = result['data'][index]["properties"]['iso_a3'];

                    $('#countryList').append("<option value=" + countryCode +">" + countryName + "</option>");

                    console.log(countryName + " + " + countryCode);
                }



            }
        })

    // })

    

    var x = document.getElementById("initial-location");
    
    // If user allows gps check, this will return GPS coordinates stored in getCurrentPosition as position.coords.latitude and position.coords.longitude

    function getLocation(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);

        } else{
            $("#initial-location").append("Geolocation is not supported by this browser")
        }
        }
    
    function showPosition(position)
        {
        

        var initialLatitude = position.coords.latitude;
        var initialLongitude = position.coords.longitude;
    
        // Initializing Leaflet Map based on User Current Area
        var map = L.map('map').setView([initialLatitude, initialLongitude], 13);


        // Standard Marker
        var marker = L.marker([initialLatitude, initialLongitude],{
            draggable: true,
            title: "Current location is: \nLattitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude
        }).addTo(map).bindPopup("Hello Ya");


        // Circle Marker
        var circle = L.circle([initialLatitude+0.005, initialLongitude+0.005], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map).bindPopup("I am a circle!");

        // Custom Marker
        var iconOptions = {
            iconUrl: 'resources/location-pin.png',
            iconSize: [50,50]
        }

        var customMarker = L.icon(iconOptions);
        var markerOptions = {
            icon: customMarker,
            draggable: true,
            title: "I am cool marker!",

        }
        var marker = L.marker([initialLatitude-0.005, initialLongitude-0.005], markerOptions).addTo(map);





        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        $("#initial-location").append("Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude);  
    }
    
    getLocation()


    $("#countryForm").submit(function(event){


        event.preventDefault();

        // Check that user submit only valid country

        var userValue = $("#countryName").val();

        var obj = $("#countryList").find("option[value='" + userValue + "']");

        if(obj != null && obj.length > 0){
            alert("valid");  // allow form submission
            console.log("Form was submited");
            let countryCode = $("#countryName").val();
           
            console.log("Country Code is: " + countryCode);
        }
        
        else{
            alert("Invalid Option"); // don't allow form submission and reset the form
            document.getElementById("countryForm").reset();
        }    

        
    })


});