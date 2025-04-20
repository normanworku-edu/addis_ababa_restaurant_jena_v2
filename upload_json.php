<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonFile = $_FILES['jsonFile'] ?? null;
    $uploadPath = $_POST['upload_path'] ?? 'assets/json/'; // Updated default path

    if (!$jsonFile) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No JSON file provided']);
        exit;
    }

    try {
        // Validate file is JSON
        $content = file_get_contents($jsonFile['tmp_name']);
        json_decode($content);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Uploaded file is not valid JSON');
        }

        // Get original filename (without path)
        $originalFilename = basename($jsonFile['name']);
        
        // Ensure filename ends with .json
        if (strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION)) !== 'json') {
            throw new Exception('File must have .json extension');
        }

        // Determine the target directory
        $targetDirectory = rtrim($uploadPath, '/') ?: '.'; // Use current folder if upload_path is empty

        // Create target directory if it doesn't exist
        if (!file_exists($targetDirectory)) {
            if (!mkdir($targetDirectory, 0755, true)) {
                throw new Exception('Failed to create target directory: ' . $targetDirectory);
            }
        }

        // Create backups directory relative to the target directory
        $backupDirectory = 'backups';
        if (!file_exists($backupDirectory)) {
            if (!mkdir($backupDirectory, 0755, true)) {
                throw new Exception('Failed to create backups directory: ' . $backupDirectory);
            }
        }

        // Check if file exists and create backup
        $targetFilePath = $targetDirectory . '/' . $originalFilename;
        if (file_exists($targetFilePath)) {
            $timestamp = date('Y-m-d_H-i-s');
            $backupFilename = pathinfo($originalFilename, PATHINFO_FILENAME) . 
                             '_backup_on_' . $timestamp . '.json';
            $backupPath = $backupDirectory . '/' . $backupFilename;

            if (!copy($targetFilePath, $backupPath)) {
                throw new Exception('Failed to create backup file');
            }
        }

        // Save new file
        if (!move_uploaded_file($jsonFile['tmp_name'], $targetFilePath)) {
            throw new Exception('Failed to save new JSON file');
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'JSON file uploaded successfully',
            'filename' => $originalFilename,
            'uploadPath' => $targetDirectory,
            'backupCreated' => isset($backupFilename) ? $backupFilename : null
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST allowed'
    ]);
}
?>