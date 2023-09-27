
// import worldCountries from "./countryBorders"


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
                console.log("The result from countryBorders.geo.json is: " + (JSON.stringify(result)));

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
    
    function showPosition(position){
        

        var initialLatitude = position.coords.latitude;
        var initialLongitude = position.coords.longitude;
    

        // Shows current coordinates
        $("#curentCoordinates").append("<b>Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude + "</b>"); 


        // Initializing Leaflet Map based on User Current Area
        var map = L.map('map').setView([initialLatitude, initialLongitude], 6);

        
        // This is the Base Layer I am using
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);


        // ******************************************************************* //
        // *****        CUSTOM MARKER       ********************************** //
        // ******************************************************************* //
        
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
        
        // ADDING MARKER TO MAP
        var marker = L.marker([initialLatitude, initialLongitude], markerOptions).addTo(map);

        //******************************************************************* //
        // *****        COUNTRY BORDERS - GEOJSON    ************************ //
        // ******************************************************************* //



        // Add country borders
        // *This was working!
        
        L.geoJSON(worldCountries,
            {           
                onEachFeature: onEachFeature,
                style: style
       
        }).addTo(map);

        // marker.bindPopup(feature.properties.name);

        // Updates Coordinates in #curentCoordinates with the coordinates of place where user clicked
        map.on('click', getCoords);


        function style(feature){
            return{
                fillColor: 'yellow',                
                fillOpacity: 0.2,
                color: "orange"
            }
        }

        function onEachFeature(feature,layer){

            $('#popUpDiv').empty();

            
            
            const popUpDiv = document.createElement("div"); 
            popUpDiv.setAttribute("id", "popUpDiv");
            
            const mainMenuDiv = document.createElement("div");
            mainMenuDiv.setAttribute("id","mainMenuDiv");

            const mainMenuText = document.createElement("p");
            mainMenuText.setAttribute("id","mainMenuText");
            mainMenuText.innerHTML = `What would you like to know about <b>${feature.properties.name}</b> ?<br><br>`;

            mainMenuDiv.append(mainMenuText);

            // popUpDiv.innerHTML = `What would you like to know about <b>${feature.properties.name}</b> ?<br><br>`;
            
            
            
            const generalInfoButton = document.createElement("button");
            generalInfoButton.setAttribute("id", "generalInfoButton");
            generalInfoButton.innerHTML = "General Information";

            const weatherInfoButton = document.createElement("button");
            weatherInfoButton.setAttribute("id", "weatherButton");
            weatherInfoButton.innerHTML = "Current Weather";

            mainMenuDiv.appendChild(generalInfoButton);
            mainMenuDiv.appendChild(weatherInfoButton);

            popUpDiv.append(mainMenuDiv);

            generalInfoButton.onclick = function() {

                console.log("The cca3 is: " + feature.properties.iso_a3);

                $.ajax({
                    url: 'php/restCountries.php',
                    type: 'POST',
                    dataType: 'json',

                    // Note that iso_a2 is used to locate the country in restCountries.php

                    data:{
                        cca3: feature.properties.iso_a3,
                    },

                    success: function(result){

                        if(result.status.name == "ok"){

                        alert('Data Received Fine!');

                        // console.log("The result from restCountries is: " + (JSON.stringify(result)));

                        // $("#popUpDiv").empty();
                        $("#mainMenuDiv").hide();

                        // Creates Div that holds all main buttons and general text. So everything will append to this div and this div will append to popUpDiv so I can easilly hide/show it as needed

                        
                        if(document.getElementById("generalInfoMenuDiv")){

                            $("#generalInfoMenuDiv").show();
                        
                        } else {
                        
                            const generalInfoMenuDiv = document.createElement("div");
                            generalInfoMenuDiv.setAttribute('id','generalInfoMenuDiv');


                            const generalInfoText = document.createElement("p");
                            generalInfoText.setAttribute('id', 'generalInfoText');
                            generalInfoText.innerHTML = ('<p><h3>General Information</h3><hr>What would you like to know specifically?</p>');

                                // * This Works!
                            // popUpDiv.appendChild(generalInfoText)
                            generalInfoMenuDiv.appendChild(generalInfoText);
                            
                        

                            // ************** Buttons *********** //

                            // * Official and Native names:

                            const countryNameButton = document.createElement("button");
                            countryNameButton.setAttribute("id", "countryNameButton");
                            countryNameButton.innerHTML = "Country Names";
                            
                            generalInfoMenuDiv.appendChild(countryNameButton);
                            // popUpDiv.appendChild(countryNameButton);


                            // * Currency Button

                            const currencyButton = document.createElement("button");
                            currencyButton.setAttribute("id","currencyButton");
                            currencyButton.innerHTML = "Official Currency";

                            generalInfoMenuDiv.appendChild(currencyButton);

                            // * Capital City
                            const capitalCityButton = document.createElement("button");
                            capitalCityButton.setAttribute("id","capitalCityButton");
                            capitalCityButton.innerHTML = `Capital City`;

                            generalInfoMenuDiv.appendChild(capitalCityButton);

                            // * Region and Subregion

                            const regionButton = document.createElement("button");
                            regionButton.setAttribute("id","regionButton");
                            regionButton.innerHTML = 'Location';

                            generalInfoMenuDiv.appendChild(regionButton);

                            // * Spoken Languages

                            const languagesButton = document.createElement("button");
                            languagesButton.setAttribute("id", "languagesButton");
                            languagesButton.innerHTML = "Official Languages";

                            generalInfoMenuDiv.appendChild(languagesButton);



                            // * Main Menu Back Button
                            const mainMenuBackButton = document.createElement('button');
                            mainMenuBackButton.setAttribute("id", "mainMenuBackButton");
                            mainMenuBackButton.innerHTML = "Main Menu Back";
                            
                            generalInfoMenuDiv.append(mainMenuBackButton);
                            // popUpDiv.append(mainMenuBackButton);
                        

                            popUpDiv.append(generalInfoMenuDiv);

                        }

                        countryNameButton.onclick = function(){

                            // $("#popUpDiv").empty();
                            // $("#generalInfoText").toggle();
                            // popUpDiv.removeChild(countryNameButton);
                            
                            // $("#countryNameButton").toggle();

                            $("#generalInfoMenuDiv").hide();

                            if(document.getElementById("countryNameDiv")){

                                $("#countryNameDiv").show();

                            } else {
                                
                                    const countryNameDiv = document.createElement("div");
                                    countryNameDiv.setAttribute('id','countryNameDiv');
                                    $("#popUpDiv").append(countryNameDiv);

                                    var nativeNamekey = Object.keys(result['name']["nativeName"]);
                                    console.log("Keys are: " + nativeNamekey);

                                    

                                    $("#countryNameDiv").append("<p>The english name is: <b>" + result['name']['common'] + "</b></p>")
                                    
                                    $("#countryNameDiv").append("<p>The official english name is: <b>" + result['name']['official'] + "</b></p>")

                                    if(nativeNamekey.length > 1){
                                        $("#countryNameDiv").append(`<p><b>${feature.properties.name}, however, has more than one official name. These names are: </b></p>`)
                                    }

                                    for(index = 0; index < nativeNamekey.length; index++){

                                        var firstNativeKey = nativeNamekey[index];
                                        
                                       

                                        $("#countryNameDiv").append("<p>The native offical name is: <b>" + result['name']["nativeName"][firstNativeKey]["official"] + "</b></p>")

                                        $("#countryNameDiv").append("<p>The native name is: <b>" + result['name']["nativeName"][firstNativeKey]["common"] + "</b></p>")

                                        $("#countryNameDiv").append(`<hr><hr>`);
                                    }

                                    
                                    // Country NAme Back Button

                                    const countryNameBackButton = document.createElement("button");
                                    countryNameBackButton.setAttribute("id", "countryNameBackButton");
                                    countryNameBackButton.innerHTML = "Country Back";

                                    
                                    $("#countryNameDiv").append(countryNameBackButton);
                                    
                                    // $("#popUpDiv").append(countryNameDiv);
                            }
                          
                            countryNameBackButton.onclick = function(){

                                $("#countryNameDiv").hide();
                                $("#generalInfoMenuDiv").show();
                                // $("#countryNameButton").show();
                                // $("#popUpDiv").append("<h3>General Information</h3><hr><br><p>What would you like to know?:</p>");

                                // popUpDiv.appendChild(countryNameButton);

                            }

                        }

                        currencyButton.onclick = function(){

                            $("#generalInfoMenuDiv").hide();

                            // If this currencyButton div was laready created, there is no need to Re-Create it and it was just hidden by pressing Back Button, so we need to show it. If not than it needs to be created

                            if(document.getElementById("currencyDiv")){

                                $("#currencyDiv").show();

                            } else {

                                const currencyDiv = document.createElement("div");
                                currencyDiv.setAttribute('id','currencyDiv');
                                $("#popUpDiv").append(currencyDiv);
                               
                                var currencyNamesArr = Object.keys(result['currency']);

                                console.log('Currency names are: ' + currencyNamesArr);


                                var currencyName = currencyNamesArr[0];

                                console.log("Currency name is: " + currencyName);

                                
                                $("#currencyDiv").append(`<p>The official currency of ${feature.properties.name} is: <b>${result["currency"][currencyName]["name"]}</b></p>`);

                                $("#currencyDiv").append(`<p>The official symbol of ${result["currency"][currencyName]["name"]} is: <b>${result["currency"][currencyName]["symbol"]}</b></p>`);


                                const currencyBackButton = document.createElement("button");
                                currencyBackButton.setAttribute("id","currencyBackButton");
                                currencyBackButton.innerHTML = "Currency Back Button";
                               
                                $("#currencyDiv").append(currencyBackButton);
                        
                            }

                            currencyBackButton.onclick = function(){

                                $("#currencyDiv").hide();
                                $("#generalInfoMenuDiv").show();

                            }


                        }

                        capitalCityButton.onclick = function(){

                            $("#generalInfoMenuDiv").hide();

                            if(document.getElementById("capitalCityDiv")){

                                $("#capitalCityDiv").show();

                            } else {
                                
                                const capitalCityDiv = document.createElement("div");
                                capitalCityDiv.setAttribute('id','capitalCityDiv');
                                $("#popUpDiv").append(capitalCityDiv);

                                $("#capitalCityDiv").append(`<p><h5>The Capital city of ${feature.properties.name} is: <b>${result['capital']}</b></h5></p>`);

                                console.log("Capital is: " + result['capital']);

                                const capitalCityBackButton = document.createElement("button");
                                capitalCityBackButton.setAttribute("id","capitalCityBackButton");
                                capitalCityBackButton.innerHTML = "Capital City Back Button";

                                $("#capitalCityDiv").append(capitalCityBackButton);

                            }

                            // Capital City Back Button
                            capitalCityBackButton.onclick = function(){

                                
                                $("#capitalCityDiv").hide();
                                $("#generalInfoMenuDiv").show();

                            }

                        }

                        regionButton.onclick = function(){

                            $("#generalInfoMenuDiv").hide();

                            if(document.getElementById("regionDiv")){

                                $("#regionDiv").show();

                            } else {

                                
                                const regionDiv = document.createElement("div");
                                regionDiv.setAttribute("id", "regionDiv");
                                $("#popUpDiv").append(regionDiv);

                            

                                $("#regionDiv").append(`<p><b>${feature.properties.name}</b> is located in <b><i>${result['region']}</i></b>, \nmore specifically in <b><i>${result['subregion']}</i></b></p>`);

                                const regionBackButton = document.createElement("button");
                                regionBackButton.setAttribute("id","regionBackButton");
                                regionBackButton.innerHTML = "Region Back Button";
                                $("#regionDiv").append(regionBackButton);
                            }

                            regionBackButton.onclick = function(){

                                $("#regionDiv").hide();
                                $("#generalInfoMenuDiv").show();
                            }




                        }

                        languagesButton.onclick = function(){

                            $("#generalInfoMenuDiv").hide();

                            if(document.getElementById("languagesDiv")){
                                $("#languagesDiv").show();
                            } else{

                                const languagesDiv = document.createElement("div");
                                languagesDiv.setAttribute("id","languagesDiv");
                                $("#popUpDiv").append(languagesDiv);

                                const allLangugesArr = Object.keys(result['languages']);

                                $("#languagesDiv").append(`<p><h3>People in ${feature.properties.name} speaks these languages:<br></h3></p>`);

                                for(index = 0; index < allLangugesArr.length; index++){

                                    let language = allLangugesArr[index]

                                    $("#languagesDiv").append(`<p><b><i>- ${result["languages"][language]}</i></b></p>`)

                                }

                                const languagesBackButton = document.createElement("button");
                                languagesBackButton.setAttribute("id","languagesBackButton");
                                languagesBackButton.innerHTML = "Languages Back Button";

                                $("#languagesDiv").append(languagesBackButton);
                                
                            }

                            languagesBackButton.onclick = function(){

                                $("#languagesDiv").hide();
                                $("#generalInfoMenuDiv").show();

                            }

                            
                        }

                        mainMenuBackButton.onclick = function(){
                            $("#generalInfoMenuDiv").hide();
                            $("#mainMenuDiv").show();

                        }

                    }

                    },

                    error: function(jqXHR, textStatus, errorThrown){
                        console.log("The data have not been sent");
                        
                        }


                })
              }
           
            layer.on({
                mouseover : highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
               
                })
                .bindPopup(popUpDiv)
                                
        }
   
        // bindPopup(feature.properties.name)

        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
        
            layer.bringToFront();
        }

        function resetHighlight(e) {
            var layer = e.target;
            
            layer.setStyle({
                fillColor: 'yellow',                
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.2,
                color: "orange"                
            });

        }

        // Center on the map into upon click 
        function zoomToFeature(e) {

            map.fitBounds(e.target.getBounds());

            
        }

        function getCoords(e){
            var coord=e.latlng.toString().split(','); // LatLng(50.876459, 21.263776)

            var lat=coord[0].replace('LatLng(', '');
            var long=coord[1].replace(')','');

            // L.marker(e.latlng).addTo(map);


            $("#curentCoordinates").empty();
            $("#curentCoordinates").append("<b>Latitude: " + lat + 
            "<br>Longitude: " + long + "</b>"); 

           

        }



         
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

})