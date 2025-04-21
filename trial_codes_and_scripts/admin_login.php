<?php
session_start();

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
                header('Location: admin.php');
                exit;
            } else {
                $errorMessage = 'Invalid username or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
</head>
<body>
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
                        <form method="POST" action="admin_login.php">
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
</body>
</html>
