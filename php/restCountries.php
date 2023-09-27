<?php 

    ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url = 'https://restcountries.com/v3.1/alpha/' . $_REQUEST['cca3'];

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    // Country name

    // Checking if the country has a key called boders - Japan has no borders!
    
    if (array_key_exists("borders",$output)){
        $output["borders"] = $decode[0]["borders"];
    }

    $output['name'] = $decode[0]['name'];
    
    $output['currency'] = $decode[0]['currencies'];

    $output["capital"] = $decode[0]["capital"];

    $output["alterNames"] = $decode[0]["altSpellings"];

    $output["region"] = $decode[0]["region"];

    $output["subregion"] = $decode[0]["subregion"];

    $output["languages"] = $decode[0]["languages"];

    

    $output["population"] = $decode[0]["population"];

    $output["drivingSide"] = $decode[0]["car"];

    $output["timezones"] = $decode[0]["timezones"];

    $output["flags"] = $decode[0]["flags"];

    $output["coatOfArms"] = $decode[0]["coatOfArms"];


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

?>