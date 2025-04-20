<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Contact Info</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"> <!-- Add this line -->
</head>
<body>
    <div class="container mt-3">
        <h1 class="text-center">Manage Contact Info</h1>
        <div id="contactInfoForm">

        
            <!-- Address Section -->
            <div class="card mb-3">
                <div class="card-header">Address</div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="street" class="form-label">Street</label>
                        <input type="text" id="street" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="city" class="form-label">City</label>
                        <input type="text" id="city" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="postalCode" class="form-label">Postal Code</label>
                        <input type="text" id="postalCode" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="country" class="form-label">Country</label>
                        <input type="text" id="country" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="googleMapLink" class="form-label">Google Map Link</label>
                        <input type="url" id="googleMapLink" class="form-control">
                    </div>
                </div>
            </div>

            <!-- Social Media Section -->
            <div class="card mb-3">
                <div class="card-header">Social Media</div>
                <div class="card-body" id="socialMediaContainer">
                    <!-- Existing social media links will be dynamically populated -->
                </div>
                <button class="btn btn-primary" id="addSocialMediaBtn">Add New Social Media</button>
            </div>

            <!-- Contact Numbers Section -->
            <div class="card mb-3">
                <div class="card-header">Contact Numbers</div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="text" id="phone" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="whatsapp" class="form-label">WhatsApp</label>
                        <input type="text" id="whatsapp" class="form-control">
                    </div>
                </div>
            </div>

            <!-- Email Section -->
            <div class="card mb-3">
                <div class="card-header">Email</div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" class="form-control">
                    </div>
                </div>
            </div>

            <button class="btn btn-success" id="saveContactInfoBtn">Save Contact Info</button>




        </div>
    </div>

    <script>
        let contactInfoData = null;
        // Store uploaded icon paths for new social media
        let newSocialMediaIcons = {};

        // Fetch contact info from the JSON file
        async function fetchContactInfo() {
            try {
                const response = await fetch('contactInfo.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch contact info: ${response.status}`);
                }
                contactInfoData = await response.json();
                populateContactInfoForm(contactInfoData);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        }

        // Populate the form with contact info
        function populateContactInfoForm(data) {
            document.getElementById('street').value = data.address.street || '';
            document.getElementById('city').value = data.address.city || '';
            document.getElementById('postalCode').value = data.address.postalCode || '';
            document.getElementById('country').value = data.address.country || '';
            document.getElementById('googleMapLink').value = data.address.googleMapLink || '';
            document.getElementById('phone').value = data.contactNumbers.phone || '';
            document.getElementById('whatsapp').value = data.contactNumbers.whatsapp || '';
            document.getElementById('email').value = data.email || '';

            const socialMediaContainer = document.getElementById('socialMediaContainer');
            socialMediaContainer.innerHTML = '';
            for (const [platform, details] of Object.entries(data.socialMedia)) {
                const socialMediaCard = document.createElement('div');
                socialMediaCard.className = 'card mb-3';
                socialMediaCard.innerHTML = `
                    <div class="card-body position-relative">
                        <div class="btn-group position-absolute top-0 end-0 m-2" role="group">
                            <button type="button" class="btn btn-outline-secondary py-1 px-3 toggle-social-media-hidden" data-platform="${platform}" title="${details.isHidden ? 'Show' : 'Hide'}">
                                <i class="bi bi-eye${details.isHidden ? '-slash' : ''}"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger py-1 px-3 delete-social-media" data-platform="${platform}" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">${platform.charAt(0).toUpperCase() + platform.slice(1)} Link</label>
                            <input type="url" class="form-control social-media-link" data-platform="${platform}" value="${details.link}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Icon</label>
                            <div class="d-flex align-items-center">
                                <img src="${details.icon}" alt="${platform} icon" class="me-3 icon-preview" style="width: 40px; height: 40px;">
                                <input type="file" class="form-control social-media-icon" data-platform="${platform}">
                            </div>
                        </div>
                    </div>
                `;

                // Add event listeners for delete and hide/show actions
                socialMediaCard.querySelector('.toggle-social-media-hidden').addEventListener('click', function (e) {
                    toggleSocialMediaVisibility(e.target.closest('button'), platform);
                });
                socialMediaCard.querySelector('.delete-social-media').addEventListener('click', function () {
                    deleteSocialMedia(platform);
                });

                // Add event listener for icon upload and preview
                socialMediaCard.querySelector('.social-media-icon').addEventListener('change', function (e) {
                    handleIconUpload(e.target, platform, false);
                });

                socialMediaContainer.appendChild(socialMediaCard);
            }
        }

        function deleteSocialMedia(platform) {
            if (confirm(`Are you sure you want to delete ${platform}?`)) {
                delete contactInfoData.socialMedia[platform];
                populateContactInfoForm(contactInfoData);
            }
        }

        function toggleSocialMediaVisibility(button, platform) {
            const isHidden = button.querySelector('i').classList.contains('bi-eye-slash');
            button.querySelector('i').classList.toggle('bi-eye', isHidden);
            button.querySelector('i').classList.toggle('bi-eye-slash', !isHidden);
            button.title = isHidden ? 'Hide' : 'Show';
            contactInfoData.socialMedia[platform].isHidden = !isHidden;
        }

        // Add new social media input fields
        document.getElementById('addSocialMediaBtn').addEventListener('click', function () {
            const socialMediaContainer = document.getElementById('socialMediaContainer');
            const newSocialMediaCard = document.createElement('div');
            newSocialMediaCard.className = 'card mb-3';
            newSocialMediaCard.innerHTML = `
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Platform</label>
                        <input type="text" class="form-control new-social-media-platform">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Link</label>
                        <input type="url" class="form-control new-social-media-link">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Icon</label>
                        <div class="d-flex align-items-center">
                            <img src="" alt="icon preview" class="me-3 icon-preview" style="width: 40px; height: 40px; display:none;">
                            <input type="file" class="form-control new-social-media-icon">
                        </div>
                    </div>
                </div>
            `;
            // Add event listener for icon upload and preview
            newSocialMediaCard.querySelector('.new-social-media-icon').addEventListener('change', function(e) {
                const index = Array.from(document.querySelectorAll('.new-social-media-icon')).indexOf(e.target);
                handleIconUpload(e.target, index, true);
            });
            socialMediaContainer.appendChild(newSocialMediaCard);
        });

        // Handle icon upload and preview
        function handleIconUpload(input, key, isNew) {
            const file = input.files[0];
            if (!file) return;
            const imgPreview = input.closest('.d-flex').querySelector('.icon-preview');
            // Show local preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block'; // Ensure the preview is visible
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('image', file);
            formData.append('upload_path', 'assets/img/icons/'); // Set the upload path
            fetch('upload_image.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const uploadedPath = result.path; // Correctly use the uploaded file path
                        if (isNew) {
                            newSocialMediaIcons[key] = uploadedPath;
                        } else {
                            if (contactInfoData && contactInfoData.socialMedia[key]) {
                                contactInfoData.socialMedia[key].icon = uploadedPath;
                            }
                        }
                        // Update preview to use server path
                        imgPreview.src = uploadedPath;
                        imgPreview.style.display = 'block'; // Ensure the preview is visible
                    } else {
                        alert('Icon upload failed!');
                    }
                })
                .catch(() => alert('Icon upload failed!'));
        }

        // Save contact info
        document.getElementById('saveContactInfoBtn').addEventListener('click', async function () {
            contactInfoData.address.street = document.getElementById('street').value;
            contactInfoData.address.city = document.getElementById('city').value;
            contactInfoData.address.postalCode = document.getElementById('postalCode').value;
            contactInfoData.address.country = document.getElementById('country').value;
            contactInfoData.address.googleMapLink = document.getElementById('googleMapLink').value;
            contactInfoData.contactNumbers.phone = document.getElementById('phone').value;
            contactInfoData.contactNumbers.whatsapp = document.getElementById('whatsapp').value;
            contactInfoData.email = document.getElementById('email').value;

            // Update existing social media links and hidden status
            document.querySelectorAll('.social-media-link').forEach(input => {
                const platform = input.getAttribute('data-platform');
                contactInfoData.socialMedia[platform].link = input.value;
            });

            // Add new social media links
            document.querySelectorAll('.new-social-media-platform').forEach((input, index) => {
                const platform = input.value.trim();
                if (platform) {
                    const link = document.querySelectorAll('.new-social-media-link')[index].value.trim();
                    const iconPath = newSocialMediaIcons[index] || '';
                    if (link && iconPath) {
                        contactInfoData.socialMedia[platform] = {
                            link,
                            icon: iconPath
                        };
                    }
                }
            });

            // Convert contactInfoData to pretty JSON
            const jsonData = JSON.stringify(contactInfoData, null, 4);
            const formData = new FormData();
            formData.append('jsonFile', new Blob([jsonData], { type: 'application/json' }), 'contactInfo.json');

            // Upload contactInfo.json to the server
            const response = await fetch('upload_json.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Contact info updated successfully!');
            } else {
                alert('Failed to update contact info.');
            }
        });

        // Fetch and display contact info on page load
        fetchContactInfo();
    </script>
</body>
</html>
