<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);


    $url = 'openexchangerates.org/api/latest.json?app_id=eabcbd09dc734c58a70111751571a26d';
    
    
    // 49.03878
    // 
    // api.openweathermap.org/data/2.5/forecast?lat=49.03878&lon=6.174316&appid=a605e65e9c3dc730e12e89b99f68d56c


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

    
    $output["timestamp"] = $decode["timestamp"];

    $output["rates"] = $decode["rates"];


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 


?>