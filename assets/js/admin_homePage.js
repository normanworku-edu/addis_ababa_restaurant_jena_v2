let homeContentData = null;

let isHomePageChanged = false;
/**
 * Marks the HomePage as changed and enables the update button.
 */
function markHomePageAsChanged() {
    isHomePageChanged = true;
    document.getElementById('updateWebsiteHomePage').disabled = false;
}

/**
 * Resets the HomePage change status and disables the update button.
 */
function resetHomePageChangedStatus() {
    isHomePageChanged = false;
    document.getElementById('updateWebsiteHomePage').disabled = true;
}

// Fetch home content from the JSON file
async function fetchHomeContent() {
    try {
        const response = await fetch('assets/json/home.json'); // Updated path
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
    // Populate Home Title
    document.getElementById('homeTitle-en-input').value = data.homeTitle?.en || '';
    document.getElementById('homeTitle-de-input').value = data.homeTitle?.de || '';
    document.getElementById('homeTitle-am-input').value = data.homeTitle?.am || '';

    // Populate Home Subtitle
    document.getElementById('homeSubtitle-en-input').value = data.homeSubtitle?.en || '';
    document.getElementById('homeSubtitle-de-input').value = data.homeSubtitle?.de || '';
    document.getElementById('homeSubtitle-am-input').value = data.homeSubtitle?.am || '';

    // Populate About Text
    document.getElementById('aboutText-en-input').value = data.aboutText?.en || '';
    document.getElementById('aboutText-de-input').value = data.aboutText?.de || '';
    document.getElementById('aboutText-am-input').value = data.aboutText?.am || '';

    // Populate Image Previews
    document.getElementById('homeBackgroundImagePreview').src = data.homeBackgroundImage || '';
    document.getElementById('aboutSectionImagePreview').src = data.aboutSectionImage || '';
}



// Toggle between edit and save mode for a card
function toggleHomePageCardEditSaveMode(button, cardId) {
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

// Handle image uploads with dynamic preview
function handleHomePageImageUpload(input, key) {
    if (!input || !input.files || input.files.length === 0) {
        console.error('No file selected for upload.');
        return;
    }

    const file = input.files[0];
    const imgPreview = input.previousElementSibling;
    if (!imgPreview) {
        console.error('Image preview element not found.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        imgPreview.src = e.target.result; // Update the preview dynamically
        markHomePageAsChanged(); // Mark as changed when an image is uploaded
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



// Ensure the upload button is enabled and add event listener
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display home content on page load
    fetchHomeContent();

    // Ensure all cards remain visible
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = 'block'; // Ensure all cards are always displayed
    });

    // Add edit/save buttons to each card
    ['homeTitleCard', 'homeSubtitleCard', 'aboutTextCard', 'homepageImagesCard'].forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-outline-primary btn-sm position-absolute top-0 end-0 m-2';
            editButton.style.height = '30px'; // Reduce height of the button
            editButton.innerHTML = '<i class="bi bi-pencil"></i> Edit';
            editButton.addEventListener('click', () => toggleHomePageCardEditSaveMode(editButton, cardId));
            card.querySelector('.card-header').appendChild(editButton);

            // Ensure all fields are initially uneditable
            const inputs = card.querySelectorAll('input, textarea');
            inputs.forEach(input => input.disabled = true);
        } else {
            console.error(`Card with ID "${cardId}" not found.`);
        }
    });



    /**
     * ===== Home Page Management Event Listeners =====
     */

    // Add change listeners to inputs to track changes
    document.querySelectorAll('#homeContentForm input, #homeContentForm textarea').forEach(input => {
        input.addEventListener('input', markHomePageAsChanged);
    });

    // Add specific listeners for homepage title, subtitle, and about text inputs
    ['homeTitle-en-input', 'homeTitle-de-input', 'homeTitle-am-input',
        'homeSubtitle-en-input', 'homeSubtitle-de-input', 'homeSubtitle-am-input',
        'aboutText-en-input', 'aboutText-de-input', 'aboutText-am-input'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', markHomePageAsChanged);
            }
        });

    // Add event listeners for image inputs
    document.getElementById('homeBackgroundImageInput')?.addEventListener('change', function () {
        handleHomePageImageUpload(this, 'homeBackgroundImage');
    });
    document.getElementById('aboutSectionImageInput')?.addEventListener('change', function () {
        handleHomePageImageUpload(this, 'aboutSectionImage');
    });

    // Save home content
    document.getElementById('updateWebsiteHomePage').addEventListener('click', function () {
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
                resetHomePageChangedStatus(); // Reset change status after successful save
            } else {
                showInformationModal('Failed to update homepage content.');
            }
        });
    });


});

