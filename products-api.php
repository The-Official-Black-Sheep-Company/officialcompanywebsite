<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Read the products JSON file
$productsJson = file_get_contents(__DIR__ . '/api/products.json');
$products = json_decode($productsJson, true);

// Select 4 random products for featured showcase
$featured = array_slice($products, 0, 4);

// Return in the format the store expects
echo json_encode([
    'featured' => $featured,
    'all' => $products,
    'count' => count($products)
], JSON_PRETTY_PRINT);
?>
