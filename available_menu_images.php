<?php
// filepath: c:\Users\zonwo\OneDrive - Carl Zeiss AG\Personal_Documents\Personal_Projects\JenaRestaurantWebsite\jena_restaurant_git\generated_by_Deepseek\list_images.php

$directory = 'assets/img/dishes/';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if (is_dir($directory)) {
    $files = array_filter(scandir($directory), function ($file) use ($directory, $allowedExtensions) {
        $filePath = $directory . $file;
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        return is_file($filePath) && in_array($extension, $allowedExtensions);
    });

    echo json_encode(array_values($files));
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Directory not found']);
}
?>