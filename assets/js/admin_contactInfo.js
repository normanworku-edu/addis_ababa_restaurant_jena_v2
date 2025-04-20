let contactInfoData = null;
// Store uploaded icon paths for new social media
let newSocialMediaIcons = {};

let isContactInfoChanged = false;
/**
 * Marks the ContactInfo as changed and enables the update button.
 */
function markContactInfoAsChanged() {
    isContactInfoChanged = true;
    document.getElementById('updateWebsiteContactInfo').disabled = false;
}

/**
 * Resets the ContactInfo change status and disables the update button.
 */
function resetContactInfoChangedStatus() {
    isContactInfoChanged = false;
    document.getElementById('updateWebsiteContactInfo').disabled = true;
}

// Fetch contact info from the JSON file
async function fetchContactInfo() {
    try {
        const response = await fetch('assets/json/contactInfo.json'); // Updated path
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
    document.getElementById('phone').value = data.contactNumbers.phone || '';
    document.getElementById('whatsapp').value = data.contactNumbers.whatsapp || '';
    document.getElementById('email').value = data.email || '';

    const socialMediaContainer = document.getElementById('socialMediaContainer');
    socialMediaContainer.innerHTML = '';
    for (const [platform, details] of Object.entries(data.socialMedia)) {
        const socialMediaCard = document.createElement('div');
        socialMediaCard.className = 'col-md-12 col-lg-6 mb-3';
        socialMediaCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body position-relative">
                    <div class="btn-group position-absolute top-0 end-0 m-2" role="group">
                        <button type="button" class="btn btn-outline-primary py-1 px-3 toggle-social-media-edit-save" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary py-1 px-3 toggle-social-media-hidden" title="${details.isHidden ? 'Show' : 'Hide'}">
                            <i class="bi bi-eye${details.isHidden ? '-slash' : ''}"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger py-1 px-3 delete-social-media" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Platform</label>
                        <input type="text" class="form-control social-media-platform" value="${platform}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Link</label>
                        <input type="url" class="form-control social-media-link" value="${details.link}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Icon</label>
                        <div class="d-flex align-items-center">
                            <img src="${details.icon}" alt="${platform} icon" class="me-3 icon-preview" style="width: 40px; height: 40px;">
                            <input type="file" class="form-control social-media-icon" disabled>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listener for edit/save toggle
        socialMediaCard.querySelector('.toggle-social-media-edit-save').addEventListener('click', function () {
            toggleSocialMediaEditSaveMode(this, platform);
        });

        // Add event listener for hide/view toggle
        socialMediaCard.querySelector('.toggle-social-media-hidden').addEventListener('click', function () {
            toggleSocialMediaVisibility(this, platform);
        });

        // Add event listener for delete action
        socialMediaCard.querySelector('.delete-social-media').addEventListener('click', function () {
            if (confirm(`Are you sure you want to delete ${platform}?`)) {
                delete contactInfoData.socialMedia[platform];
                populateContactInfoForm(contactInfoData);
                markContactInfoAsChanged();
            }
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

function toggleCardEditSaveMode(button, card, platform) {
    const isEditing = button.classList.contains('editing');
    const platformInput = card.querySelector('.social-media-platform');
    const linkInput = card.querySelector('.social-media-link');
    const iconInput = card.querySelector('.social-media-icon');
    const imgPreview = card.querySelector('.icon-preview');

    if (isEditing) {
        // Save mode
        button.innerHTML = '<i class="bi bi-pencil"></i>'; // Change to edit icon
        button.title = 'Edit';
        button.classList.remove('editing');
        platformInput.disabled = true;
        linkInput.disabled = true;
        iconInput.disabled = true;

        // Save changes to contactInfoData
        const newPlatform = platformInput.value.trim();
        const newLink = linkInput.value.trim();
        const newIcon = imgPreview.src;

        if (newPlatform && newLink) {
            if (newPlatform !== platform) {
                delete contactInfoData.socialMedia[platform];
            }
            contactInfoData.socialMedia[newPlatform] = {
                link: newLink,
                icon: newIcon,
                isHidden: contactInfoData.socialMedia[platform]?.isHidden || false
            };
            markContactInfoAsChanged();
        } else {
            alert('Platform and Link fields cannot be empty.');
        }
    } else {
        // Edit mode
        button.innerHTML = '<i class="bi bi-save"></i>'; // Change to save icon
        button.title = 'Save';
        button.classList.add('editing');
        platformInput.disabled = false;
        linkInput.disabled = false;
        iconInput.disabled = false;
    }
}

function toggleSocialMediaVisibility(button, platform) {
    const isHidden = button.querySelector('i').classList.contains('bi-eye-slash');
    button.querySelector('i').classList.toggle('bi-eye', isHidden);
    button.querySelector('i').classList.toggle('bi-eye-slash', !isHidden);
    button.title = isHidden ? 'Hide' : 'Show';
    contactInfoData.socialMedia[platform].isHidden = !isHidden;
    markContactInfoAsChanged();
}


function toggleSocialMediaEditSaveMode(button, platform) {
    const card = button.closest('.card');
    const platformInput = card.querySelector('.social-media-platform');
    const linkInput = card.querySelector('.social-media-link');
    const iconInput = card.querySelector('.social-media-icon');
    const imgPreview = card.querySelector('.icon-preview');
    const isEditing = button.classList.contains('editing');
    if (isEditing) {
        // Save mode
        button.innerHTML = '<i class="bi bi-pencil"></i>'; // Change to edit icon
        button.title = 'Edit';
        button.classList.remove('editing');
        platformInput.disabled = true;
        linkInput.disabled = true;
        iconInput.disabled = true;
        // Save changes to contactInfoData
        const newPlatform = platformInput.value.trim();
        const newLink = linkInput.value.trim();
        const newIcon = imgPreview.src;
        if (newPlatform && newLink) {
            if (newPlatform !== platform) {
                delete contactInfoData.socialMedia[platform];
            }
            contactInfoData.socialMedia[newPlatform] = {
                link: newLink,
                icon: newIcon,
                isHidden: false,
            };
            markContactInfoAsChanged();
        } else {
            alert('Platform and Link fields cannot be empty.');
        }

    } else {
        // Edit mode
        button.innerHTML = '<i class="bi bi-save"></i>'; // Change to save icon
        button.title = 'Save';
        button.classList.add('editing');
        platformInput.disabled = false;
        linkInput.disabled = false;
        iconInput.disabled = false;
    }
}


// Function to handle the icon upload
function handleIconUpload(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgPreview = input.closest('.d-flex').querySelector('.icon-preview');
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block'; // Show the preview
        };
        reader.readAsDataURL(file);
    }
}



// Add new social media input fields
function AddNewSocialMedia() {
    // Create and display the modal
    const modalHtml = `
        <div class="modal fade" id="addSocialMediaModal" tabindex="-1" aria-labelledby="addSocialMediaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addSocialMediaModalLabel">Add New Social Media</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Platform <span class="text-danger">*</span></label>
                            <input type="text" id="newSocialMediaPlatform" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Link <span class="text-danger">*</span></label>
                            <input type="url" id="newSocialMediaLink" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Icon</label>
                            <div class="d-flex align-items-center">
                                <img id="newSocialMediaIconPreview" src="" alt="icon preview" class="me-3 icon-preview" style="width: 40px; height: 40px; display:none;">
                                <input type="file" id="newSocialMediaIcon" class="form-control">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveNewSocialMediaBtn">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Initialize Bootstrap modal
    const addSocialMediaModal = new bootstrap.Modal(document.getElementById('addSocialMediaModal'));
    addSocialMediaModal.show();

    // Handle icon preview
    document.getElementById('newSocialMediaIcon').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('newSocialMediaIconPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    // Handle save button click
    document.getElementById('saveNewSocialMediaBtn').addEventListener('click', function () {
        const platform = document.getElementById('newSocialMediaPlatform').value.trim();
        const link = document.getElementById('newSocialMediaLink').value.trim();
        const iconInput = document.getElementById('newSocialMediaIcon');
        const iconPreview = document.getElementById('newSocialMediaIconPreview').src;

        if (!platform || !link || !iconPreview) {
            alert('Please fill in all fields and upload an icon.');
            return;
        }

        // Add new social media card to the container
        const socialMediaContainer = document.getElementById('socialMediaContainer');
        const newSocialMediaCard = document.createElement('div');
        newSocialMediaCard.className = 'col-md-12 col-lg-6 mb-3';
        newSocialMediaCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body position-relative">
                    <div class="btn-group position-absolute top-0 end-0 m-2" role="group">
                        <button type="button" class="btn btn-outline-primary py-1 px-3 toggle-edit-save" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary py-1 px-3 toggle-social-media-hidden" title="Hide">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger py-1 px-3 delete-social-media" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Platform</label>
                        <input type="text" class="form-control social-media-platform" value="${platform}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Link</label>
                        <input type="url" class="form-control social-media-link" value="${link}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Icon</label>
                        <div class="d-flex align-items-center">
                            <img src="${iconPreview}" alt="${platform} icon" class="me-3 icon-preview" style="width: 40px; height: 40px;">
                            <input type="file" class="form-control social-media-icon" disabled>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for the new card
        newSocialMediaCard.querySelector('.toggle-edit-save').addEventListener('click', function () {
            toggleCardEditSaveMode(this, newSocialMediaCard, platform);
        });
        newSocialMediaCard.querySelector('.toggle-social-media-hidden').addEventListener('click', function () {
            toggleSocialMediaVisibility(this, platform);
        });
        newSocialMediaCard.querySelector('.delete-social-media').addEventListener('click', function () {
            if (confirm(`Are you sure you want to delete ${platform}?`)) {
                newSocialMediaCard.remove();
                delete contactInfoData.socialMedia[platform];
                markContactInfoAsChanged();
            }
        });

        socialMediaContainer.appendChild(newSocialMediaCard);

        // Update contactInfoData
        contactInfoData.socialMedia[platform] = {
            link,
            icon: iconPreview,
            isHidden: false
        };

        markContactInfoAsChanged();

        // Hide and remove the modal
        addSocialMediaModal.hide();
        document.getElementById('addSocialMediaModal').remove();
    });
}

// Handle icon upload and preview
function handleIconUpload(input, key, isNew) {
    const file = input.files[0];
    if (!file) return;
    const imgPreview = input.closest('.d-flex').querySelector('.icon-preview');
    // Show local preview
    const reader = new FileReader();
    reader.onload = function (e) {
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

/**
 * Toggles edit/save mode for a card.
 * @param {HTMLElement} button - The edit/save button.
 * @param {string} cardId - The ID of the card to toggle.
 */
function toggleCardEditSaveMode(button, cardId) {
    const card = document.getElementById(cardId);
    if (!card) {
        console.error(`Card with ID "${cardId}" not found.`);
        return;
    }

    const inputs = card.querySelectorAll('input, textarea');
    const actionButtons = card.querySelectorAll('.toggle-social-media-hidden, .delete-social-media');
    if (!inputs.length) {
        console.error(`No input or textarea elements found in card with ID "${cardId}".`);
        return;
    }

    const isEditing = button.classList.contains('editing');
    const addSocialMediaBtn = document.getElementById('addSocialMediaBtn');

    if (isEditing) {
        // Save mode
        button.innerHTML = '<i class="bi bi-pencil"></i> Edit'; // Change to edit icon with text
        button.classList.remove('editing');
        inputs.forEach(input => input.disabled = true);
        actionButtons.forEach(button => button.disabled = true); // Disable action buttons

        // Disable "Add New Social Media" button
        if (cardId === 'socialMediaCard') {
            addSocialMediaBtn.disabled = true;
        }

        // Save data to contactInfoData
        if (cardId === 'addressCard') {
            contactInfoData.address.street = document.getElementById('street').value;
            contactInfoData.address.city = document.getElementById('city').value;
            contactInfoData.address.postalCode = document.getElementById('postalCode').value;
            contactInfoData.address.country = document.getElementById('country').value;
        } else if (cardId === 'contactNumbersCard') {
            contactInfoData.contactNumbers.phone = document.getElementById('phone').value;
            contactInfoData.contactNumbers.whatsapp = document.getElementById('whatsapp').value;
        } else if (cardId === 'emailCard') {
            contactInfoData.email = document.getElementById('email').value;
        }

        markContactInfoAsChanged();
    } else {
        // Edit mode
        button.innerHTML = '<i class="bi bi-save"></i> Save'; // Change to save icon with text
        button.classList.add('editing');
        inputs.forEach(input => input.disabled = false);
        actionButtons.forEach(button => button.disabled = false); // Enable action buttons

        // Enable "Add New Social Media" button
        if (cardId === 'socialMediaCard') {
            addSocialMediaBtn.disabled = false;
        }
    }
}

// Add edit/save buttons to each card
['addressCard', 'contactNumbersCard', 'emailCard'].forEach(cardId => {
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

// add new social media button on the social media card
['socialMediaCard'].forEach(cardId => {
    const card = document.getElementById(cardId);
    if (card) {
        const addNewButton = document.createElement('button');
        addNewButton.setAttribute('id', 'addSocialMediaBtn');
        addNewButton.className = 'btn btn-outline-primary btn-sm position-absolute top-0 end-0 m-2';
        addNewButton.style.height = '30px'; // Reduce height of the button
        addNewButton.innerHTML = '<i class="bi bi-plus"></i> Add New';
        addNewButton.addEventListener('click', () => AddNewSocialMedia());
        card.querySelector('.card-header').appendChild(addNewButton);

        // Ensure all fields are initially uneditable
        const inputs = card.querySelectorAll('input, textarea');
        inputs.forEach(input => input.disabled = true);
    } else {
        console.error(`Card with ID "${cardId}" not found.`);
    }
});

// Disable "Add New Social Media" button on initial load
//document.getElementById('addSocialMediaBtn').disabled = true;

// Save contact info
document.getElementById('updateWebsiteContactInfo').addEventListener('click', async function () {
    showConfirmationModal('Are you sure you want to update the website contact info? This will overwrite the current data on the website.', async function () {
        // Update address and contact information
        contactInfoData.address.street = document.getElementById('street').value;
        contactInfoData.address.city = document.getElementById('city').value;
        contactInfoData.address.postalCode = document.getElementById('postalCode').value;
        contactInfoData.address.country = document.getElementById('country').value;
        contactInfoData.contactNumbers.phone = document.getElementById('phone').value;
        contactInfoData.contactNumbers.whatsapp = document.getElementById('whatsapp').value;
        contactInfoData.email = document.getElementById('email').value;

        // Update social media data
        document.querySelectorAll('#socialMediaContainer .card').forEach(card => {
            const platformInput = card.querySelector('.social-media-platform').value.trim();
            const linkInput = card.querySelector('.social-media-link').value.trim();
            const iconPreview = card.querySelector('.icon-preview').src;
            const isHidden = card.querySelector('.toggle-social-media-hidden i').classList.contains('bi-eye-slash');

            if (platformInput && linkInput) {
                contactInfoData.socialMedia[platformInput] = {
                    link: linkInput,
                    icon: iconPreview,
                    isHidden: isHidden
                };
            }
        });

        // Update lastUpdated field
        contactInfoData.lastUpdated = getCurrentTimestamp();

        // Convert contactInfoData to pretty JSON
        const jsonData = JSON.stringify(contactInfoData, null, 4);
        const formData = new FormData();
        formData.append('jsonFile', new Blob([jsonData], { type: 'application/json' }), 'contactInfo.json');
        formData.append('upload_path', 'assets/json/'); // Updated path

        // Upload contactInfo.json to the server
        const response = await fetch('upload_json.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showInformationModal('Contact info updated successfully!');
            resetContactInfoChangedStatus();
        } else {
            showInformationModal('Failed to update contact info.');
        }
    });
});

// Fetch and display contact info on page load
fetchContactInfo();
