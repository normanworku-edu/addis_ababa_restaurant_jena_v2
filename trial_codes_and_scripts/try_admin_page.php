<?php
session_start();
session_unset();
session_destroy();
session_start(); // Restart session for login handling

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Load user accounts from JSON file
    $userAccountsFile = 'assets/json/userAccounts.json';
    if (!file_exists($userAccountsFile)) {
        $errorMessage = 'User accounts file not found. Please contact the administrator.';
    } else {
        $userAccountsData = json_decode(file_get_contents($userAccountsFile), true);

        // Ensure $userAccountsData is valid
        if (!is_array($userAccountsData) || !isset($userAccountsData['userAccounts'])) {
            $errorMessage = 'Error loading user accounts. Please try again later.';
        } else {
            $userAccounts = $userAccountsData['userAccounts'];

            // Check if the username exists and the password matches
            if (isset($userAccounts[$username]) && $userAccounts[$username]['password'] === $password) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['username'] = $username;
            } else {
                $errorMessage = 'Invalid username or password.';
            }
        }
    }
}

// Check if the user is logged in
$isLoggedIn = $_SESSION['admin_logged_in'] ?? false;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
</head>
<body class="admin-page">

<?php if (!$isLoggedIn): ?>

    <!-- Login Section -->
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Admin Login</h4>
                    </div>
                    <div class="card-body">
                        <?php if (!empty($errorMessage)): ?>
                            <div class="alert alert-danger" role="alert">
                                <?php echo $errorMessage; ?>
                            </div>
                        <?php endif; ?>
                        <form method="POST" action="try_admin_page.php">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" name="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" name="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php else: ?>

    <!-- Admin Content Section -->
    <div id="adminContent">
        <h1 data-translate="adminPanelTitle">Admin Panel</h1>
        <p data-translate="adminPanelIntro">Manage your website content and settings here.</p>
        <nav>
            <ul>
                <li><a href="admin_menu.php" data-translate="adminMenu">Menu Management</a></li>
                <li><a href="admin_gallery.php" data-translate="adminGallery">Gallery Management</a></li>
                <li><a href="admin_reviews.php" data-translate="adminReviews">Reviews Management</a></li>
                <li><a href="admin_contact.php" data-translate="adminContact">Contact Info Management</a></li>
                <li><a href="admin_home.php" data-translate="adminHome">Home Page Management</a></li>
                <li><a href="logout.php" data-translate="adminHome">Logout</a></li>
            </ul>
        </nav>
        <form method="POST" action="logout.php">
            <button type="submit" class="btn btn-danger">Logout</button>
        </form>
    </div>

<?php endif; ?>

<!-- Include Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>