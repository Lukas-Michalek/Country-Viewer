// import worldCountries from "./countryBorders"

$(document).ready(function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }

  // Loading CountryBorders.geo.json and populating Datalist

  // $("#getJson").on("click",function(){

  console.log("Loading CountryBorders.geo.json...");

  $.ajax({
    type: "GET",
    url: "php/countryCodes.php",
    dataType: "json",

    success: function (result) {
      console.log(
        "The result from countryBorders.geo.json is: " + JSON.stringify(result)
      );

      console.log(result["data"].length);

      console.log("Country Borders loaded...");

//  ** 10:23 CHANGING OPTION VALUE

      for (index = 0; index < result["data"].length; index++) {
        let countryName = result["data"][index]["properties"]["name"];

        let countryCode = result["data"][index]["properties"]["iso_a3"];


        $("#countryList").append(
          "<option id= "+ countryCode + " value=" + countryCode + ">" + countryName + "</option>"
        );

        console.log(countryName + " + " + countryCode);
      }

    },
  });

  // })

  var x = document.getElementById("initial-location");

  // If user allows gps check, this will return GPS coordinates stored in getCurrentPosition as position.coords.latitude and position.coords.longitude

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);

    } else {
      $("#initial-location").append(
        "Geolocation is not supported by this browser"
      );
    }
  }

  function showPosition(position) {
    var initialLatitude = position.coords.latitude;
    var initialLongitude = position.coords.longitude;

    // Shows current coordinates
    // $("#curentCoordinates").append("<b>Latitude: " + position.coords.latitude +
    // "<br>Longitude: " + position.coords.longitude + "</b>");

    // create map object, tell it to live in 'map' div and give initial latitude, longitude, zoom values
    var map = L.map("map").setView([initialLatitude, initialLongitude], 6);

    //  add base map tiles from OpenStreetMap and attribution info to 'map' div
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Positioning if Atribution on Leaflet (map) div
    map.attributionControl.setPosition('bottomright');
    
    // Positioning of Zoom Controls(+,-)
    map.zoomControl.setPosition('topright');



  //   L.control.zoom({
  //     position: 'bottomright'
  // }).addTo(map);

    // ******************************************************************* //
    // *****        CUSTOM MARKER       ********************************** //
    // ******************************************************************* //

    // * Initial Location marker
    var iconOptions = {
      iconUrl: "resources/location-pin.png",
      iconSize: [50, 50],
    };

    var customMarker = L.icon(iconOptions);

    var markerOptions = {
      icon: customMarker,
      draggable: true,
      title: "This is my starting Location",
    };

    // ADDING MARKER TO MAP
    var marker = L.marker(
      [initialLatitude, initialLongitude],
      markerOptions
    ).addTo(map);

    //******************************************************************* //
    // *****        COUNTRY BORDERS - GEOJSON    ************************ //
    // ******************************************************************* //

    // Add country borders

    L.geoJSON(worldCountries, {
      onEachFeature: onEachFeature,
      style: style,
    }).addTo(map);

    

    // marker.bindPopup(feature.properties.name);

    // Updates Coordinates in #curentCoordinates with the coordinates of place where user clicked
    map.on("click", getCoords);

    function style(feature) {
      return {
        fillColor: "yellow",
        fillOpacity: 0.2,
        color: "orange",
      };
    }

    function onEachFeature(feature, layer) {
      
      
      
      $("#popUpDiv").empty();

      const popUpDiv = document.createElement("div");
      popUpDiv.setAttribute("id", "popUpDiv");

      const mainMenuDiv = document.createElement("div");
      mainMenuDiv.setAttribute("id", "mainMenuDiv");
      mainMenuDiv.setAttribute("class", "mainMenuDivClass");

      popUpDiv.append(mainMenuDiv);

      const mainMenuTextDiv = document.createElement("div");
      mainMenuTextDiv.setAttribute('id','mainMenuTextDiv');
      mainMenuTextDiv.setAttribute('class','mainMenuTextDivClass');
      mainMenuDiv.append(mainMenuTextDiv);

      const mainMenuText = document.createElement("p");
      mainMenuText.setAttribute("id", "mainMenuText");
      mainMenuText.innerHTML = `What would you like to know about ${feature.properties.name}?`;

      mainMenuTextDiv.append(mainMenuText);

      // popUpDiv.innerHTML = `What would you like to know about <b>${feature.properties.name}</b> ?<br><br>`;

      const mainMenuButtonsDiv = document.createElement('div');
      mainMenuButtonsDiv.setAttribute('id','mainMenuButtonsDiv');
      mainMenuButtonsDiv.setAttribute('class','mainMenuButtonsDivClass');
      mainMenuDiv.append(mainMenuButtonsDiv);
      
      
      const generalInfoButton = document.createElement("button");
      generalInfoButton.setAttribute("id", "generalInfoButton");
      generalInfoButton.setAttribute("class", "mainMenuButtonClass");
      generalInfoButton.innerHTML = "General Information";

      const weatherInfoButton = document.createElement("button");
      weatherInfoButton.setAttribute("id", "weatherInfoButton");
      weatherInfoButton.setAttribute("class", "mainMenuButtonClass");
      weatherInfoButton.innerHTML = "Current Weather";

      const currencyConverterButton = document.createElement('button');
      currencyConverterButton.setAttribute('id','currencyConverterButton');
      currencyConverterButton.setAttribute('class','mainMenuButtonClass');
      currencyConverterButton.innerHTML = 'Currency Converter';

      const wikiInfoButton = document.createElement('button');
      wikiInfoButton.setAttribute('id','wikiInfoButton');
      wikiInfoButton.setAttribute('class','mainMenuButtonClass');
      wikiInfoButton.innerHTML = 'Wiki Information';


      mainMenuButtonsDiv.append(generalInfoButton);
      mainMenuButtonsDiv.append(weatherInfoButton);
      mainMenuButtonsDiv.append(currencyConverterButton);
      mainMenuButtonsDiv.append(wikiInfoButton);


     

    //   Leaflet-Popup Close Button
    // .leaflet-popup-close-button

    layer
        .on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature,
          click: getCoords,
          
        })
        .bindPopup(popUpDiv);

  

      generalInfoButton.onclick = function () {

      

        $.ajax({
          url: "php/restCountries.php",
          type: "POST",
          dataType: "json",

          // Note that iso_a2 is used to locate the country in restCountries.php

          data: {
            cca3: feature.properties.iso_a3,
          },

          success: function (result) {
            if (result.status.name == "ok") {
              
              console.log("General Informatiom Received Fine!");

              console.log(`Response Time was:${result['status']['returnedIn']}`)
              // console.log("The result from restCountries is: " + (JSON.stringify(result)));

              // $("#popUpDiv").empty();
              $("#mainMenuDiv").hide();

              // Creates Div that holds all main buttons and general text. So everything will append to this div and this div will append to popUpDiv so I can easilly hide/show it as needed

              if (document.getElementById("generalInfoMenuDiv")) {
                $("#generalInfoMenuDiv").show();
              } else {
                const generalInfoMenuDiv = document.createElement("div");
                generalInfoMenuDiv.setAttribute("id", "generalInfoMenuDiv");

                const generalInfoTextDiv = document.createElement('div');
                generalInfoTextDiv.setAttribute('id','generalInfoTextDiv');
                generalInfoTextDiv.setAttribute('class','generalInfoTextDivClass');
                generalInfoMenuDiv.append(generalInfoTextDiv);

                const generalInfoTextHeading = document.createElement('h2');
                generalInfoTextHeading.setAttribute('id','generalInfoTextHeading');
                generalInfoTextHeading.innerHTML = 'Welcome to General Information Section';
                generalInfoTextDiv.append(generalInfoTextHeading);
                
                
                const generalInfoText = document.createElement("p");
                generalInfoText.setAttribute("id", "generalInfoText");
                generalInfoText.innerHTML = 'What would you like to know specifically?';

                // * This Works!
                // popUpDiv.appendChild(generalInfoText)
                generalInfoTextDiv.appendChild(generalInfoText);

                // ************** Buttons *********** //

                // * Official and Native names:

                const generalInfoButtonsDiv = document.createElement('div');
                generalInfoButtonsDiv.setAttribute('id','generalInfoButtonsDiv');
                generalInfoButtonsDiv.setAttribute('class','generalInfoButtonsDivClass');
                generalInfoMenuDiv.append(generalInfoButtonsDiv)

                const countryNameButton = document.createElement("button");
                countryNameButton.setAttribute("id", "countryNameButton");
                countryNameButton.setAttribute('class','generalInfoButtonClass')
                countryNameButton.innerHTML = "Country Names";

                generalInfoButtonsDiv.appendChild(countryNameButton);
                // popUpDiv.appendChild(countryNameButton);

                // * Currency Button

                const currencyButton = document.createElement("button");
                currencyButton.setAttribute("id", "currencyButton");
                currencyButton.setAttribute('class','generalInfoButtonClass')

                currencyButton.innerHTML = "Official Currency";

                generalInfoButtonsDiv.appendChild(currencyButton);

                // * Capital City
                const capitalCityButton = document.createElement("button");
                capitalCityButton.setAttribute("id", "capitalCityButton");
                capitalCityButton.setAttribute('class','generalInfoButtonClass')

                capitalCityButton.innerHTML = `Capital City`;

                generalInfoButtonsDiv.appendChild(capitalCityButton);

                // * Region and Subregion

                const regionButton = document.createElement("button");
                regionButton.setAttribute("id", "regionButton");
                regionButton.setAttribute('class','generalInfoButtonClass')

                regionButton.innerHTML = "Location";

                generalInfoButtonsDiv.appendChild(regionButton);

                // * Spoken Languages

                const languagesButton = document.createElement("button");
                languagesButton.setAttribute("id", "languagesButton");
                languagesButton.setAttribute('class','generalInfoButtonClass')

                languagesButton.innerHTML = "Official Languages";

                generalInfoButtonsDiv.appendChild(languagesButton);

                // * Population

                const populationButton = document.createElement("button");
                populationButton.setAttribute("id", "populationButton");
                populationButton.setAttribute('class','generalInfoButtonClass')

                populationButton.innerHTML = "Population";

                generalInfoButtonsDiv.appendChild(populationButton);

                // * Interesting Stuff

                const interestingStuffButton = document.createElement("button");
                interestingStuffButton.setAttribute(
                  "id",
                  "interestingStuffButton"
                );
                interestingStuffButton.setAttribute('class','generalInfoButtonClass')

                interestingStuffButton.innerHTML = "Interesting Stuff";

                generalInfoButtonsDiv.appendChild(interestingStuffButton);

                // * Time Zones

                const timeZonesButton = document.createElement("button");
                timeZonesButton.setAttribute("id", "timeZonesButton");
                timeZonesButton.setAttribute('class','generalInfoButtonClass')

                timeZonesButton.innerHTML = "Time Zones";

                generalInfoButtonsDiv.appendChild(timeZonesButton);

                // * Flag

                const flagsButton = document.createElement("button");
                flagsButton.setAttribute("id", "flagsButton");
                flagsButton.setAttribute('class','generalInfoButtonClass')

                flagsButton.innerHTML = "Flag";

                generalInfoButtonsDiv.appendChild(flagsButton);

                // *
                const neighboursButton = document.createElement("button");
                neighboursButton.setAttribute("id", "neighboursButton");
                neighboursButton.setAttribute('class','generalInfoButtonClass')

                neighboursButton.innerHTML = "Neighbours";

                generalInfoButtonsDiv.appendChild(neighboursButton);

                // * Main Menu Back Button

                const mainMenuBackButtonDiv = document.createElement('div');
                mainMenuBackButtonDiv.setAttribute('id','mainMenuBackButtonDiv');
                mainMenuBackButtonDiv.setAttribute('class','mainMenuBackButtonDivClass');
                generalInfoMenuDiv.append(mainMenuBackButtonDiv);

                const mainMenuBackButton = document.createElement("button");
                mainMenuBackButton.setAttribute("id", "mainMenuBackButton");
                mainMenuBackButton.setAttribute("class", "mainMenuBackButtonClass");

                mainMenuBackButton.innerHTML = "Back";

                mainMenuBackButtonDiv.append(mainMenuBackButton);
                // popUpDiv.append(mainMenuBackButton);

                popUpDiv.append(generalInfoMenuDiv);
              }

              countryNameButton.onclick = function () {
                // $("#popUpDiv").empty();
                // $("#generalInfoText").toggle();
                // popUpDiv.removeChild(countryNameButton);

                // $("#countryNameButton").toggle();

                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("countryNameDiv")) {
                  $("#countryNameDiv").show();
                } else {
                  const countryNameDiv = document.createElement("div");
                  countryNameDiv.setAttribute("id", "countryNameDiv");
                  countryNameDiv.setAttribute('class','generalInfoSubDiv');
                  $("#popUpDiv").append(countryNameDiv);

                  var nativeNamekey = Object.keys(result["name"]["nativeName"]);
                  console.log("Keys are: " + nativeNamekey);

                  const countryNameDivTextPartDiv = document.createElement('div');
                  countryNameDivTextPartDiv.setAttribute('id','countryNameDivTextPartDiv');
                  countryNameDiv.append(countryNameDivTextPartDiv)

                  $('#countryNameDivTextPartDiv').append(
                    "<p>The english name is: <b>" +
                      result["name"]["common"] +
                      "</b></p>"
                  );

                  $('#countryNameDivTextPartDiv').append(
                    "<p>The official english name is: <b>" +
                      result["name"]["official"] +
                      "</b></p>"
                  );

                  if (nativeNamekey.length > 1) {
                    $('#countryNameDivTextPartDiv').append(
                      `<p><b>${feature.properties.name}, however, has more than one official name. These names are: </b></p>`
                    );
                  }

                  for (index = 0; index < nativeNamekey.length; index++) {
                    var firstNativeKey = nativeNamekey[index];

                    $('#countryNameDivTextPartDiv').append(
                      "<p>The native offical name is: <b>" +
                        result["name"]["nativeName"][firstNativeKey][
                          "official"
                        ] +
                        "</b></p>"
                    );

                    $('#countryNameDivTextPartDiv').append(
                      "<p>The native name is: <b>" +
                        result["name"]["nativeName"][firstNativeKey]["common"] +
                        "</b></p>"
                    );

                    $('#countryNameDivTextPartDiv').append(`<hr><hr>`);
                  }

                  
                  // Country NAme Back Button DIV

                  const countryNameBackButtonDiv = document.createElement('div');
                  countryNameBackButtonDiv.setAttribute('id','countryNameBackButtonDiv')
                  countryNameBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');

                  countryNameDiv.append(countryNameBackButtonDiv)


                  // Country NAme Back Button

                  const countryNameBackButton =
                    document.createElement("button");
                  countryNameBackButton.setAttribute(
                    "id",
                    "countryNameBackButton"
                  );
                  countryNameBackButton.setAttribute('class','generalInfoSubDivBackButton');
                  
                  countryNameBackButton.innerHTML = "Back";

                  countryNameBackButtonDiv.append(countryNameBackButton);

                  // $("#popUpDiv").append(countryNameDiv);
                }

                countryNameBackButton.onclick = function () {
                  $("#countryNameDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              currencyButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                // If this currencyButton div was laready created, there is no need to Re-Create it and it was just hidden by pressing Back Button, so we need to show it. If not than it needs to be created

                if (document.getElementById("currencyDiv")) {
                  $("#currencyDiv").show();
                } else {


                  

                  const currencyDiv = document.createElement("div");
                  currencyDiv.setAttribute("id", "currencyDiv");
                  currencyDiv.setAttribute('class','generalInfoSubDiv');
                  $("#popUpDiv").append(currencyDiv);

                  const currencyTextDiv = document.createElement('div');
                  currencyTextDiv.setAttribute('id','currencyTextDiv');
                  currencyTextDiv.setAttribute('class','currencyTextDivClass');
                  currencyDiv.append(currencyTextDiv);

                  var currencyNamesArr = Object.keys(result["currency"]);

                  console.log("Currency names are: " + currencyNamesArr);

                  var currencyName = currencyNamesArr[0];

                  console.log("Currency name is: " + currencyName);

                  $("#currencyTextDiv").append(
                    `<p>The official currency of ${feature.properties.name} is: <b>${result["currency"][currencyName]["name"]}</b></p>`
                  );

                  $("#currencyTextDiv").append(
                    `<p>The official symbol of ${result["currency"][currencyName]["name"]} is: <b>${result["currency"][currencyName]["symbol"]}</b></p>`
                  );

                  
                  const exchangeRateBackButtonDiv = document.createElement('div');
                  exchangeRateBackButtonDiv.setAttribute('id','exchangeRateBackButtonDiv');
                  currencyDiv.append(exchangeRateBackButtonDiv);

                  const exchangeRateBackButton = document.createElement('button');
                  exchangeRateBackButton.setAttribute('id','exchangeRateBackButton');
                  exchangeRateBackButton.setAttribute('class','specialButtonClass')
                  exchangeRateBackButton.innerHTML = 'Latest Currency Exchange Rate';
                  currencyDiv.append(exchangeRateBackButton);


                  const currencyBackButtonDiv = document.createElement('div');
                  currencyBackButtonDiv.setAttribute('id','currencyBackButtonDiv');
                  currencyBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  currencyDiv.append(currencyBackButtonDiv);
                  
                  const currencyBackButton = document.createElement("button");
                  currencyBackButton.setAttribute("id", "currencyBackButton");
                  currencyBackButton.setAttribute('class','generalInfoSubDivBackButton');
                  currencyBackButton.innerHTML = "Back";

                  currencyBackButtonDiv.append(currencyBackButton);
                }

                exchangeRateBackButton.onclick = function(){  
                  
                  $("#currencyDiv").hide();

                  if (document.getElementById("exchangeRateDiv")){

                    $("#exchangeRateDiv").show();

                  } else {

                    const exchangeRateDiv = document.createElement('div');
                    exchangeRateDiv.setAttribute('id','exchangeRateDiv');
                    exchangeRateDiv.setAttribute('class','generalInfoSubDiv');

                    $("#popUpDiv").append(exchangeRateDiv);

                    // Heading Text
                    const currencyHeadingDiv = document.createElement('div');
                    currencyHeadingDiv.setAttribute('id','currencyHeadingDiv');
                    exchangeRateDiv.append(currencyHeadingDiv);

                    

                    const currencyHeadingText = document.createElement('p');
                    currencyHeadingText.setAttribute('id','currencyHeadingText');
                    currencyHeadingText.innerHTML = `Please pick a currency below to see the latest conversion rate for ${result["currency"][currencyName]["name"]}`;
                    currencyHeadingDiv.append(currencyHeadingText)

                    
                    
                    

                    // Currency Form

                    const exchangeRateFormDiv = document.createElement('div');
                    exchangeRateFormDiv.setAttribute('id','exchangeRateFormDiv');
                    exchangeRateDiv.append(exchangeRateFormDiv)
                
                    const exchangeRateForm = document.createElement('form');
                    exchangeRateForm.setAttribute('id','exchangeRateForm')
                    exchangeRateFormDiv.append(exchangeRateForm);

                    $('<input/>').attr({ 
                      type: 'text', 
                      id: 'exchangeRateFormInput', 
                      name: 'exchangeRateFormInput',
                      list: 'currencyList',
                      placeholder: 'Pick a Currency...',
                      required: 'true'
                    }).appendTo('#exchangeRateForm');

                    // $('<datalist></datalist>').attr({
                    //   id:'currencyList'
                    // }).appendTo('#exchangeRateForm');

                    const currencyList = document.createElement('datalist');
                    currencyList.setAttribute('id','currencyList');
                    exchangeRateForm.append(currencyList);

                    
                    const currencySubmitButton = document.createElement('button');
                    currencySubmitButton.setAttribute('type','submit');
                    currencySubmitButton.setAttribute('id','currencySubmitButton');
                    currencySubmitButton.setAttribute('title','Currency Submit Button');
                    
                    currencySubmitButton.innerHTML = 'Submit';
                    exchangeRateForm.append(currencySubmitButton);
                    

                    // JQuery to get currency names

                    // Populating datalist with currency names
                    
                    
                    $.get('https://openexchangerates.org/api/currencies.json', function(currencyData) {
                              
                              for (var currencyCode in currencyData) {

                                console.log(currencyCode)
                                console.log( currencyData[currencyCode])
                      
                                $("#currencyList").append(
                                  "<option id= "+ currencyCode + " value=" + currencyCode + ">" + currencyData[currencyCode] + "</option>"
                                );                      
                              }   
                            });                        


                    // Currency Back Button + Div
                    const exchangeRateBackButtonDiv = document.createElement('div');
                    exchangeRateBackButtonDiv.setAttribute('id','exchangeRateBackButtonDiv');
                    exchangeRateBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv')
                    exchangeRateDiv.append(exchangeRateBackButtonDiv);

                    const exchangeRateBackButton = document.createElement('button');
                    exchangeRateBackButton.setAttribute('id','exchangeRateBackButton');
                    exchangeRateBackButton.setAttribute('class','generalInfoSubDivBackButton');
                    exchangeRateBackButton.innerHTML = 'Back';

                    exchangeRateBackButtonDiv.append(exchangeRateBackButton)



                    $("#exchangeRateForm").submit(function (event) {
                      event.preventDefault();

                      
                      var originalCurrency = Object.keys(result['currency']);
                      var finalCurrency = $('#exchangeRateFormInput').val();

                      console.log(`original value was: ${originalCurrency}`)
                      console.log(`User went for ${finalCurrency}`)

                      // Now I am getting JSON of All actual currency rates with base currency of USD

                      $.get('https://openexchangerates.org/api/latest.json', {app_id: 'eabcbd09dc734c58a70111751571a26d'}, function(data) {


                          const usdToOriginal = data["rates"][originalCurrency];
                          const usdToFinal = data["rates"][finalCurrency];
                   
                          
                          console.log(`USD to ${originalCurrency} is ${usdToOriginal}`);
                          console.log(`USD to ${finalCurrency} is ${usdToFinal}`);

                          // FINISHE TIME CONVERSION!
                          // console.log(`Time was: ${exchangeRadableTime}`)
    
                      });


                     
                    
                    
                    })


                    exchangeRateBackButton.onclick = function(){

                      $("#exchangeRateDiv").hide();
                      $("#currencyDiv").show();
                    }

                  }

                }
                


                currencyBackButton.onclick = function () {
                  $("#currencyDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              capitalCityButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("capitalCityDiv")) {
                  $("#capitalCityDiv").show();
                } else {
                  const capitalCityDiv = document.createElement("div");
                  capitalCityDiv.setAttribute("id", "capitalCityDiv");
                  capitalCityDiv.setAttribute('class','generalInfoSubDiv')
                  $("#popUpDiv").append(capitalCityDiv);

                  const capitalCityTextDiv = document.createElement('div');
                  capitalCityTextDiv.setAttribute('id','capitalCityTextDiv');
                  capitalCityDiv.append(capitalCityTextDiv);

                  $("#capitalCityTextDiv").append(
                    `<p><h5>The Capital city of ${feature.properties.name} is: <b>${result["capital"]}</b></h5></p>`
                  );

                  $("#capitalCityTextDiv").append(
                    `<p><h5>It's coordinates are as follows:</h5><b>Latitude: ${result["capitalLatLng"][0]}°</b><br><b>Longitude: ${result["capitalLatLng"][1]}°</b><br><br>You may also see the location of the capital pin-pointed on your map!</p>`
                  );

                  console.log("Capital is: " + result["capital"]);

                  // * Capital City Custom Marker

                  var capitalMarkerIconOptions = {
                    iconUrl: "resources/capital-marker.png",
                    iconSize: [50, 50],
                  };

                  var customCapitalMarker = L.icon(capitalMarkerIconOptions);

                  var capitalMarkerOptions = {
                    icon: customCapitalMarker,
                    draggable: true,
                    title: `This is ${result["capital"]}, the capital of ${feature.properties.name}`,
                  };

                  var capitalMarker = L.marker(
                    [result["capitalLatLng"][0], result["capitalLatLng"][1]],
                    capitalMarkerOptions
                  ).addTo(map);

                  
                  const capitalCityBackButtonDiv = document.createElement('div');
                  capitalCityBackButtonDiv.setAttribute('id','capitalCityBackButtonDiv');
                  capitalCityBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  capitalCityDiv.append(capitalCityBackButtonDiv);
                  
                  const capitalCityBackButton =
                    document.createElement("button");
                  capitalCityBackButton.setAttribute(
                    "id",
                    "capitalCityBackButton"
                  );
                  capitalCityBackButton.setAttribute('class','generalInfoSubDivBackButton')
                  capitalCityBackButton.innerHTML = "Back";

                  capitalCityBackButtonDiv.append(capitalCityBackButton);
                }

                // Capital City Back Button
                capitalCityBackButton.onclick = function () {
                  $("#capitalCityDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              regionButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("regionDiv")) {
                  $("#regionDiv").show();
                } else {
                  const regionDiv = document.createElement("div");
                  regionDiv.setAttribute("id", "regionDiv");
                  regionDiv.setAttribute("class", "generalInfoSubDiv");

                  $("#popUpDiv").append(regionDiv);

                  const regionTextDiv = document.createElement("div");
                  regionTextDiv.setAttribute('id','regionTextDiv');
                  regionDiv.append(regionTextDiv);

                  $("#regionTextDiv").append(
                    `<p><b>${feature.properties.name}</b> is located in <b><i>${result["region"]}</i></b>, <br><br>more specifically in <b><i>${result["subregion"]}</i></b></p>`
                  );

                  const regionBackButtonDiv = document.createElement("div");
                  regionBackButtonDiv.setAttribute('id','regionBackButtonDiv');
                  regionBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  regionDiv.append(regionBackButtonDiv);


                  const regionBackButton = document.createElement("button");
                  regionBackButton.setAttribute("id", "regionBackButton");
                  regionBackButton.setAttribute('class','generalInfoSubDivBackButton')
                  regionBackButton.innerHTML = "Back";
                  regionBackButtonDiv.append(regionBackButton);
                }

                regionBackButton.onclick = function () {
                  $("#regionDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              languagesButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("languagesDiv")) {
                  $("#languagesDiv").show();
                } else {
                  const languagesDiv = document.createElement("div");
                  languagesDiv.setAttribute("id", "languagesDiv");
                  languagesDiv.setAttribute("class", "generalInfoSubDiv");
                  $("#popUpDiv").append(languagesDiv);

                  const  languagesTextDiv = document.createElement('div');
                  languagesTextDiv.setAttribute('id','languagesTextDiv');
                  languagesDiv.append(languagesTextDiv)

                  const allLangugesArr = Object.keys(result["languages"]);

                  $("#languagesTextDiv").append(
                    `<p><h5>People in ${feature.properties.name} speaks these languages:<br></h5></p>`
                  );

                  for (index = 0; index < allLangugesArr.length; index++) {
                    let language = allLangugesArr[index];

                    $("#languagesTextDiv").append(
                      `<p><b><i><h5>- ${result["languages"][language]}</h5></i></b></p>`
                    );
                  }


                  const languagesBackButtonDiv = document.createElement('div');
                  languagesBackButtonDiv.setAttribute('id','languagesBackButtonDiv');
                  languagesBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  languagesDiv.append(languagesBackButtonDiv)


                  const languagesBackButton = document.createElement("button");
                  languagesBackButton.setAttribute("id", "languagesBackButton");
                  languagesBackButton.setAttribute("class", "generalInfoSubDivBackButton");

                  languagesBackButton.innerHTML = "Back";

                  languagesBackButtonDiv.append(languagesBackButton);
                }

                languagesBackButton.onclick = function () {
                  $("#languagesDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              populationButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("populationDiv")) {
                  $("#populationDiv").show();
                } else {
                  const populationDiv = document.createElement("div");
                  populationDiv.setAttribute("id", "populationDiv");
                  populationDiv.setAttribute("class", "generalInfoSubDiv");
                  $("#popUpDiv").append(populationDiv);

                  const populationTextDiv = document.createElement('div');
                  populationTextDiv.setAttribute('id','populationTextDiv');
                  populationDiv.append(populationTextDiv);


                  let popNumber = getCleanerNumber(result["population"]);

                // This method will add commas to make easier to read a large number
                
                  function getCleanerNumber(bigNumber){


                    let bigNumberString = bigNumber.toString();

                    let numberLength = bigNumberString.length;

                    let switchedIndex = numberLength - 1;

                    let cleanNumber = '';
                    
                    for(let i = 0; i < numberLength; i++){
                       
                      cleanNumber += bigNumberString[i];

                      if(switchedIndex % 3 === 0 && switchedIndex != 0){
  
                        cleanNumber += ',';

                      }

                      switchedIndex -= 1;

                      console.log(`cleanNumber is: ${cleanNumber}`)

                    }
                    
                    alert(`cleanNumber is ${cleanNumber}`)
                    return cleanNumber;

                  }

                  $("#populationTextDiv").append(
                    `<p><h5>The population(according to the latest data) of <b>${feature.properties.name}</b> is:<br><br><br> </h5><h3><b>${popNumber} inhabitants</b></h3></p>`
                  );


                  const populationBackButtonDiv = document.createElement('div');
                  populationBackButtonDiv.setAttribute('id','populationBackButtonDiv');
                  populationBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  populationDiv.append(populationBackButtonDiv);

                  const populationBackButton = document.createElement("button");
                  populationBackButton.setAttribute(
                    "id",
                    "populationBackButton"
                  );
                  populationBackButton.setAttribute('class','generalInfoSubDivBackButton');
                  populationBackButton.innerHTML = "Back";

                  populationBackButtonDiv.append(populationBackButton);
                }

                populationBackButton.onclick = function () {
                  $("#populationDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              interestingStuffButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("interestingStuffDiv")) {
                  $("#interestingStuffDiv").show();
                } else {
                  const interestingStuffDiv = document.createElement("div");
                  interestingStuffDiv.setAttribute("id", "interestingStuffDiv");
                  interestingStuffDiv.setAttribute('class','generalInfoSubDiv');
                  $("#popUpDiv").append(interestingStuffDiv);

                  const interestingStuffTextDiv = document.createElement('div');
                  interestingStuffTextDiv.setAttribute('id','interestingStuffTextDiv');
                  interestingStuffDiv.append(interestingStuffTextDiv);

                  const carDetailsArr = Object.keys(result["drivingSide"]);

                  console.log(`Car details Arr = ${carDetailsArr}`);

                  const side = carDetailsArr[1];
                  const sign = carDetailsArr[0];

                  $("#interestingStuffTextDiv").append(
                    `<p><h5>In <b>${feature.properties.name}</b>, people are driving on <b>${result["drivingSide"][side]} hand side</b> and use vehicle registration plates starting with <b>${result["drivingSide"][sign]}</b><br><br>It is also worth noting that the week in ${feature.properties.name} starts on <b>${result["startOfWeek"]}.</b></h5></p>`
                  );


                  const interestingStuffBackButtonDiv = document.createElement('div');
                  interestingStuffBackButtonDiv.setAttribute('id','interestingStuffBackButtonDiv');
                  interestingStuffBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  interestingStuffDiv.append(interestingStuffBackButtonDiv);

                  const interestingStuffBackButton =
                    document.createElement("button");
                  interestingStuffBackButton.setAttribute(
                    "id",
                    "interestingStuffBackButton"
                  );
                  interestingStuffBackButton.setAttribute('class','generalInfoSubDivBackButton');
                  interestingStuffBackButton.innerHTML =
                    "Back";

                    interestingStuffBackButtonDiv.append(interestingStuffBackButton);
                }

                interestingStuffBackButton.onclick = function () {
                  console.log(`interestingStuffBackButton CLICKED `)
                  $("#interestingStuffDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              timeZonesButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("timeZonesDiv")) {
                  $("#timeZonesDiv").show();
                } else {
                  const timeZonesDiv = document.createElement("div");
                  timeZonesDiv.setAttribute("id", "timeZonesDiv");
                  timeZonesDiv.setAttribute("class", "generalInfoSubDiv");

                  $("#popUpDiv").append(timeZonesDiv);


                  const timeZonesTextDiv = document.createElement('div');
                  timeZonesTextDiv.setAttribute('id','timeZonesTextDiv');
                  timeZonesDiv.append(timeZonesTextDiv)

                  $("#timeZonesTextDiv").append(
                    `<p><h4><b>${feature.properties.name} has these time zones: </b></h4></p>`
                  );

                  for (index = 0; index < result["timezones"].length; index++) {
                    $("#timeZonesTextDiv").append(
                      `<p><i><b>--> ${result["timezones"][index]}</b></i></p>`
                    );
                  }

                  const utcInfoButtonDiv = document.createElement('div');
                  utcInfoButtonDiv.setAttribute('id','utcInfoButtonDiv');

                  timeZonesDiv.append(utcInfoButtonDiv);

                  const utcInfoButton = document.createElement('button');
                  utcInfoButton.setAttribute('id','utcInfoButton');
                  utcInfoButton.setAttribute('class','specialButtonClass')

                  utcInfoButton.innerHTML = `What is UTC?`;
                  utcInfoButtonDiv.append(utcInfoButton);

                  const timeZonesBackButtonDiv = document.createElement('div');timeZonesBackButtonDiv.setAttribute('id','timeZonesBackButtonDiv');
                  timeZonesBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  timeZonesDiv.append(timeZonesBackButtonDiv);

                  const timeZonesBackButton = document.createElement("button");
                  timeZonesBackButton.setAttribute("id", "timeZonesBackButton");
                  timeZonesBackButton.setAttribute("class", "generalInfoSubDivBackButton");

                  timeZonesBackButton.innerHTML = "Back";

                  timeZonesBackButtonDiv.append(timeZonesBackButton);
                }

                utcInfoButton.onclick = function(){

                  $("#timeZonesDiv").hide();

                  if(document.getElementById('utcInfoDiv')){
                    $('#utcInfoDiv').show();

                  } else {

                    const utcInfoDiv = document.createElement('div');
                    utcInfoDiv.setAttribute('id','utcInfoDiv');
                    utcInfoDiv.setAttribute('class','generalInfoSubDiv');

                    $("#popUpDiv").append(utcInfoDiv);

                    const utcInfoHeading = document.createElement('h2');
                    utcInfoHeading.setAttribute('id','utcInfoHeading');
                    utcInfoHeading.innerHTML = 'What is UFC?'
                    utcInfoDiv.append(utcInfoHeading)

                    const utcInfoText = document.createElement('p');
                    utcInfoText.setAttribute('id','utcInfoText');
                    utcInfoText.setAttribute('class','utcInfoTextClass');
                    utcInfoText.innerHTML = `Coordinated Universal Time or UTC is the primary time standard by which the world regulates clocks and time. It is within about one second of mean solar time (such as UT1) at 0° longitude (at the IERS Reference Meridian as the currently used prime meridian) and is not adjusted for daylight saving time. It is effectively a successor to Greenwich Mean Time (GMT).<br>Time zones around the world are expressed using positive or negative offsets from UTC, as in the list of time zones by UTC offset.`

                    utcInfoDiv.append(utcInfoText)


                    const utcBackButtonDiv = document.createElement('div');
                    utcBackButtonDiv.setAttribute('id','utcBackButtonDiv');
                    utcBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                    utcInfoDiv.append(utcBackButtonDiv);

                    const utcBackButton = document.createElement('button');
                    utcBackButton.setAttribute('id','utcBackButton');
                    utcBackButton.setAttribute('class','generalInfoSubDivBackButton');

                    
                    utcBackButton.innerHTML = 'Back';
                    utcBackButtonDiv.append(utcBackButton)


                  }

                  utcBackButton.onclick = function(){

                    $("#utcInfoDiv").hide();
                    $("#timeZonesDiv").show();


                  }



                }

                timeZonesBackButton.onclick = function () {
                  $("#timeZonesDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              flagsButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("flagsDiv")) {
                  $("#flagsDiv").show();
                } else {
                  const flagsDiv = document.createElement("div");
                  flagsDiv.setAttribute("id", "flagsDiv");
                  flagsDiv.setAttribute('class','generalInfoSubDiv');

                  $("#popUpDiv").append(flagsDiv);

                  const flagTextDiv = document.createElement('div');
                  flagTextDiv.setAttribute('id','flagTextDiv');
                  flagsDiv.append(flagTextDiv);

                  if (result["flags"]["alt"]) {
                    $("#flagTextDiv").append(
                      `<p><h2><b>Flag Description:</b><h2><br><h5>${result["flags"]["alt"]}</h5><br><br></p>`
                    );
                  }

                  const flagContainer = document.createElement('div');
                  flagContainer.setAttribute('id','flagContainer');
                  flagContainer.setAttribute('class','flagContainerClass');
                  flagsDiv.append(flagContainer);

                  const flagPictureDiv = document.createElement('div');
                  flagPictureDiv.setAttribute('id','flagPictureDiv');
                  flagPictureDiv.setAttribute('class','flagPictureDivClass');
                  flagContainer.append(flagPictureDiv)

                  const flagPictureNameDiv = document.createElement('div');
                  flagPictureNameDiv.setAttribute('id','flagPictureNameDiv');
                  flagPictureDiv.append(flagPictureNameDiv);

                  $("#flagPictureNameDiv").append(
                    `<h4><b>The flag of ${feature.properties.name}:</b><br></h4>`
                  );

                  const flagPictureImgDiv = document.createElement('div');
                  flagPictureImgDiv.setAttribute('id','flagPictureImgDiv');
                  flagPictureDiv.append(flagPictureImgDiv);
                  

                  $("#flagPictureImgDiv").append(
                    `<img src=${result["flags"]["png"]} alt=${feature.properties.name} width="300vw" height="150vh"><br><br>`
                  );


                  const coatOfArmsDiv = document.createElement('div');
                  coatOfArmsDiv.setAttribute('id','coatOfArmsDiv');
                  flagContainer.append(coatOfArmsDiv);

                  const coatOfArmsNameDiv = document.createElement('div');
                  coatOfArmsNameDiv.setAttribute('id','coatOfArmsNameDiv');
                  coatOfArmsDiv.append(coatOfArmsNameDiv);
                  
                  $("#coatOfArmsNameDiv").append(
                    `<h4><b>The coat of arms of ${feature.properties.name}:</b><br></h4>`
                  );

                  const coatOfArmsImgDiv = document.createElement('div');
                  coatOfArmsImgDiv.setAttribute('id','coatOfArmsImgDiv');
                  coatOfArmsDiv.append(coatOfArmsImgDiv)

                  $("#coatOfArmsImgDiv").append(
                    `<img src=${result["coatOfArms"]["png"]} alt=${feature.properties.name} width="150vw" height="150vh"><br><br>`
                  );


                  const flagsBackButtonDiv = document.createElement('div');
                  flagsBackButtonDiv.setAttribute('id','flagsBackButtonDiv');
                  flagsBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  flagsDiv.append(flagsBackButtonDiv);

                  const flagsBackButton = document.createElement("button");
                  flagsBackButton.setAttribute("id", "flagsBackButton");
                  flagsBackButton.setAttribute("class", "generalInfoSubDivBackButton"); 
                  flagsBackButton.innerHTML = "Back";

                  flagsBackButtonDiv.append(flagsBackButton);
                }

                flagsBackButton.onclick = function () {
                  $("#flagsDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              neighboursButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();

                if (document.getElementById("neighboursDiv")) {
                  $("#neighboursDiv").show();
                } else {
                  const neighboursDiv = document.createElement("div");
                  neighboursDiv.setAttribute("id", "neighboursDiv");
                  neighboursDiv.setAttribute("class", "generalInfoSubDiv");

                  $("#popUpDiv").append(neighboursDiv);

                  const neighboursTextDiv = document.createElement('div');
                  neighboursTextDiv.setAttribute('id','neighboursTextDiv');
                  neighboursDiv.append(neighboursTextDiv);

                  if (!result["borders"]) {
                    $("#neighboursTextDiv").append(
                      `<p><h5>Well, It seems that <b>${feature.properties.name}</b> has no neighbors as it is Island country</h5></p>`
                    );
                  } else {
                    $("#neighboursTextDiv").append(
                      `<p><h5><b>${feature.properties.name}</b> neighbours with these countries:</h5><br></p>`
                    );


                    for (
                      let index = 0;
                      index < result["borders"].length;
                      index++
                    ) {
                      // * All neighbor states are represent in JSON as array, so for example [AU,SK,HRV..]. What I do here is to use these values and thanks to the fact that I have already populated datalist #countryList with all states where for example AU is value and Austria is the written text that belongs to that value. So I will just pair them and get them printed with full name as well

                      let neighbourValue = result["borders"][index];
                      console.log(`neighbourValue is ${neighbourValue}`)
                      
                      let neighborState = $(
                        "#countryList option[value=" + neighbourValue + "]"
                      ).text();


                      // let neighborState = document.getElementById("countryList").options.namedItem(`${neighbourValue}`).value;

                      console.log(`neighborState is ${neighborState}`)

                      $("#neighboursTextDiv").append(
                        `<p><b> - ${neighbourValue} - ${neighborState}</b></p>`
                      );
                    }
                  }

                  const neighboursBackButtonDiv = document.createElement('div');
                  neighboursBackButtonDiv.setAttribute('id','neighboursBackButtonDiv');
                  neighboursBackButtonDiv.setAttribute('class','generalInfoSubDivBackButtonDiv');
                  neighboursDiv.append(neighboursBackButtonDiv);

                  const neighboursBackButton = document.createElement("button");
                  neighboursBackButton.setAttribute(
                    "id",
                    "neighboursBackButton"
                  );
                  neighboursBackButton.setAttribute('class','generalInfoSubDivBackButton');
                  neighboursBackButton.innerHTML = "Back";

                  neighboursBackButtonDiv.append(neighboursBackButton);
                }

                neighboursBackButton.onclick = function () {
                  $("#neighboursDiv").hide();
                  $("#generalInfoMenuDiv").show();
                };
              };

              mainMenuBackButton.onclick = function () {
                $("#generalInfoMenuDiv").hide();
                $("#mainMenuDiv").show();
              };
            }
          },

          error: function (jqXHR, textStatus, errorThrown) {
            console.log("The data have not been sent");
          },
        });
      };

      weatherInfoButton.onclick = function () {
        console.log("weather Button Clicked!");
        

        let lat = parseFloat(document.getElementById("lattitude").innerHTML);
        let long = parseFloat(document.getElementById("longitude").innerHTML);

        console.log(`Current Lattitude is: ${lat}`);
        console.log(`Current Longitude is: ${long}`);

        $.ajax({
          url: "php/openWeatherApi.php",
          type: "POST",
          dataType: "json",

          data: {
            lat: lat,
            lon: long,
          },

          success: function (result) {
            if (result.status.name == "ok") {
              console.log("API WEATHER DATA RECEIVED!");

              // console.log("The result from openWeatherApi request is: " + (JSON.stringify(result)));

              $("#mainMenuDiv").hide();

              // * 5 days of forecast Div

              if (document.getElementById("forecastOverviewDiv")) {
                $("#forecastOverviewDiv").show();
              } else {
                // ************ MODIFICATION sTARTING at 14:58

                // * Forecast Overview div taht will hold: forecast overvie heading div, forecast div for specific days and overviewTempSwitch buttons

                const forecastOverviewDiv = document.createElement("div");
                forecastOverviewDiv.setAttribute("id", "forecastOverviewDiv");
                forecastOverviewDiv.setAttribute(
                  "class",
                  "forecastOverviewDivClass"
                );
                popUpDiv.append(forecastOverviewDiv);

                // * Now I will append 3 above mentioned divs to main forecastOverview Div

                // * Starting with heading div
                const forecastOverviewHeadingDiv =
                  document.createElement("div");
                forecastOverviewHeadingDiv.setAttribute(
                  "id",
                  "forecastOverviewHeadingDiv"
                );
                forecastOverviewHeadingDiv.setAttribute(
                  "class",
                  "forecastOverviewHeadingDivClass"
                );
                forecastOverviewDiv.append(forecastOverviewHeadingDiv);

                // * Header Text
                const forecastOverviewHeadingText =
                  document.createElement("h2");
                forecastOverviewHeadingText.setAttribute(
                  "id",
                  "forecastOverviewHeadingText"
                );
                forecastOverviewHeadingText.innerHTML =
                  "<b>Welcome to 5-Days Forecast Overview.</b>";
                forecastOverviewHeadingDiv.append(forecastOverviewHeadingText);

                const forecastOverviewHeadingTextSpan = document.createElement('p');
                forecastOverviewHeadingTextSpan.setAttribute('id','forecastOverviewHeadingTextSpan');
                forecastOverviewHeadingTextSpan.innerHTML = "For more specific Info please pick a corresponding day";
                forecastOverviewHeadingDiv.append(forecastOverviewHeadingTextSpan);

                // * Forecast Div holding Day buttons
                const forecastDiv = document.createElement("div");
                forecastDiv.setAttribute("id", "forecastDiv");
                forecastDiv.setAttribute("class", "forecastDivClass");

                forecastOverviewDiv.append(forecastDiv);

                // * Temp Switch Heading
                const overviewTempSwitchHeading = document.createElement("h3");
                overviewTempSwitchHeading.setAttribute(
                  "id",
                  "overviewTempSwitchHeading"
                );
                overviewTempSwitchHeading.innerHTML = `<b>Pick your prefered Temperature Unit</b>`;
                forecastOverviewDiv.append(overviewTempSwitchHeading);

                // * div for temp switch buttons

                const overviewTempSwitchDiv = document.createElement("div");
                overviewTempSwitchDiv.setAttribute(
                  "id",
                  "overviewTempSwitchDiv"
                );
                overviewTempSwitchDiv.setAttribute(
                  "class",
                  "overviewTempSwitchDivClass"
                );
                forecastOverviewDiv.append(overviewTempSwitchDiv);

                // *Celsius Button
                const overviewTempCelsiusButton =
                  document.createElement("button");
                overviewTempCelsiusButton.setAttribute(
                  "id",
                  "overviewTempCelsiusButton"
                );
                overviewTempCelsiusButton.setAttribute(
                  "class",
                  "overviewTempButtonClass"
                );
                overviewTempCelsiusButton.innerHTML = "°C";
                overviewTempSwitchDiv.append(overviewTempCelsiusButton);

                // * Fahrenheit Button
                const overviewTempFahrenheitButton =
                  document.createElement("button");
                overviewTempFahrenheitButton.setAttribute(
                  "id",
                  "overviewTempFahrenheitButton"
                );
                overviewTempFahrenheitButton.setAttribute(
                  "class",
                  "overviewTempButtonClass"
                );
                overviewTempFahrenheitButton.innerHTML = "°F";
                overviewTempSwitchDiv.append(overviewTempFahrenheitButton);

                const forecastMainMenuBackButtonDiv = document.createElement('div');
                forecastMainMenuBackButtonDiv.setAttribute('id','forecastMainMenuBackButtonDiv');
                forecastMainMenuBackButtonDiv.setAttribute('class','forecastMainMenuBackButtonDivClass');

                forecastOverviewDiv.append(forecastMainMenuBackButtonDiv);


                const forecastMainMenuBackButton = document.createElement('button');
                forecastMainMenuBackButton.setAttribute('id','forecastMainMenuBackButton');
                forecastMainMenuBackButton.setAttribute('class','forecastMainMenuBackButtonClass');
                forecastMainMenuBackButton.innerHTML = `<b>Back</b>`;
                forecastMainMenuBackButtonDiv.append(forecastMainMenuBackButton);


                forecastMainMenuBackButton.onclick = function(){

                    $("#forecastOverviewDiv").hide();
                    $("#mainMenuDiv").show();

                }

                // * Get the Name of the Day Function
                function getDayName(dateString) {
                  var days = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  var d = new Date(dateString);

                  var dayName = days[d.getDay()];

                  return dayName;
                }

                // * Convert UNIX Timestamp into Human Readable Date
                function unixTimeConverter(unixTimestamp) {
                  var JSdate = new Date(unixTimestamp);

                  const date = JSdate.toLocaleDateString("en-US");

                  // const cleanDate = date.replace('/','-');

                  const time = JSdate.toLocaleTimeString("it-IT");

                  return date + " " + time;
                }



                function getDayNames(firstDay) {
                  var days = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];

                  var daysArray = [];

                  let index = days.findIndex((element) => {
                    return element === firstDay;
                  });

                  for (let i = 0; i < 5; i++) {
                    if (index === days.length) {
                      index = 0;
                    }

                    daysArray.push(days[index]);

                    index++;
                  }

                  return daysArray;
                }

                // Function creates 5 buttons for respective days starting with Today. Function also creates Thumbs for buttons so user can get a glimps of average temperatures that can be expected each day and night with corresponding weather icon

                function makeButtons(daysArray) {
                  for (let i = 0; i < daysArray.length; i++) {
                    const dailyForecastThumbDiv = document.createElement("div");

                    dailyForecastThumbDiv.setAttribute(
                      "id",
                      "dailyForecastThumbDivDay" + `${i + 1}`
                    );
                    dailyForecastThumbDiv.setAttribute(
                      "class",
                      "dailyForecastThumbDivClass"
                    );

                    $("#forecastDiv").append(dailyForecastThumbDiv);

                    const thumbWeatherInfoDiv = document.createElement("div");
                    thumbWeatherInfoDiv.setAttribute(
                      "id",
                      "thumbWeatherInfoDiv"
                    );
                    thumbWeatherInfoDiv.setAttribute(
                      "class",
                      "thumbWeatherDivClass"
                    );
                    dailyForecastThumbDiv.append(thumbWeatherInfoDiv);

                    const dayPartDiv = document.createElement("div");
                    dayPartDiv.setAttribute("id", "dayPartDiv");
                    dayPartDiv.setAttribute("class", "dayPartDivClass");
                    thumbWeatherInfoDiv.append(dayPartDiv);

                    const nightPartDiv = document.createElement("div");
                    nightPartDiv.setAttribute("id", "nightPartDiv");
                    nightPartDiv.setAttribute("class", "nightPartDivClass");
                    thumbWeatherInfoDiv.append(nightPartDiv);

                    // * This could be turned into function

                    // Populationg day part of the thumbnail

                    // Icon

                    // This means that we are at the first day AKA Today and we need to get avg icon form next 8 measurments

                    // *** Come here after Today is done
                    const currentHour = parseInt(currentTime.slice(0, 2));

                    const shiftedIndex = getHoursShift(currentHour);

                    // const addedDifference = 9 - shiftedIndex;

                    const dayIconArray = [];
                    const nightIconArray = [];
                    const dayTempArray = [];
                    const nightTempArray = [];

                    let j;

                    if (i === 0) {
                      j = 0;
                    } else {
                      j = 8 * i + 1 - shiftedIndex;
                    }

                    let buttonDay = result["list"][j]["dt_txt"].slice(8, 10);
                    let buttonMonth = result["list"][j]["dt_txt"].slice(5, 7);
                    let buttonYear = result["list"][j]["dt_txt"].slice(0, 4);

                    let buttonDate = `${buttonDay}/${buttonMonth}/${buttonYear}`;

                    let lastIndex = j + 8;

                    for (j; j < lastIndex; j++) {
                      if (result["list"][j]["sys"]["pod"] === "d") {
                        dayTempArray.push(result["list"][j]["main"]["temp"]);

                        dayIconArray.push(
                          result["list"][j]["weather"][0]["icon"]
                        );
                      } else {
                        nightTempArray.push(result["list"][j]["main"]["temp"]);

                        nightIconArray.push(
                          result["list"][j]["weather"][0]["icon"]
                        );
                      }
                    }

                    // This means that it is either 2nd, 3rd, 4th or 5th day and therefore we need day shift method so we can get average from 03:00 - 00:00

                    const mostCommonDayIcon = mostFrequent(dayIconArray);
                    const mostCommonNightIcon = mostFrequent(nightIconArray);

                    // Average Icons

                    const dayThumbImg = document.createElement("img");
                    dayThumbImg.setAttribute("id", "dayThumbImg");
                    dayThumbImg.setAttribute(
                      "src",
                      `https://openweathermap.org/img/wn/${mostCommonDayIcon}@2x.png`
                    );
                    dayThumbImg.setAttribute("class", "thumbImgClass");

                    dayPartDiv.append(dayThumbImg);

                    const nightThumbImg = document.createElement("img");
                    nightThumbImg.setAttribute("id", "nightThumbImg");
                    nightThumbImg.setAttribute(
                      "src",
                      `https://openweathermap.org/img/wn/${mostCommonNightIcon}@2x.png`
                    );
                    nightThumbImg.setAttribute("class", "thumbImgClass");
                    nightPartDiv.append(nightThumbImg);

                    // Max Temp for Day and Min Temp for Night

                    let maxDayTemp = Math.max(...dayTempArray);

                    const maxDayTempCelsius = Math.round(maxDayTemp - 273.15);
                    const maxDayTempFahrenHeit = maxDayTempCelsius * 1.8 + 32;

                    let minNightTemp = Math.min(...nightTempArray);

                    const minNightTempCelsius = Math.round(
                      minNightTemp - 273.15
                    );
                    const minNightTempFahrenheit =
                      minNightTempCelsius * 1.8 + 32;

                    // Day Part Div

                    const dayTempDiv = document.createElement("div");
                    dayTempDiv.setAttribute("id", "dayTempDiv");
                    dayPartDiv.append(dayTempDiv);

                    const dayTempHeadingDiv = document.createElement("div");
                    dayTempHeadingDiv.setAttribute("id", "dayTempHeadingDiv");
                    dayTempDiv.append(dayTempHeadingDiv);

                    const dayTempHeadingText = document.createElement("h4");
                    dayTempHeadingText.setAttribute("id", "dayTempHeadingText");
                    dayTempHeadingText.innerHTML = "Day";
                    dayTempHeadingDiv.append(dayTempHeadingText);

                    const maxDayTempValueDiv = document.createElement("div");
                    maxDayTempValueDiv.setAttribute("id", "maxDayTempValueDiv");
                    dayTempDiv.append(maxDayTempValueDiv);

                    const maxDayTempValue = document.createElement("h4");
                    maxDayTempValue.setAttribute("id", "maxDayTempValue");
                    maxDayTempValue.innerHTML = `${maxDayTempCelsius}°C`;
                    maxDayTempValueDiv.append(maxDayTempValue);

                    // Night Part Div

                    const nightTempDiv = document.createElement("div");
                    nightTempDiv.setAttribute("id", "nightTempDiv");
                    nightPartDiv.append(nightTempDiv);

                    const nightTempHeadingDiv = document.createElement("div");
                    nightTempHeadingDiv.setAttribute(
                      "id",
                      "nightTempHeadingDiv"
                    );
                    nightTempDiv.append(nightTempHeadingDiv);

                    const nightTempHeadingText = document.createElement("h4");
                    nightTempHeadingText.setAttribute(
                      "id",
                      "nightTempHeadingText"
                    );
                    nightTempHeadingText.innerHTML = "Night";
                    nightTempHeadingDiv.append(nightTempHeadingText);

                    const minNightTempValueDiv = document.createElement("div");
                    minNightTempValueDiv.setAttribute(
                      "id",
                      "minNightTempValueDiv"
                    );
                    nightTempDiv.append(minNightTempValueDiv);

                    const minNightTempValue = document.createElement("h4");
                    minNightTempValue.setAttribute("id", "minNightTempValue");
                    minNightTempValue.innerHTML = `${minNightTempCelsius}°C`;
                    minNightTempValueDiv.append(minNightTempValue);

                    const dayButton = document.createElement("button");
                    dayButton.setAttribute("id", `${daysArray[i]}`);
                    dayButton.setAttribute("class", "dayButtonClass");
                    dayButton.innerHTML = `<b>${daysArray[i]}</b>`;
                    dailyForecastThumbDiv.append(dayButton);

                    // dailyForecastThumbDiv.append('<button id=' + daysArray[i] + '>' + daysArray[i] + '</button>');

                    // const dailyButton = document.createElement('button');
                    // dailyButton.setAttribute('id',`${daysArray[i]}`);
                    // dailyButton.innerHTML = (`${daysArray[i]}`);

                    // const firstDayIndexes = 0-7
                  }
                }

                // * This function will be called to populate the div the user will see. I am chooding to do it through function as there will be different stuff in respecitve divs depending on hours which are determined by different index. Index in this case is the index of result['list'] where for example the most recent observation will be 0
                // * As the first day is slightly special it will get its own function

                // For this dunction i do not need to know index as it will always show 0 - 7

                // This function is used as it will populate the first day 'Today' in forcast window. It has a spacial function as it will behave slightly different as other days, specifically it will not start from 3:00 as others will but from the most recent weather measurment

                function populateForecastDiv(startingIndex, divName, dayName) {
                  // First part is getting weather for the whole day -> it will be the icon that is represented the most in that day. It is also dependant if it is night or day

                  // * START!!!   !!!   !!!  !!!  !!!

                  const forecastDiv = document.getElementById(divName);

                  // const firstDayDiv = document.getElementById('firstDayDiv');

                  // let index = startingIndex;

                  // * Forecast Day Upper Div
                  const forecastDayUpperPartDiv = document.createElement("div");
                  forecastDayUpperPartDiv.setAttribute(
                    "id",
                    "forecastDayUpperPartDiv"
                  );
                  forecastDayUpperPartDiv.setAttribute(
                    "class",
                    "forecastDayUpperPartDivClass"
                  );
                  forecastDiv.append(forecastDayUpperPartDiv);

                  

                  // * Weather Description and DAte + Time
                  const weatherDescriptionDiv = document.createElement("div");
                  weatherDescriptionDiv.setAttribute(
                    "id",
                    "weatherDescriptionDiv"
                  );
                  weatherDescriptionDiv.setAttribute(
                    "class",
                    "weatherDescriptionDivClass"
                  );
                  forecastDayUpperPartDiv.append(weatherDescriptionDiv);

                  // * General Weather Info Div
                  const generalWeatherInfoDiv = document.createElement("div");
                  generalWeatherInfoDiv.setAttribute(
                    "id",
                    "generalWeatherInfoDiv"
                  );
                  generalWeatherInfoDiv.setAttribute(
                    "class",
                    "generalWeatherInfoDivClass"
                  );
                  forecastDayUpperPartDiv.append(generalWeatherInfoDiv);

                  // * Full Weather Info
                  const fullWeatherInfoDiv = document.createElement("div");
                  fullWeatherInfoDiv.setAttribute(
                    "id",
                    `fullWeatherInfo${divName}`
                  );
                  fullWeatherInfoDiv.setAttribute(
                    "class",
                    // `fullWeatherInfo${divName}`
                    'fullWeatherInfoDay'
                  );
                  forecastDiv.append(fullWeatherInfoDiv);

                  populateFullWeatherInfoDiv(
                    startingIndex,
                    divName,
                    "Temperature",
                    "Celsius"
                  );

                  // * Creation of 8 Buttons showing different times -> 00:00, 03:00 ... 21:00

                  const measuredFullDate =
                    result["list"][startingIndex]["dt_txt"];
                  const measuredYear = measuredFullDate.slice(0, 4);
                  const measuredMonth = measuredFullDate.slice(5, 7);
                  const measuredDay = measuredFullDate.slice(8, 10);
                  const measuredTime = measuredFullDate.slice(11, 19);

                  const weatherDescriptionMain =
                    result["list"][startingIndex]["weather"][0]["main"];
                  const weatherDescription =
                    result["list"][startingIndex]["weather"][0]["description"];

                  const weatherDescriptionText = document.createElement("p");
                  weatherDescriptionText.setAttribute(
                    "id",
                    "weatherDescriptionText"
                  );
                  weatherDescriptionText.innerHTML = `<p><h3><b>${dayName}</b></h3><br>Location: <b>${result["city"]["name"]}</b><br>Date: <b>${measuredDay}/${measuredMonth}/${measuredYear}</b><br>Time of measurment: <b>${measuredTime}</b><br>Weather condition: <b>${weatherDescriptionMain}</b><br>More specifiaclly: <b>${weatherDescription}</b></p>`;

                  weatherDescriptionDiv.append(weatherDescriptionText);

                  // * Forecast Day Header Div
                  const forecastDayHeaderDiv = document.createElement("div");
                  forecastDayHeaderDiv.setAttribute(
                    "id",
                    "forecastDayHeaderDiv"
                  );
                  forecastDayHeaderDiv.setAttribute(
                    "class",
                    "forecastDayHeaderDivClass"
                  );
                  generalWeatherInfoDiv.append(forecastDayHeaderDiv);

                  const weatherIconImage = document.createElement("img");
                  weatherIconImage.setAttribute("id", "weatherIconImage");
                  weatherIconImage.setAttribute(
                    "src",
                    `https://openweathermap.org/img/wn/${result["list"][startingIndex]["weather"][0]["icon"]}@2x.png`
                  );
                  forecastDayHeaderDiv.append(weatherIconImage);

                  const tempSwitchDiv = document.createElement("div");
                  tempSwitchDiv.setAttribute("id", "tempSwitchDiv");
                  tempSwitchDiv.setAttribute("class", "tempSwitchDivClass");
                  forecastDayHeaderDiv.append(tempSwitchDiv);

                  const weatherButtonsDiv = document.createElement("div");
                  weatherButtonsDiv.setAttribute("id", "weatherButtonsDiv");
                  weatherButtonsDiv.setAttribute(
                    "class",
                    "weatherButtonsDivClass"
                  );
                  forecastDayHeaderDiv.append(weatherButtonsDiv);

                  const additionalWeatherInfoDiv =
                    document.createElement("div");
                  additionalWeatherInfoDiv.setAttribute(
                    "id",
                    "precipitationDiv"
                  );
                  additionalWeatherInfoDiv.setAttribute(
                    "class",
                    "precipitationDivClass"
                  );
                  generalWeatherInfoDiv.append(additionalWeatherInfoDiv);

                  const additionalWeatherInfoText = document.createElement("p");
                  additionalWeatherInfoText.setAttribute(
                    "id",
                    "additionalWeatherInfoText"
                  );

                  // Average of all
                  // const precipitation = result['list'][index]

                  const allPrecipitationArr = [];

                  // * Actual Precipitation at this moment

                  const currentPrecipitation = Math.round((result["list"][0]["pop"]) * 100);
                  const currentHumidity =
                    result["list"][startingIndex]["main"]["humidity"];
                  const currentWindSpeed =
                    result["list"][startingIndex]["wind"]["speed"];

                  additionalWeatherInfoText.innerHTML = `<p>Probability of Precipitation: <b>${currentPrecipitation}%</b><br>Humidity: <b>${currentHumidity}%</b></br>Wind Speed: <b>${currentWindSpeed} metre/sec</b></p>`;

                  generalWeatherInfoDiv.append(additionalWeatherInfoText);

                  const tempWindPrecButtonsDiv = document.createElement("div");
                  tempWindPrecButtonsDiv.setAttribute(
                    "id",
                    "tempWindPrecButtonsDiv"
                  );
                  tempWindPrecButtonsDiv.setAttribute(
                    "class",
                    "tempWindPrecButtonsDivClass"
                  );
                  generalWeatherInfoDiv.append(tempWindPrecButtonsDiv);

                  const temperatureButton = document.createElement("button");
                  temperatureButton.setAttribute("id", "temperatureButton");
                  temperatureButton.innerHTML = "Temperature";
                  tempWindPrecButtonsDiv.append(temperatureButton);

                  const precipitationButton = document.createElement("button");
                  precipitationButton.setAttribute("id", "precipitationButton");
                  precipitationButton.innerHTML = "Precipation";
                  tempWindPrecButtonsDiv.append(precipitationButton);

                  const windButton = document.createElement("button");
                  windButton.setAttribute("id", "windButton");
                  windButton.innerHTML = "Wind";
                  tempWindPrecButtonsDiv.append(windButton);

                  // * Actual temperature!

                  const celsiusTemp = Math.round(
                    result["list"][startingIndex]["main"]["temp"] - 273.15
                  );

                  const feelsLikecelsiusTemp = Math.round(
                    result["list"][startingIndex]["main"]["feels_like"] - 273.15
                  );

                  // * Allows user to switch between °K °C °F

                  const temperature = document.createElement("p");
                  temperature.setAttribute("id", "temperature");
                  temperature.innerHTML = `${celsiusTemp}`;
                  tempSwitchDiv.append(temperature);

                  let tempSet = "Celsius";

                  const celsiusTempButton = document.createElement("button");
                  celsiusTempButton.setAttribute("id", "celsiusTempButton");
                  celsiusTempButton.style.color = "black";
                  celsiusTempButton.innerHTML = "°C";
                  weatherButtonsDiv.append(celsiusTempButton);

                  const fahrenheitTempButton = document.createElement("button");
                  fahrenheitTempButton.setAttribute(
                    "id",
                    "fahrenheitTempButton"
                  );
                  fahrenheitTempButton.innerHTML = "°F";
                  weatherButtonsDiv.append(fahrenheitTempButton);

                  // ****************************************************************
                  // ****               ONCLICK                             ********
                  // ****************************************************************

                  fahrenheitTempButton.onclick = function () {
                    celsiusTempButton.style.color = "#F8F8FF";
                    fahrenheitTempButton.style.color = "black";

                    const fahrenheitTemp = Math.round(celsiusTemp * 1.8 + 32);

                    temperature.innerHTML = `${fahrenheitTemp}`;

                    tempSet = "Fahrenheit";

                    populateFullWeatherInfoDiv(
                      startingIndex,
                      divName,
                      "Temperature",
                      "Fahrenheit"
                    );
                  };

                  celsiusTempButton.onclick = function () {
                    celsiusTempButton.style.color = "black";
                    fahrenheitTempButton.style.color = "#F8F8FF";

                    temperature.innerHTML = `${celsiusTemp}`;

                    tempSet = "Celsius";

                    populateFullWeatherInfoDiv(
                      startingIndex,
                      divName,
                      "Temperature",
                      "Celsius"
                    );
                  };

                  precipitationButton.onclick = function () {
                    populateFullWeatherInfoDiv(
                      startingIndex,
                      divName,
                      "Precipitation",
                      "None"
                    );
                  };

                  windButton.onclick = function () {
                    populateFullWeatherInfoDiv(
                      startingIndex,
                      divName,
                      "WindInfo",
                      "None"
                    );
                  };

                  temperatureButton.onclick = function () {
                    if (tempSet === "Celsius") {
                      populateFullWeatherInfoDiv(
                        startingIndex,
                        divName,
                        "Temperature",
                        "Celsius"
                      );
                    } else if (tempSet === "Fahrenheit") {
                      populateFullWeatherInfoDiv(
                        startingIndex,
                        divName,
                        "Temperature",
                        "Fahrenheit"
                      );
                    }
                  };

                  const forecastDayBackButton =
                    document.createElement("button");
                  forecastDayBackButton.setAttribute(
                    "id",
                    `${divName}BackButton`
                  );
                  forecastDayBackButton.setAttribute(
                    "class",
                    "forecastDayBackButtonClass"
                  );
                  forecastDayBackButton.innerHTML = `<b>Back</b>`;
                  forecastDiv.append(forecastDayBackButton);

                  // const firstDayBackButton = document.createElement('button');
                  // firstDayBackButton.setAttribute('id','firstDayBackButton');
                  // firstDayBackButton.innerHTML = 'First Day Back Button';
                  // forecastDiv.append(firstDayBackButton)

                  const currentTime = currentDateTime.slice(11, 19);

                  const hours = parseInt(currentTime.slice(0, 2));
                }

                function mostFrequent(inputArray) {
                  const frequencyMap = {};
                  let maxElement = inputArray[0];
                  let maxCount = 1;

                  for (let index = 0; index < inputArray.length; index++) {
                    const element = inputArray[index];

                    if (frequencyMap[element]) {
                      frequencyMap[element]++;
                    } else {
                      frequencyMap[element] = 1;
                    }

                    if (frequencyMap[element] > maxCount) {
                      maxElement = element;
                      maxCount = frequencyMap[element];
                    }
                  }

                  return maxElement;
                }

                function getMeanTemp(tempArray) {
                  const highestTemp = Math.max(...tempArray);
                  const lowestTemp = Math.min(...tempArray);

                  // The result is converted from Kelvin to Celsius
                  return Math.round((highestTemp + lowestTemp) / 2 - 273.15);
                }

                // Function will populate the FullWeatherInfoDiv with the data for between 3:00 - 00:00 or in case of 'Today' for the first 8 indices from result['list']. weatherEffect will specify if we want temperature in °F or °C or if user wants precipitiation or wind info

                function populateFullWeatherInfoDiv(
                  startingIndex,
                  divName,
                  weatherEffect,
                  tempUnit
                ) {
                  // with today I know wtarting index is 0

                  const lastIndex = startingIndex + 8;

                  $(`#fullWeatherInfo${divName}`).empty();

                  while (startingIndex < lastIndex) {
                    let weatherWidgetDiv = document.createElement("div");
                    weatherWidgetDiv.setAttribute(
                      "id",
                      `weatherWidgetDiv${startingIndex}`
                    );
                    weatherWidgetDiv.setAttribute('class','weatherWidgetDivClass')

                    // In case user wants Temperature in Celsius
                    let actualCelsiusTemperature = Math.round(
                      result["list"][startingIndex]["main"]["temp"] - 273.15
                    );

                    // In case user wants Temperature in Fahrenheit
                    let actualFahrenheitTemperature = Math.round(
                      actualCelsiusTemperature * 1.8 + 32
                    );

                    // In case user wants Temperature in Fahrenheit
                    let precipitationInfo = Math.round(
                      result["list"][startingIndex]["pop"] * 100
                    );

                    // In case wind info button is pressed
                    let windSpeed =
                      result["list"][startingIndex]["wind"]["speed"];
                    let windDegree =
                      result["list"][startingIndex]["wind"]["deg"];

                    let measurmentTimeString =
                      result["list"][startingIndex]["dt_txt"];

                    let measurmentCleanTime = measurmentTimeString.slice(
                      11,
                      16
                    );

                    let weatherIcon =
                      result["list"][startingIndex]["weather"][0]["icon"];

                    if (
                      weatherEffect === "Temperature" &&
                      tempUnit === "Celsius"
                    ) {
                      weatherWidgetDiv.innerHTML = `<b>${actualCelsiusTemperature}°C</b><img src='https://openweathermap.org/img/wn/${weatherIcon}@2x.png'><b>${measurmentCleanTime}</b>`;
                    } else if (
                      weatherEffect === "Temperature" &&
                      tempUnit === "Fahrenheit"
                    ) {
                      weatherWidgetDiv.innerHTML = `<b>${actualFahrenheitTemperature}°F</b><img src='https://openweathermap.org/img/wn/${weatherIcon}@2x.png'><b>${measurmentCleanTime}</b>`;
                    } else if (
                      weatherEffect === "Precipitation" &&
                      tempUnit === "None"
                    ) {
                      weatherWidgetDiv.innerHTML = `<b>${precipitationInfo}%</b><img src='https://openweathermap.org/img/wn/${weatherIcon}@2x.png'><b>${measurmentCleanTime}</b>`;
                    } else if (
                      weatherEffect === "WindInfo" &&
                      tempUnit === "None"
                    ) {
                      weatherWidgetDiv.innerHTML = `<b>${windSpeed} m/s</b><br><b>${windDegree}°</b><img src='https://openweathermap.org/img/wn/${weatherIcon}@2x.png'><b>${measurmentCleanTime}</b>`;
                    }

                    $(`#fullWeatherInfo${divName}`).append(weatherWidgetDiv);

                    startingIndex++;
                  }
                }

                // As I want to start tomorrow from 3:00 - 00:00 I need to know how many days from JSON doc list are already gone so I can get the exact days

                function getHoursShift(currentHour) {
                  let shiftedIndex = 0;

                  let hourOfMeasurment = parseInt(
                    result["list"][shiftedIndex]["dt_txt"].slice(11, 13)
                  );

                  // while(hourOfMeasurment != 0){

                  //   hourOfMeasurment = parseInt((result['list'][shiftedIndex]['dt_txt']).slice(11,13))

                  //   shiftedIndex++
                  // }

                  if (hourOfMeasurment === 0) {
                    shiftedIndex = 0;
                  } else {
                    while (hourOfMeasurment != 0) {
                      hourOfMeasurment -= 3;
                      shiftedIndex++;
                    }
                  }

                  return shiftedIndex;
                }

                const currentDateObj = new Date();
                const currentTimestamp = currentDateObj.getTime();

                const currentDateTime = unixTimeConverter(currentTimestamp);

                const currentDate = currentDateTime.slice(0, 10);
                const currentTime = currentDateTime.slice(10, 18);

                const dayName = getDayName(currentDate);

                const dayNamesArray = getDayNames(dayName);

                makeButtons(dayNamesArray);

                // Sat 01/01/2023 15:19:23

                //************************************************* */
                // ****   Buttons Functionalities   *************** */
                //************************************************* */

                // After this button is clicked all the temperatures will be set to Celsius
                overviewTempCelsiusButton.onclick = function () {
                  // I am iterating through all of the children of #forecastDiv that are actually the specific daily forecasts and extracting the current temperature unit employed

                  $("#forecastDiv > div").each(function () {
                    let dayTempValue =
                      this.childNodes[0].childNodes[0].childNodes[1]
                        .childNodes[1].childNodes[0].innerHTML;

                    let nightTempValue =
                      this.childNodes[0].childNodes[1].childNodes[1]
                        .childNodes[1].childNodes[0].innerHTML;

                    console.log(nightTempValue);

                    if (
                      dayTempValue.includes("°C") &&
                      nightTempValue.includes("°C")
                    ) {
                      console.log(
                        `Temperature is in Celsius nothing to do here`
                      );

                      return;
                    } else {
                      // Now I know that the unit is not °C so it must be °F and I need to convert Fahrenheot to Celsius

                      let dayTempValueString = dayTempValue.slice(0, -2);
                      dayTempValue = parseInt(dayTempValueString);

                      console.log(`${typeof dayTempValue}`);

                      nightTempValueString = nightTempValue.slice(0, -2);
                      nightTempValue = parseInt(nightTempValueString);

                      console.log(`${typeof nightTempValue}`);

                      console.log(`dayTempValue at Celsius is ${dayTempValue}`);

                      let dayCelsiusValue = (dayTempValue - 32) * (5 / 9);

                      dayCelsiusValue = Math.round(dayCelsiusValue);

                      console.log(
                        `nightTempValue at Celsius is ${nightTempValue}`
                      );

                      let nightCelsiusValue = (nightTempValue - 32) * (5 / 9);

                      nightCelsiusValue = Math.round(nightCelsiusValue);

                      this.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].innerHTML = `${dayCelsiusValue}°C`;

                      this.childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[0].innerHTML = `${nightCelsiusValue}°C`;
                    }
                  });

                  // // I am calling the forecastDiv as parent, as I will be extracting it`s children
                  // var parent = document.getElementById('forecastDiv');

                  // // To find out if the values are Celsius I need to know the unit used

                  // //  I will get the actual value of temperature this way

                  // const dayDivTempValue = (((((parent.childNodes[0]).childNodes[0]).childNodes[0]).childNodes[1]).childNodes[1]).innerHTML;

                  // // And now to get the unit

                  // if((dayDivTempValue.slice(29,31)) === '°C'){
                  //   return;
                  // } else {

                  //   parent.children()
                  //           .each(function ()
                  // }

                  // const dayDiv = ((parent.childNodes[0]).childNodes[0]).childNodes[0]

                  // const dayDivTemp = (((parent.childNodes[0]).childNodes[0]).childNodes[0]).childNodes[1]

                  // const nightDiv = ((parent.childNodes[0]).childNodes[0]).childNodes[1]

                  // const nightDivTempValue = ((((parent.childNodes[0]).childNodes[0]).childNodes[1]).childNodes[1]).childNodes[1]

                  // const lol = nightDivTempValue.innerHTML;

                  // const doublelol = lol.slice(0,4);

                  // console.log(lol)

                  // // <h4 id="minNightTempValue">13°C</h4>

                  // const realVal = lol.slice(29,31);

                  // if(realVal === '°C'){
                  //   alert('It is celsius');
                  // }

                  // dayDivTempValue.innerHTML = `<h4>999°C</h4>`
                  // nightDivTempValue.innerHTML = `<h4>896</h4>`
                };

                overviewTempFahrenheitButton.onclick = function () {
                  $("#forecastDiv > div").each(function () {
                    let dayTempValue =
                      this.childNodes[0].childNodes[0].childNodes[1]
                        .childNodes[1].childNodes[0].innerHTML;

                    let nightTempValue =
                      this.childNodes[0].childNodes[1].childNodes[1]
                        .childNodes[1].childNodes[0].innerHTML;

                    console.log(nightTempValue);

                    if (
                      dayTempValue.includes("°F") &&
                      nightTempValue.includes("°F")
                    ) {
                      console.log(
                        `Temperature is in Fahrenheit nothing to do here`
                      );
                      return;
                    } else {
                      // Now I know that the unit is not °F so it must be °C and I need to convert Celsius to Fahrenheit

                      dayTempValueString = dayTempValue.slice(0, -2);
                      dayTempValue = parseInt(dayTempValueString);

                      let nightTempValueString = nightTempValue.slice(0, -2);
                      nightTempValue = parseInt(nightTempValueString);

                      console.log(
                        `nightTempValueString is ${nightTempValueString}`
                      );

                      let dayFahrenheitValue = Math.round(
                        dayTempValue * 1.8 + 32
                      );

                      console.log(
                        `dayFahrenheitValue is ${dayFahrenheitValue}`
                      );

                      let nightFahrenheitValue = Math.round(
                        nightTempValue * 1.8 + 32
                      );

                      this.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].innerHTML = `${dayFahrenheitValue}°F`;

                      this.childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[0].innerHTML = `${nightFahrenheitValue}°F`;
                    }
                  });
                };

                const firstDayId = dayNamesArray[0];
                const secondDayId = dayNamesArray[1];
                const thirdDayId = dayNamesArray[2];
                const fourthDayId = dayNamesArray[3];
                const fifthDayId = dayNamesArray[4];

                const firstDayButton = document.getElementById(firstDayId);



                firstDayButton.onclick = function () {
                  // $("#forecastDiv").hide();

                  $("#forecastOverviewDiv").hide();

                  if (document.getElementById("firstDayDiv")) {
                    $("#firstDayDiv").show();
                  } else {
                    const firstDayDiv = document.createElement("div");
                    firstDayDiv.setAttribute("id", "firstDayDiv");
                    firstDayDiv.setAttribute("class", "firstDayDivClass");

                    popUpDiv.append(firstDayDiv);

                    // populateToday(dayName)

                    populateForecastDiv(0, "firstDayDiv", firstDayId);
                  }

                  firstDayDivBackButton.onclick = function () {
                    $("#firstDayDiv").hide();
                    $("#forecastOverviewDiv").show();
                  };
                };

                const secondDayButton = document.getElementById(secondDayId);

                secondDayButton.onclick = function () {
                  // $("#forecastDiv").hide();
                  $("#forecastOverviewDiv").hide();

                  if (document.getElementById("secondDayDiv")) {
                    $("#secondDayDiv").show();
                  } else {
                    const currentHour = parseInt(currentTime.slice(0, 2));

                    const shiftedIndex = getHoursShift(currentHour);
                    const secondDayFirstMeasurmentIndex = 9 - shiftedIndex;

                    const secondDayDiv = document.createElement("div");
                    secondDayDiv.setAttribute("id", "secondDayDiv");
                    secondDayDiv.setAttribute("class", "secondDayDivClass");

                    // const secondDayDivBackButton = document.createElement('button');
                    // secondDayDivBackButton.setAttribute('id','secondDayDivBackButton');
                    // secondDayDivBackButton.innerHTML = `Second Day Back`;

                    // secondDayDiv.append(secondDayDivBackButton)

                   popUpDiv.append(secondDayDiv);

                    populateForecastDiv(
                      secondDayFirstMeasurmentIndex,
                      "secondDayDiv",
                      secondDayId
                    );
                  }

                  secondDayDivBackButton.onclick = function () {
                    $("#secondDayDiv").hide();
                    $("#forecastOverviewDiv").show();
                  };
                };

                const thirdDayButton = document.getElementById(thirdDayId);

                thirdDayButton.onclick = function () {
                  $("#forecastOverviewDiv").hide();

                  if (document.getElementById("thirdDayDiv")) {
                    $("#thirdDayDiv").show();
                  } else {
                    const currentHour = parseInt(currentTime.slice(0, 2));

                    const shiftedIndex = getHoursShift(currentHour);
                    const thirdDayFirstMeasurmentIndex = 17 - shiftedIndex;

                    const thirdDayDiv = document.createElement("div");
                    thirdDayDiv.setAttribute("id", "thirdDayDiv");
                    thirdDayDiv.setAttribute("class", "thirdDayDivClass");

                    // const thirdDayDivBackButton = document.createElement('button');
                    // thirdDayDivBackButton.setAttribute('id','thirdDayDivBackButton');
                    // thirdDayDivBackButton.innerHTML = `Third Day Back`;

                    // thirdDayDiv.append(thirdDayDivBackButton)

                   popUpDiv.append(thirdDayDiv);

                    populateForecastDiv(
                      thirdDayFirstMeasurmentIndex,
                      "thirdDayDiv",
                      thirdDayId
                    );
                  }

                  thirdDayDivBackButton.onclick = function () {
                    $("#thirdDayDiv").hide();
                    $("#forecastOverviewDiv").show();
                  };
                };

                const fourthDayButton = document.getElementById(fourthDayId);

                fourthDayButton.onclick = function () {
                  $("#forecastOverviewDiv").hide();

                  if (document.getElementById("fourthDayDiv")) {
                    $("#fourthDayDiv").show();
                  } else {
                    const currentHour = parseInt(currentTime.slice(0, 2));

                    const shiftedIndex = getHoursShift(currentHour);
                    const fourthDayFirstMeasurmentIndex = 25 - shiftedIndex;

                    const fourthDayDiv = document.createElement("div");
                    fourthDayDiv.setAttribute("id", "fourthDayDiv");
                    fourthDayDiv.setAttribute("class", "fourthDayDivClass");

                    // const fourthDayDivBackButton = document.createElement('button');
                    // fourthDayDivBackButton.setAttribute('id','fourthDayDivBackButton');
                    // fourthDayDivBackButton.innerHTML = `Fourth Day Back`;

                    // fourthDayDiv.append(fourthDayDivBackButton)

                    popUpDiv.append(fourthDayDiv);

                    populateForecastDiv(
                      fourthDayFirstMeasurmentIndex,
                      "fourthDayDiv",
                      fourthDayId
                    );
                  }

                  fourthDayDivBackButton.onclick = function () {
                    $("#fourthDayDiv").hide();
                    $("#forecastOverviewDiv").show();
                  };
                };

                const fifthDayButton = document.getElementById(fifthDayId);

                fifthDayButton.onclick = function () {
                  $("#forecastOverviewDiv").hide();

                  if (document.getElementById("fifthDayDiv")) {
                    $("#fifthDayDiv").show();
                  } else {
                    const currentHour = parseInt(currentTime.slice(0, 2));

                    const shiftedIndex = getHoursShift(currentHour);
                    const fifthDayFirstMeasurmentIndex = 33 - shiftedIndex;

                    const fifthDayDiv = document.createElement("div");
                    fifthDayDiv.setAttribute("id", "fifthDayDiv");
                    fifthDayDiv.setAttribute("class", "fifthDayDivClass");

                    // const fifthDayDivBackButton = document.createElement('button');
                    // fifthDayDivBackButton.setAttribute('id','fifthDayDivBackButton');
                    // fifthDayDivBackButton.innerHTML = `Fifth Day Back`;

                    // fifthDayDiv.append(fifthDayDivBackButton)

                    popUpDiv.append(fifthDayDiv);

                    populateForecastDiv(
                      fifthDayFirstMeasurmentIndex,
                      "fifthDayDiv",
                      fifthDayId
                    );
                  }

                  fifthDayDivBackButton.onclick = function () {
                    $("#fifthDayDiv").hide();
                    $("#forecastOverviewDiv").show();
                  };
                };

                // firstDay.onclick = function(){
                //   alert(`${firstDay} clicked!`);
                // }
              }
            }
          },

          error: function (jqXHR, textStatus, errorThrown) {
            console.log("The Wrather Api data have not been sent");
          },
        });

        function unixTimeConverter(unixTimestamp) {
          console.log(`Unix Timestamp is: ${unixTimestamp}`);

          var JSdate = new Date(unixTimestamp);

          console.log(`JS DATE is: ${JSdate}`);

          // Generate date string
          // console.log(JSdate.toLocaleDateString("en-US"));   // Prints: 5/6/2022
          // console.log(JSdate.toLocaleDateString("en-GB"));   // Prints: 06/05/2022
          // console.log(JSdate.toLocaleDateString("default")); // Prints: 5/6/2022

          // Generate time string
          // console.log(JSdate.toLocaleTimeString("en-US"));   // Prints: 1:10:34 PM
          // console.log(JSdate.toLocaleTimeString("it-IT"));   // Prints: 13:10:34
          // console.log(JSdate.toLocaleTimeString("default")); // Prints: 1:10:34 PM

          const date = JSdate.toLocaleDateString("en-GB");
          const cleanDate = date.replace("/", "-");

          const time = JSdate.toLocaleTimeString("it-IT");

          return date + " " + time;
        }
      };

      currencyConverterButton.onclick = function (){

       
        $.ajax({
          url: "php/latestExchangeRates.php",
          type: 'GET',
          dataType: 'json',

          success: function(result){
            

        $("#mainMenuDiv").hide();

        if (document.getElementById("currencyConverterDiv")){

          $("#currencyConverterDiv").show();

        } else {
        
          const currencyConverterDiv = document.createElement('div');
          currencyConverterDiv.setAttribute('id','currencyConverterDiv');
          currencyConverterDiv.setAttribute('class','generalInfoMenuDiv');

          popUpDiv.append(currencyConverterDiv);


          const currencyHeadingDiv = document.createElement('div');
          currencyHeadingDiv.setAttribute('id','currencyHeadingDiv');
          currencyConverterDiv.append(currencyHeadingDiv)

          const currencyHeadingText = document.createElement('p');
          currencyHeadingText.setAttribute('id','currencyHeadingText');
          currencyHeadingText.innerHTML = 'Welcome to Currency Converter Section';
          currencyHeadingDiv.append(currencyHeadingText);

          const currencySpanText = document.createElement('span');
          currencySpanText.setAttribute('id','currencySpanText');
          currencySpanText.innerHTML = 'Please pick a currency you want to convert with appropriate amount';
          currencyHeadingDiv.append(currencySpanText);


          
          // Curency Rates Form
          const currencyConverterFormDiv = document.createElement('div');
          currencyConverterFormDiv.setAttribute('id','currencyConverterFormDiv');
          currencyConverterDiv.append(currencyConverterFormDiv);


          const currencyConverterForm = document.createElement('form');
          currencyConverterForm.setAttribute('id','currencyConverterForm');
          currencyConverterFormDiv.append(currencyConverterForm);

          const currencyNameList = document.createElement('datalist');
          currencyNameList.setAttribute('id','currencyNameList')
          currencyConverterForm.append(currencyNameList)


          var currencyDataNames;
          // Populating datalist
          $.get('https://openexchangerates.org/api/currencies.json', function(currencyData) {
                              
                              for (var currencyCode in currencyData) {

                                console.log(currencyCode)
                                console.log( currencyData[currencyCode])
                      
                                $("#currencyNameList").append(
                                  "<option id= "+ currencyCode + " value=" + currencyCode + ">" + currencyData[currencyCode] + "</option>"
                                );                      
                              } 

                              currencyDataNames = currencyData;
                              
                              

                            });  

          

          const currencyFromLabel = document.createElement('label');
          currencyFromLabel.setAttribute('for','fromCurrency');
          currencyFromLabel.setAttribute('class','currencyConverterFormLabelClass');
          currencyFromLabel.innerHTML = 'From';
          currencyConverterForm.append(currencyFromLabel);

          $('<input/>').attr({ 
            type: 'text', 
            id: 'fromCurrency', 
            name: 'fromCurrency',
            list: 'currencyNameList',
            placeholder: 'Pick a Currency...',
            class: 'currencyConverterFormInputClass',
            required: 'true'
          }).appendTo('#currencyConverterForm');


          const currencyToLabel = document.createElement('label');
          currencyToLabel.setAttribute('for','currencyTo');
          currencyToLabel.setAttribute('class','currencyConverterFormLabelClass');
          currencyToLabel.innerHTML = 'To';
          currencyConverterForm.append(currencyToLabel)


          $('<input/>').attr({ 
            type: 'text', 
            id: 'currencyTo', 
            name: 'currencyTo',
            list: 'currencyNameList',
            placeholder: 'Pick a Currency...',
            class: 'currencyConverterFormInputClass',
            required: 'true'
          }).appendTo('#currencyConverterForm');


          const amountLabel = document.createElement('label');
          amountLabel.setAttribute('for','amount');
          amountLabel.setAttribute('class','currencyConverterFormLabelClass');
          amountLabel.innerHTML = 'Amount';
          currencyConverterForm.append(amountLabel);

          $('<input/>').attr({ 
            type: 'number', 
            id: 'amount', 
            name: 'amount', 
            class: 'currencyConverterFormInputClass',
            required: 'true'
          }).appendTo('#currencyConverterForm');


          const currencyConverterFormSubmitButton = document.createElement('button');
          currencyConverterFormSubmitButton.setAttribute('id','currencyConverterFormSubmitButton');
          currencyConverterFormSubmitButton.setAttribute('type','submit');
          currencyConverterFormSubmitButton.setAttribute('title','currencyConverterFormSubmitButton');
          currencyConverterFormSubmitButton.innerHTML = 'Submit';
          currencyConverterForm.append(currencyConverterFormSubmitButton)


          const convertedCurrencyInfoDiv = document.createElement('div');
          convertedCurrencyInfoDiv.setAttribute('id','convertedCurrencyInfoDiv');
          currencyConverterDiv.append(convertedCurrencyInfoDiv);
          $('#convertedCurrencyInfoDiv').hide();


          const convertedCurrencyInfoText = document.createElement('p');
          convertedCurrencyInfoText.setAttribute('id','convertedCurrencyInfoText');
          convertedCurrencyInfoDiv.append(convertedCurrencyInfoText)

          const convertedCurrencyInfoTextSpan = document.createElement('p');
          convertedCurrencyInfoTextSpan.setAttribute('id','convertedCurrencyInfoTextSpan');
          convertedCurrencyInfoDiv.append(convertedCurrencyInfoTextSpan)

          


          $('#currencyConverterForm').submit(function(event){

            event.preventDefault();
        
            const original = $('#fromCurrency').val();
            const final = $('#currencyTo').val();

            const originalLowerCase = original.toLowerCase();
            const finalLowerCase = final.toLowerCase();
            
            const amount = $('#amount').val();

            let parsedAmount = parseFloat(amount);


            const currentRateTime = result['timestamp']

            // Making Sure that USer Enters valid input

            const validCurrencyCodes = [];
            const validCurrencyValues = [];

            var currencyNames = document.getElementById("currencyNameList");
        
            for(let i = 0; i < currencyNames.options.length; i++){

              // To get all possible currency codes
              validCurrencyCodes.push((currencyNames.options[i].value).toLowerCase())
              
              // To get full name in case user would want to type them
              validCurrencyValues.push((currencyNames.options[i].text).toLowerCase())
            
            }

            

            if(validCurrencyCodes.includes(originalLowerCase) || validCurrencyValues.includes(originalLowerCase)){



              if(validCurrencyCodes.includes(finalLowerCase) || validCurrencyValues.includes(finalLowerCase)){

                if(amount >= 0){

                  // In case user enter valid currency name, I still need to find corresponding Currency Code

                  let originalCurrencyCode;
                  let finalCurrencyCode;
                  
                  if(originalLowerCase.length > 3){

                  let currentOriginalValue;
                                  

                  Object.keys(currencyDataNames).forEach(function(key) {

                    currentOriginalValue = (currencyDataNames[key]).toLowerCase();
                
                    if(currentOriginalValue === originalLowerCase){              
                        console.log(`User entered ${originalLowerCase}, in my JSON it is under ${key}`);

                        originalCurrencyCode = key;
                       
                    }                    
                  })                  
                  } else {

                    originalCurrencyCode = originalLowerCase.toUpperCase();

                  }

                
                
                if(finalLowerCase.length > 3){

                  let currentOriginalValue;
                                  

                  Object.keys(currencyDataNames).forEach(function(key) {

                    currentOriginalValue = (currencyDataNames[key]).toLowerCase();
                
                    if(currentOriginalValue === finalLowerCase){              
                        console.log(`User entered ${finalLowerCase}, in my JSON it is under ${key}`);

                        finalCurrencyCode = key;
                       
                    }                    
                  }) 

                      
                } else {

                  finalCurrencyCode = finalLowerCase.toUpperCase();
                }

                  // As I do not have paid membership, in order to get conversion I need to go through base currency that is US Dollar

                  
                  
                  console.log(`Original is: ${original}\nFinal is ${final}`)
                  
                  const originalToUSD = result['rates'][originalCurrencyCode];
                  const finalToUSD = result['rates'][finalCurrencyCode];

                  const convertedValue = (amount * (finalToUSD / originalToUSD)).toFixed(4);


                  console.log(`Original to USD: ${originalToUSD}\nFinal to USD ${finalToUSD}`)


                  const originalCurrencyName = currencyDataNames[originalCurrencyCode];
                  const finalCurrencyName = currencyDataNames[finalCurrencyCode]
                

                  // Converting timestamp to Human Readable
                  var JSONDate = new Date(currentRateTime * 1000);

                  const rateDate = JSONDate.toLocaleDateString("en-GB");
      
                  console.log(rateDate)
      
                  const rateTime = JSONDate.toLocaleTimeString("it-IT");
      
                  console.log(rateTime)
      
                  const cleanRateTime = rateDate + " at " + rateTime;
      
                  $('#convertedCurrencyInfoDiv').show();
      
                  convertedCurrencyInfoText.innerHTML = `For ${parsedAmount} ${originalCurrencyName}<br><br> you will get<br><br> ${convertedValue} ${finalCurrencyName}.`;

                  convertedCurrencyInfoTextSpan.innerHTML = `The latest conversion rate is valid from ${cleanRateTime}`


                  console.log()



                
                } else {

                  alert('Please Enter Valid Curency Amount. Not negative number');
                  currencyConverterForm.reset();


                }

              } else {

                alert('Please Enter Valid Curency Name');
                currencyConverterForm.reset();
             
              }
            } else {

              alert('Please Enter Valid Curency Name');
              
              currencyConverterForm.reset()

            }

          })
          


          // Converter Back Button

          const currencyConverterBackButtonDiv = document.createElement('div');
          currencyConverterBackButtonDiv.setAttribute('id','currencyConverterBackButtonDiv');
          currencyConverterBackButtonDiv.setAttribute('class','mainMenuBackButtonDivClass')
          currencyConverterDiv.append(currencyConverterBackButtonDiv);


          const currencyConverterBackButton = document.createElement('button');
          currencyConverterBackButton.setAttribute('id','currencyConverterBackButton');
          currencyConverterBackButton.setAttribute('class','mainMenuBackButtonClass');
          currencyConverterBackButton.innerHTML = 'Back';
          currencyConverterBackButtonDiv.append(currencyConverterBackButton)

          currencyConverterBackButton.onclick = function () {

            $("#currencyConverterDiv").hide();
            $("#mainMenuDiv").show();

          }

        }




           
          },

          error: function (jqXHR, textStatus, errorThrown) {
            console.log("The data from Latest Currency Rates have not been sent");
          },



        })



      }



      
    }


    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      layer.bringToFront();
    }

    function resetHighlight(e) {
      var layer = e.target;

      layer.setStyle({
        fillColor: "yellow",
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.2,
        color: "orange",
      });
    }

    // Center on the map into upon click
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

   

    function getCoords(e) {
      var coord = e.latlng.toString().split(","); // LatLng(50.876459, 21.263776)

      var lat = coord[0].replace("LatLng(", "");
      var long = coord[1].replace(")", "");

      // L.marker(e.latlng).addTo(map);

      // $("#curentCoordinates").empty();
      $("#lattitude").html(lat);
      $("#longitude").html(long);

      // $("#curentCoordinates").append("<b>Latitude: " + lat +
      // "<br>Longitude: " + long + "</b>");
    }

    
  


  $("#countryForm").submit(function (event) {
    event.preventDefault();

    // Check that user submit only valid country even though he would use upper or lower

    var userValue = $("#countryName").val();

    console.log(`userValue is ${userValue}`)

    const countryListLength = document.getElementById("countryList").options.length;

    if (userValue != null && userValue.length > 0) {


    for(let i = 0; i < countryListLength; i++){

      let realCountry = document.getElementById("countryList").options[i];

      if(userValue.toLowerCase() === (realCountry.innerHTML).toLowerCase() || userValue.toLowerCase() === (realCountry.value).toLowerCase()){

      var countryCodeCC3 = document.getElementById("countryList").options[i].value;

      break;

      }

    }


    console.log(`countryCodeCC3 is: ${countryCodeCC3}`)
  

    
      console.log("valid country"); // allow form submission

      $.ajax({
        url: "php/restCountries.php",
        type: "POST",
        dataType: "json",

        data: {
          cca3: countryCodeCC3,
        },

        success: function (result) {
          console.log("Form Submitted, Data from PHP received");


          // After User submits country from datalist, he is then taken to that country on the map, where upon clicking on the map they can see information
    
          // First I need to identify the country based on user choice. So I can use json objec or that current country
          

          
          const country = (worldCountries['features']).filter((country) => country["properties"]["iso_a3"] === countryCodeCC3);

          console.log(`country is: ${JSON.stringify(country)}`)



          // geoJsonLayer will basically take the coordinates from user`s country which will be used to create bounding box(geoJsonLayer.getBounds()) and therefore it will be zoomed so the user can see just that country
          var geoJsonLayer = L.geoJson(country);

          // map.flyToBounds will center the map on chosen country
          map.flyToBounds(geoJsonLayer.getBounds());

          
        },

        error: function (jqXHR, textStatus, errorThrown) {
          alert("Country not Found!");
          $("#countryList").val('');
        },
      });
    } else {
      alert("Invalid Option"); // don't allow form submission and reset the form
      document.getElementById("countryForm").reset();
    }
  });

  }

  getLocation();


});
