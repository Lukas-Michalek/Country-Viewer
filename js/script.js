

$(window).on("load", function(){
    if($('#preloader').length){
        $("#preloader").delay(1000).fadeOut('slow', function(){
            $(this).remove();
        });
    }

    

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

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        $("#initial-location").append("Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude);  
    }
    
    getLocation()


    

});