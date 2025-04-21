<?php
header('Content-Type: application/json');

// Validate required parameters
if (!isset($_POST['upload_path'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Upload path parameter is required'
    ]);
    exit;
}

$uploadDir = $_POST['upload_path'];
$backupDir = 'backups/'; // Directory for backup files
try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests are allowed', 405);
    }
    
    // Check if file was uploaded
    if (!isset($_FILES['image'])) {
        throw new Exception('No file uploaded', 400);
    }

    $file = $_FILES['image'];
    
    // Validate file upload error
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('File upload error: ' . $file['error'], 400);
    }

    // Validate file size (5MB max)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        throw new Exception('File is too large. Maximum size is 5MB', 400);
    }

    // Validate file type
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($fileInfo, $file['tmp_name']);
    finfo_close($fileInfo);
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($mimeType, $allowedMimeTypes) || !in_array($extension, $allowedExtensions)) {
        throw new Exception('Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP images are allowed', 400);
    }

    // Validate is actual image
    if (!getimagesize($file['tmp_name'])) {
        throw new Exception('File is not a valid image', 400);
    }

    // Ensure upload directory ends with a slash
    $uploadDir = rtrim($uploadDir, '/') . '/';
    
    // Create upload directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create upload directory', 500);
        }
    }


    // Get original filename and extension
    $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = $originalName . '.' . $extension;
    $destination = $uploadDir . $filename;

    // If file exists, rename existing file with backup timestamp
    if (file_exists($destination)) {
        $backupTimestamp = date(format: 'Y-m-d_His');
        $backupFilename = $originalName . '_backup_' . $backupTimestamp . '.' . $extension;
        $backupPath = $backupDir . $backupFilename;
        
        if (!rename($destination, $backupPath)) {
            throw new Exception('Failed to create backup of existing file', 500);
        }
    }

    // Move the uploaded file
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Failed to save the image', 500);
    }
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'filename' => $filename,
        'path' => $destination,
        'backup_created' => isset($backupFilename) ? $backupFilename : false
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Image</title>
</head>
<body>
    <h1 data-translate="uploadImageTitle">Upload Image</h1>
    <p data-translate="uploadImageIntro">Use this page to upload images to the server.</p>
    <form action="upload_image.php" method="post" enctype="multipart/form-data">
        <label for="imageFile" data-translate="selectImageLabel">Select Image File</label>
        <input type="file" id="imageFile" name="imageFile">
        <button type="submit" data-translate="uploadButton">Upload</button>
    </form>
</body>
</html>