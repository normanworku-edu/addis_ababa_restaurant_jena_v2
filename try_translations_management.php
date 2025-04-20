<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <div class="container my-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Translation Management</h1>
            <button id="updateWebsiteTranslations" class="btn btn-primary" disabled>
                <i class="bi bi-cloud-upload"></i> Update Website
            </button>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle" id="translationsTable">
            <thead class="table-dark">
                <tr>
                <th class="text-center"> # </th>
                <th class="text-center">English <i class="bi bi-arrow-down-up"></i></th>
                <th class="text-center">German <i class="bi bi-arrow-down-up"></i></th>
                <th class="text-center">Amharic <i class="bi bi-arrow-down-up"></i></th>
                <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows will be dynamically populated -->
            </tbody>
            </table>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/admin_translations.js"></script></body>
</html>
