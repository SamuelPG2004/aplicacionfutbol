<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


$apiKey = "5fce32a19c334f348cfda7c56bc8062e";

$url = "https://api.football-data.org/v4/competitions/PD/standings";


$options = [
    "http" => [
        "header" => "X-Auth-Token: $apiKey\r\n",
        "method" => "GET"
    ]
];


$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);


if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener datos de la API externa."]);
    exit;
}


echo $response;
?>
