/**
 * ===== Global Variables =====
 */

let galleryData = {};
let currentGalleryCategoryId = null;
let currentGalleryItemUniqueTag = null;
let isGalleryChanged = false;

/**
 * Marks the gallery as changed and enables the update button.
 */
function markGalleryAsChanged() {
    isGalleryChanged = true;
    document.getElementById('updateWebsiteGallery').disabled = false;
}


/**
 * Resets the gallery change status and disables the update button.
 */
function resetGalleryChangedStatus() {
    isGalleryChanged = false;
    document.getElementById('updateWebsiteGallery').disabled = true;
}


/**
 * ===== Modal Management =====
 */

/**
 * Generates the HTML for the gallery item modal.
 * @returns {string} Modal HTML.
 */
function generateGalleryItemModal() {
    return `
    <div class="modal fade" id="galleryItemModal" tabindex="-1" aria-labelledby="galleryItemModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="galleryItemModalLabel">Add New Gallery Image</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="galleryItemForm">
                        <input type="hidden" id="galleryImageId">
                        <input type="hidden" id="galleryImageUniqueRandomTag">
                        <div class="mb-3">
                            <label for="galleryCategorySelect" class="form-label">Category</label>
                            <select class="form-select" id="galleryCategorySelect" required>
                                <!-- Categories will be populated by JavaScript -->
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="galleryImageFileInput" class="form-label">Image</label>
                            <input type="file" class="form-control" id="galleryImageFileInput" accept="image/*" required>
                            <div id="galleryImagePreview" class="mt-2">
                                <img src="" class="img-fluid" style="max-width: 200px; display: none;">
                            </div>
                        </div>

                        <!-- Language tabs for titles -->
                        <ul class="nav nav-tabs" id="galleryLanguageTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#gallery-en" type="button">English</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#gallery-de" type="button">German</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#gallery-am" type="button">Amharic</button>
                            </li>
                        </ul>
                        <div class="tab-content mt-3">
                            <div class="tab-pane fade show active" id="gallery-en">
                                <div class="mb-3">
                                    <label for="galleryImageTitle_en" class="form-label">Title (English)</label>
                                    <input type="text" class="form-control" id="galleryImageTitle_en" required>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="gallery-de">
                                <div class="mb-3">
                                    <label for="galleryImageTitle_de" class="form-label">Title (German)</label>
                                    <input type="text" class="form-control" id="galleryImageTitle_de">
                                </div>
                            </div>
                            <div class="tab-pane fade" id="gallery-am">
                                <div class="mb-3">
                                    <label for="galleryImageTitle_am" class="form-label">Title (Amharic)</label>
                                    <input type="text" class="form-control" id="galleryImageTitle_am">
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="galleryImageHidden">
                                    <label class="form-check-label" for="galleryImageHidden">Hidden from gallery</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="galleryImageSelected">
                                    <label class="form-check-label" for="galleryImageSelected">Featured image</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveGalleryItem">Save</button>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Shows the modal for adding a new gallery item.
 */
function showAddGalleryItemModal() {
    const modal = document.getElementById('galleryItemModal');
    const modalTitle = document.getElementById('galleryItemModalLabel');
    const form = document.getElementById('galleryItemForm');

    // Reset form
    form.reset();
    currentGalleryItemUniqueTag = null;
    currentGalleryCategoryId = null;//galleryData.gallery.category[0].categoryId; // Default to the first category

    /*
    document.getElementById('galleryItemUniqueRandomTag').value = '';
    const preview = document.querySelector('#galleryImagePreview img');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
   */

    // Set title
    modalTitle.textContent = 'Add New Gallery Image';

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}


/**
 * Opens the modal for editing an existing gallery item.
 * @param {string} categoryId - The category ID of the gallery item.
 * @param {string} uniqueRandomTag - The unique tag of the gallery item.
 */
function editGalleryItem(categoryId, uniqueRandomTag) {
    const category = galleryData.gallery.category.find(c => c.categoryId === categoryId);
    const image = category?.image.find(i => i.uniqueRandomTag === uniqueRandomTag);
    
    currentGalleryItemUniqueTag = uniqueRandomTag;
    currentGalleryCategoryId = categoryId;

    if (!image) return;

    const modal = document.getElementById('galleryItemModal');
    document.getElementById('galleryCategorySelect').value = categoryId;

    document.getElementById('galleryImageTitle_en').value = image.title.en;
    document.getElementById('galleryImageTitle_de').value = image.title.de;
    document.getElementById('galleryImageTitle_am').value = image.title.am;

    document.getElementById('galleryImageHidden').checked = image.hidden;
    document.getElementById('galleryImageSelected').checked = image.selected;


        
    // display selectedCategory using show information modal
    showInformationModal(`current gallery Category: ${categoryId}`);    

    const preview = document.querySelector('#galleryImagePreview img');
    if (preview) {
        preview.src = `assets/img/gallery/${categoryId}/${image.imagefile}`;
        preview.style.display = 'block';
    }

    document.getElementById('galleryItemModalLabel').textContent = 'Edit Gallery Image';
    const galleryModal = new bootstrap.Modal(modal);
    galleryModal.show();
}

/**
 * Saves the gallery item to the global galleryData.
 */

function saveGalleryItem() {
    const form = document.getElementById('galleryItemForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const galleryImageId = document.getElementById('galleryImageId').value;
    const uniqueRandomTag = document.getElementById('galleryImageUniqueRandomTag').value;
    const isNew = !uniqueRandomTag;


    const fileInput = document.getElementById('galleryImageFileInput');
    const imagefile = fileInput.files[0].name; // Get the file name

    showInformationModal('isNew: ' + isNew + ', uniqueRandomTag: ' + uniqueRandomTag);

    // Get language values
    const title = {
        en: document.getElementById('galleryImageTitle_en').value,
        de: document.getElementById('galleryImageTitle_de').value,
        am: document.getElementById('galleryImageTitle_am').value
    };
    
    // Get checkboxes
    const hidden = document.getElementById('galleryImageHidden').checked;
    const selected = document.getElementById('galleryImageSelected').checked;
    
    const timestamp = getCurrentTimestamp();

    
    // Create galleryImage object
    const image = {
        id: isNew ? 'NA' : galleryImageId,
        uniqueRandomTag: isNew ? generateUniqueRandomTag(10) : uniqueRandomTag,
        title,
        imagefile,
        hidden,
        selected,
        lastUpdated: timestamp
    };

    // Get form values
    const galleryCategorySelect = document.getElementById('galleryCategorySelect');
    const categoryId = galleryCategorySelect ? galleryCategorySelect.value : galleryData.gallery.category[0]?.categoryId;

    // Find the category
    const category = galleryData.gallery?.category?.find(c => c.categoryId === categoryId);
    if (!category) {
        console.error(`Category with ID ${categoryId} not found.`);
        showInformationModal('Invalid category selected. Please try again.');
        return;
    }

    if (isNew) {
        // Add new dish
        category.image.push(image);
    } else {
        // Update existing dish
        const index = category.image.findIndex(d => d.uniqueRandomTag === uniqueRandomTag);
        if (index !== -1) {
            category.image[index] = image;
        }
    }
    
    galleryData.lastUpdated = timestamp;

    // mark as changed
    markGalleryAsChanged();

    // Update the gallery table
    populateGalleryTable();
    
    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById('galleryItemModal')).hide();
    
    // In a real app, you would save the data to the server here
    //saveMenuData();
}










/**
 * ===== Data Management =====
 */

/**
 * Loads gallery data from the server.
 */
async function loadGalleryData() {
    try {
        const response = await fetch('assets/json/gallery.json'); // Updated path
        if (!response.ok) throw new Error('Gallery data not found');
        galleryData = await response.json();

        // Update UI
        populateGalleryCategoryFilters();
        populateGalleryTable();
    } catch (error) {
        console.error('Error loading gallery:', error);
        showInformationModal('Failed to load gallery data. Please check the server.');
    }
}




/**
 * ===== UI Management =====
 */

/**
 * Populates the category filters for the gallery.
 */
function populateGalleryCategoryFilters() {
    const categoryFilter = document.getElementById('galleryCategoryFilter');
    const categorySelect = document.getElementById('galleryCategorySelect');

    // Clear existing options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categorySelect.innerHTML = '';

    galleryData.gallery.category.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryId;
        option.textContent = category.name.en;
        categoryFilter.appendChild(option);

        categoryFilter.appendChild(option.cloneNode(true));
        categorySelect.appendChild(option);
    });
}

/**
 * Populates the gallery table with data.
 */
function populateGalleryTable() {
    const tbody = document.querySelector('#galleryTable tbody');
    tbody.innerHTML = '';

    const selectedCategory = document.getElementById('galleryCategoryFilter').value;
    const searchTerm = document.getElementById('gallerySearchInput').value.toLowerCase();
    const showHidden = document.getElementById('showHiddenGalleryItems').checked;

    
    // display selectedCategory using show information modal
    //showInformationModal(`Selected gallery Category: ${selectedCategory}`);

    let itemCount = 1;

    galleryData.gallery.category.forEach(category => {
        if (!selectedCategory || category.categoryId === selectedCategory) {
            category.image.forEach(image => {
                if (showHidden || !image.hidden) {
                    const titleMatch = image.title.en.toLowerCase().includes(searchTerm);

                    if (!searchTerm || titleMatch) {
                        const tr = document.createElement('tr');
                        tr.dataset.categoryId = category.categoryId;
                        tr.dataset.uniqueRandomTag = image.uniqueRandomTag;

                        // Status badge
                        let statusBadge = '';
                        if (image.hidden) {
                            statusBadge = '<span class="badge bg-secondary">Hidden</span>';
                        } else if (image.selected) {
                            statusBadge = '<span class="badge bg-success">Featured</span>';
                        } else {
                            statusBadge = '<span class="badge bg-primary">Active</span>';
                        }

                        // Actions buttons - using same classes as other sections
                        const actions = `
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-primary edit-gallery-item" title="Edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger delete-gallery-item" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button type="button" class="btn btn-outline-secondary toggle-gallery-hidden" title="${image.hidden ? 'Show' : 'Hide'}">
                                    <i class="bi bi-eye${image.hidden ? '-slash' : ''}"></i>
                                </button>
                                <button type="button" class="btn btn-outline-success toggle-gallery-featured" title="${image.selected ? 'Remove featured' : 'Make featured'}">
                                    <i class="bi bi-star${image.selected ? '-fill' : ''}"></i>
                                </button>
                            </div>
                        `;

                        tr.innerHTML = `
                            <td>${itemCount++}</td>
                            <td><img src="assets/img/gallery/${category.categoryId}/${image.imagefile}" alt="${image.title.en}" style="height: 50px; object-fit: cover;"></td>
                            <td>
                                <div class="fw-bold">${image.title.en}</div>
                                <small class="text-muted">${category.name.en}</small>
                            </td>
                            <td>${statusBadge}</td>
                            <td>${actions}</td>
                        `;

                        tbody.appendChild(tr);
                    }
                }
            });
        }
    });

    // Setup action buttons after populating the table
    setupGalleryActionButtons();
}

/**
 * Sets up action buttons for the gallery table.
 */
function setupGalleryActionButtons() {
    // Edit button
    document.querySelectorAll('.edit-gallery-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            editGalleryItem(categoryId, uniqueRandomTag);
        });
    });

    // Delete button
    document.querySelectorAll('.delete-gallery-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;

            showConfirmationModal('Are you sure you want to delete this image?', () => {
                deleteGalleryItem(categoryId, uniqueRandomTag);
            });
        });
    });

    // Toggle hidden button
    document.querySelectorAll('.toggle-gallery-hidden').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            toggleGalleryItemHidden(categoryId, uniqueRandomTag);
            populateGalleryTable();
        });
    });

    // Toggle featured button
    document.querySelectorAll('.toggle-gallery-featured').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            toggleGalleryItemFeatured(categoryId, uniqueRandomTag);
            populateGalleryTable();
        });
    });
}





/**
 * Deletes a gallery item.
 * @param {string} categoryId - The category ID of the gallery item.
 * @param {string} uniqueRandomTag - The unique tag of the gallery item.
 */
function deleteGalleryItem(categoryId, uniqueRandomTag) {
    const category = galleryData.gallery.category.find(c => c.categoryId === categoryId);
    if (category) {
        category.image = category.image.filter(i => i.uniqueRandomTag !== uniqueRandomTag);
        galleryData.lastUpdated = getCurrentTimestamp();
        markGalleryAsChanged();
        populateGalleryTable();

        // Show feedback
        showInformationModal('Image deleted successfully!');
    }
}

/**
 * Toggles the hidden status of a gallery item.
 * @param {string} categoryId - The category ID of the gallery item.
 * @param {string} uniqueRandomTag - The unique tag of the gallery item.
 */
function toggleGalleryItemHidden(categoryId, uniqueRandomTag) {
    const category = galleryData.gallery.category.find(c => c.categoryId === categoryId);
    const image = category?.image.find(i => i.uniqueRandomTag === uniqueRandomTag);
    if (image) {
        image.hidden = !image.hidden;
        image.lastUpdated = getCurrentTimestamp();
        galleryData.lastUpdated = getCurrentTimestamp();
        markGalleryAsChanged();
        populateGalleryTable();
    }
}

/**
 * Toggles the featured status of a gallery item.
 * @param {string} categoryId - The category ID of the gallery item.
 * @param {string} uniqueRandomTag - The unique tag of the gallery item.
 */
function toggleGalleryItemFeatured(categoryId, uniqueRandomTag) {
    const category = galleryData.gallery.category.find(c => c.categoryId === categoryId);
    const image = category?.image.find(i => i.uniqueRandomTag === uniqueRandomTag);
    if (image) {
        image.selected = !image.selected;
        image.lastUpdated = getCurrentTimestamp();
        galleryData.lastUpdated = getCurrentTimestamp();
        markGalleryAsChanged();
        populateGalleryTable();
    }
}




/**
 * Updates the gallery data on the server.
 */
async function updateWebsiteGallery() {
    if (!galleryData || !galleryData.gallery || !galleryData.gallery.category) {
        showInformationModal('No gallery data available to update.');
        return;
    }

    try {
        const jsonStr = JSON.stringify(galleryData, null, 2);
        const formData = new FormData();
        const blob = new Blob([jsonStr], { type: 'application/json' });

        formData.append('jsonFile', blob, 'gallery.json');
        const response = await fetch('upload_json.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('updateWebsiteGallery').disabled = true;
            isGalleryChanged = false;
            showInformationModal('Gallery updated successfully!');
            resetGalleryChangedStatus();
        } else {
            throw new Error(data.message || 'Failed to update gallery');
        }
    } catch (error) {
        console.error('Error updating gallery:', error);
        showInformationModal('Failed to update the website gallery: ' + error.message);
    }
}

/**
 * Exports the gallery data as a JSON file.
 */
function exportGalleryJson() {
    if (!galleryData || !galleryData.gallery || !galleryData.gallery.category) {
        showInformationModal('No gallery data available to export.');
        return;
    }

    const jsonStr = JSON.stringify(galleryData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gallery.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showInformationModal('Gallery data exported successfully!');
}

/**
 * Imports gallery data from a JSON file.
 */
async function importGalleryJson() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (!file) {
        showInformationModal('Please select a JSON file to import.');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);

                if (!jsonData.gallery || !Array.isArray(jsonData.gallery.category)) {
                    throw new Error('Invalid gallery data structure');
                }

                galleryData = jsonData;
                populateGalleryCategoryFilters();
                populateGalleryTable();
                markGalleryAsChanged();

                bootstrap.Modal.getInstance(document.getElementById('importJsonModal')).hide();
                fileInput.value = '';
                showInformationModal('Gallery data imported successfully!');
            } catch (error) {
                showInformationModal('Error parsing gallery data: ' + error.message);
            }
        };
        reader.readAsText(file);
    } catch (error) {
        showInformationModal('Error importing gallery data: ' + error.message);
    }
}


/**
 * ===== Event Listeners =====
 */

/**
 * Uploads the selected gallery image to the server.
 */
function uploadGalleryImageToServer(event, categoryId) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Handle file upload first
        const formData = new FormData();
        formData.append('image', file);
        formData.append('upload_path', `assets/img/gallery/${categoryId}/`); // Adjust the path as needed

        fetch('upload_image.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update the preview
                const preview = document.querySelector('#galleryImagePreview img');
                if (preview) {
                    preview.src = `assets/img/gallery/${categoryId}/${data.filename}`;
                    preview.style.display = 'block';
                }
                
                showInformationModal('Image uploaded successfully!');
            } else {
                showInformationModal(`Failed to upload image: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            showInformationModal('An error occurred while uploading the image. Please try again.');
        });
    } else {
        console.log('No file selected');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    /**
     * ===== Gallery Management Event Listeners =====
     */

    document.getElementById('addNewGalleryItem').addEventListener('click', function () {
        showAddGalleryItemModal();
    });

    document.getElementById('saveGalleryItem').addEventListener('click', function () {
        saveGalleryItem();
    });

    /*
    document.getElementById('exportGalleryJson').addEventListener('click', function () {
        exportGalleryJson();
    });

    document.getElementById('importGalleryJson').addEventListener('click', function () {
        importJsonModal.show();
        document.getElementById('confirmImport').onclick = importGalleryJson;
    });
*/
    document.getElementById('updateWebsiteGallery').addEventListener('click', function () {
        showConfirmationModal('Are you sure you want to update the website gallery? This will overwrite the current reviews on the website.', function () {
            updateWebsiteGallery();
        });
    });

    document.getElementById('galleryCategoryFilter').addEventListener('change', function () {
        populateGalleryTable();
    });

    document.getElementById('gallerySearchInput').addEventListener('input', function () {
        populateGalleryTable();
    });

    document.getElementById('showHiddenGalleryItems').addEventListener('change', function () {
        populateGalleryTable();
    });

    // Attach event listener to file input for uploading gallery image
    document.getElementById('galleryImageFileInput').addEventListener('change', function (event) {
        uploadGalleryImageToServer(event, currentGalleryCategoryId);
    });

    // Load initial gallery data
    loadGalleryData();
});


