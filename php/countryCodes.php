<?php 
    
    ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // !! THIS IS HOW YOU CAN ACCESS LOCAL JSON FILE !!!
    $url = __DIR__ . '/countryBorders.geo.json';

    // !! ECHO will return data back to jQuery, so the data could be used and echo file_get_contents($url) would work. But, to make it easier I will want to 'decode' them or in other words to process them so I will be able to use them in Array Format
     
    $result = file_get_contents($url);

    $decode = json_decode($result, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . "ms";
    
    $output['data'] = $decode['features'];

	header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>