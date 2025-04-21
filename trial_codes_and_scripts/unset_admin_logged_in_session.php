<?php
// filepath: c:\Users\meske\OneDrive\personal_projects\addis_ababa_restaurant_jena_v2\unset_session.php
session_start();
unset($_SESSION['admin_logged_in']);
echo json_encode(['success' => true]);
?>
