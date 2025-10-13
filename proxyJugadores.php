<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$apiKey = "cb132c9eba52f10855f7808d07c75c3";
$url = "https://v3.football.api-sports.io/players?league=140&season=2025&page=1";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "x-apisports-key: $apiKey"
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener los datos de jugadores", "detalle" => $err]);
    exit;
}

echo $response;
