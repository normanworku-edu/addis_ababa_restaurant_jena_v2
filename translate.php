<?php
// Set headers for JSON response
header('Content-Type: application/json');

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['text']) || !isset($data['targetLang'])) {
        throw new Exception('Missing required parameters');
    }

    $text = $data['text'];
    $targetLang = $data['targetLang'];

    // LibreTranslate API endpoint (using a public instance)
    $url = 'https://translate.argosopentech.com/translate';

    // Prepare the request data
    $postData = array(
        'q' => $text,
        'source' => 'en',
        'target' => $targetLang,
    );

    // Initialize cURL session
    $ch = curl_init($url);
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json'
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 10 seconds timeout

    // Execute the request
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        throw new Exception('Translation service error: ' . curl_error($ch));
    }
    
    // Close cURL session
    curl_close($ch);

    // Parse the response
    $result = json_decode($response, true);
    
    if (!isset($result['translatedText'])) {
        throw new Exception('Invalid response from translation service');
    }

    // Return success response
    echo json_encode([
        'success' => true,
        'translation' => $result['translatedText']
    ]);

} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
