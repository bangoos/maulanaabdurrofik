<?php
// Simple PHP server to test if hosting is working
header('Content-Type: application/json');

$response = [
    'status' => 'OK',
    'message' => 'PHP server is working!',
    'timestamp' => date('c'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
