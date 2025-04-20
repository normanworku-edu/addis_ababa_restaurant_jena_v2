<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Homepage Content</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-3">
        <h1 class="text-center">Manage Homepage Content</h1>
        <div id="homeContentForm">

            <!-- Save Button -->
            <button class="btn btn-success" id="saveHomeContentBtn">Save Homepage Content</button>

            <!-- Home Title Section -->
            <div class="card mb-3" id="homeTitleCard">
                <div class="card-header">Home Title</div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="homeTitleTabs" role="tablist">
                        <!-- Tabs for each language -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="homeTitle-en-tab" data-bs-toggle="tab" data-bs-target="#homeTitle-en" type="button" role="tab">English</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="homeTitle-de-tab" data-bs-toggle="tab" data-bs-target="#homeTitle-de" type="button" role="tab">German</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="homeTitle-am-tab" data-bs-toggle="tab" data-bs-target="#homeTitle-am" type="button" role="tab">Amharic</button>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <!-- Tab content for each language -->
                        <div class="tab-pane" id="homeTitle-en" role="tabpanel">
                            <textarea id="homeTitle-en-input" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="tab-pane" id="homeTitle-de" role="tabpanel">
                            <textarea id="homeTitle-de-input" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="tab-pane" id="homeTitle-am" role="tabpanel">
                            <textarea id="homeTitle-am-input" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Home Subtitle Section -->
            <div class="card mb-3" id="homeSubtitleCard">
                <div class="card-header">Home Subtitle</div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="homeSubtitleTabs" role="tablist">
                        <!-- Tabs for each language -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="homeSubtitle-en-tab" data-bs-toggle="tab" data-bs-target="#homeSubtitle-en" type="button" role="tab">English</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="homeSubtitle-de-tab" data-bs-toggle="tab" data-bs-target="#homeSubtitle-de" type="button" role="tab">German</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="homeSubtitle-am-tab" data-bs-toggle="tab" data-bs-target="#homeSubtitle-am" type="button" role="tab">Amharic</button>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <!-- Tab content for each language -->
                        <div class="tab-pane" id="homeSubtitle-en" role="tabpanel">
                            <textarea id="homeSubtitle-en-input" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="tab-pane" id="homeSubtitle-de" role="tabpanel">
                            <textarea id="homeSubtitle-de-input" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="tab-pane" id="homeSubtitle-am" role="tabpanel">
                            <textarea id="homeSubtitle-am-input" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Text Section -->
            <div class="card mb-3" id="aboutTextCard">
                <div class="card-header">About Text</div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="aboutTextTabs" role="tablist">
                        <!-- Tabs for each language -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="aboutText-en-tab" data-bs-toggle="tab" data-bs-target="#aboutText-en" type="button" role="tab">English</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="aboutText-de-tab" data-bs-toggle="tab" data-bs-target="#aboutText-de" type="button" role="tab">German</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="aboutText-am-tab" data-bs-toggle="tab" data-bs-target="#aboutText-am" type="button" role="tab">Amharic</button>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <!-- Tab content for each language -->
                        <div class="tab-pane" id="aboutText-en" role="tabpanel">
                            <textarea id="aboutText-en-input" class="form-control" rows="4"></textarea>
                        </div>
                        <div class="tab-pane" id="aboutText-de" role="tabpanel">
                            <textarea id="aboutText-de-input" class="form-control" rows="4"></textarea>
                        </div>
                        <div class="tab-pane" id="aboutText-am" role="tabpanel">
                            <textarea id="aboutText-am-input" class="form-control" rows="4"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image Fields Section -->
            <div class="card mb-3" id="homepageImagesCard">
                <div class="card-header">Homepage Images</div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Home Background Image</label>
                        <div class="d-flex align-items-center">
                            <img id="homeBackgroundImagePreview" src="" alt="Home Background" class="me-3" style="width: 100px; height: 100px;">
                            <input type="file" id="homeBackgroundImageInput" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Header Image</label>
                        <div class="d-flex align-items-center">
                            <img id="headerImagePreview" src="" alt="Header" class="me-3" style="width: 100px; height: 100px;">
                            <input type="file" id="headerImageInput" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Footer Image</label>
                        <div class="d-flex align-items-center">
                            <img id="footerImagePreview" src="" alt="Footer" class="me-3" style="width: 100px; height: 100px;">
                            <input type="file" id="footerImageInput" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">About Section Image</label>
                        <div class="d-flex align-items-center">
                            <img id="aboutSectionImagePreview" src="" alt="About Section" class="me-3" style="width: 100px; height: 100px;">
                            <input type="file" id="aboutSectionImageInput" class="form-control">
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>

    <!-- add script to import admin_main.js -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/admin_main.js"></script>

    <script>
        let homeContentData = null;

        // Fetch home content from the JSON file
        async function fetchHomeContent() {
            try {
                const response = await fetch('home.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch home content: ${response.status}`);
                }
                homeContentData = await response.json();
                populateHomeContentForm(homeContentData);
            } catch (error) {
                console.error('Error fetching home content:', error);
            }
        }

        // Populate the form with home content
        function populateHomeContentForm(data) {
            document.getElementById('homeTitle-en-input').value = data.homeTitle.en || '';
            document.getElementById('homeTitle-de-input').value = data.homeTitle.de || '';
            document.getElementById('homeTitle-am-input').value = data.homeTitle.am || '';
            document.getElementById('homeSubtitle-en-input').value = data.homeSubtitle.en || '';
            document.getElementById('homeSubtitle-de-input').value = data.homeSubtitle.de || '';
            document.getElementById('homeSubtitle-am-input').value = data.homeSubtitle.am || '';
            document.getElementById('aboutText-en-input').value = data.aboutText.en || '';
            document.getElementById('aboutText-de-input').value = data.aboutText.de || '';
            document.getElementById('aboutText-am-input').value = data.aboutText.am || '';

            // Populate image previews
            document.getElementById('homeBackgroundImagePreview').src = data.homeBackgroundImage || '';
            document.getElementById('headerImagePreview').src = data.headerImage || '';
            document.getElementById('footerImagePreview').src = data.footerImage || '';
            document.getElementById('aboutSectionImagePreview').src = data.aboutSectionImage || '';
        }

        // Add event listeners to ensure tabs work correctly
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', function () {
                // Update active state for tabs
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');

                // Update active state for tab content
                const targetId = this.getAttribute('data-bs-target').substring(1);
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                document.getElementById(targetId).classList.add('show', 'active');
            });
        });

        // Add edit/save buttons to each card
        ['homeTitleCard', 'homeSubtitleCard', 'aboutTextCard', 'homepageImagesCard'].forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-outline-primary btn-sm position-absolute top-0 end-0 m-2';
                editButton.style.height = '30px'; // Reduce height of the button
                editButton.innerHTML = '<i class="bi bi-pencil"></i> Edit';
                editButton.addEventListener('click', () => toggleCardEditSaveMode(editButton, cardId));
                card.querySelector('.card-header').appendChild(editButton);

                // Ensure all fields are initially uneditable
                const inputs = card.querySelectorAll('input, textarea');
                inputs.forEach(input => input.disabled = true);
            } else {
                console.error(`Card with ID "${cardId}" not found.`);
            }
        });

        // Toggle between edit and save mode for a card
        function toggleCardEditSaveMode(button, cardId) {
            const card = document.getElementById(cardId);
            if (!card) return;

            const inputs = card.querySelectorAll('input, textarea');
            const fileInputs = card.querySelectorAll('input[type="file"]');
            const isEditing = button.classList.contains('editing');

            if (isEditing) {
                // Save mode
                button.innerHTML = '<i class="bi bi-pencil"></i> Edit'; // Change to edit icon
                button.classList.remove('editing');
                inputs.forEach(input => input.disabled = true);
                fileInputs.forEach(input => input.disabled = true);
            } else {
                // Edit mode
                button.innerHTML = '<i class="bi bi-save"></i> Save'; // Change to save icon
                button.classList.add('editing');
                inputs.forEach(input => input.disabled = false);
                fileInputs.forEach(input => input.disabled = false);
            }
        }

        // Handle image uploads
        function handleImageUpload(input, key) {
            const file = input.files[0];
            if (!file) return;
            const imgPreview = input.previousElementSibling;
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('image', file);
            formData.append('upload_path', 'assets/img/'); // Set the upload path
            fetch('upload_image.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        homeContentData[key] = result.path; // Update the JSON data with the uploaded image path
                        showInformationModal('Image uploaded successfully!');
                    } else {
                        showInformationModal('Image upload failed!');
                    }
                })
                .catch(() => showInformationModal('Image upload failed!'));
        }

        // Add event listeners for image inputs
        document.getElementById('homeBackgroundImageInput').addEventListener('change', function () {
            handleImageUpload(this, 'homeBackgroundImage');
        });
        document.getElementById('headerImageInput').addEventListener('change', function () {
            handleImageUpload(this, 'headerImage');
        });
        document.getElementById('footerImageInput').addEventListener('change', function () {
            handleImageUpload(this, 'footerImage');
        });
        document.getElementById('aboutSectionImageInput').addEventListener('change', function () {
            handleImageUpload(this, 'aboutSectionImage');
        });

        // Save home content
        document.getElementById('saveHomeContentBtn').addEventListener('click', function () {
            showConfirmationModal('Are you sure you want to update the homepage content? This will overwrite the current data on the server and cannot be undone.', async function () {
                homeContentData.homeTitle.en = document.getElementById('homeTitle-en-input').value;
                homeContentData.homeTitle.de = document.getElementById('homeTitle-de-input').value;
                homeContentData.homeTitle.am = document.getElementById('homeTitle-am-input').value;
                homeContentData.homeSubtitle.en = document.getElementById('homeSubtitle-en-input').value;
                homeContentData.homeSubtitle.de = document.getElementById('homeSubtitle-de-input').value;
                homeContentData.homeSubtitle.am = document.getElementById('homeSubtitle-am-input').value;
                homeContentData.aboutText.en = document.getElementById('aboutText-en-input').value;
                homeContentData.aboutText.de = document.getElementById('aboutText-de-input').value;
                homeContentData.aboutText.am = document.getElementById('aboutText-am-input').value;

                const jsonData = JSON.stringify(homeContentData, null, 4);
                const formData = new FormData();
                formData.append('jsonFile', new Blob([jsonData], { type: 'application/json' }), 'home.json');

                const response = await fetch('upload_json.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showInformationModal('Homepage content updated successfully!');
                } else {
                    showInformationModal('Failed to update homepage content.');
                }
            });
        });

        // Fetch and display home content on page load
        fetchHomeContent();
    </script>
</body>
</html>
