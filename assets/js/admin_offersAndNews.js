/**
 * ===== Global Variables =====
 */

let offersAndNewsData = {};
let currentOffersAndNewsCategoryId = null;
let currentOffersAndNewsItemUniqueTag = null;
let isOffersAndNewsChanged = false;

/**
 * Marks the offersAndNews as changed and enables the update button.
 */
function markOffersAndNewsAsChanged() {
    isOffersAndNewsChanged = true;
    document.getElementById('updateWebsiteOffersAndNews').disabled = false;
}


/**
 * Resets the offersAndNews change status and disables the update button.
 */
function resetOffersAndNewsChangedStatus() {
    isOffersAndNewsChanged = false;
    document.getElementById('updateWebsiteOffersAndNews').disabled = true;
}


/**
 * ===== Modal Management =====
 */

/**
 * Generates the HTML for the offersAndNews item modal.
 * @returns {string} Modal HTML.
 */
function generateOffersAndNewsItemModal() {
    return `
    <div class="modal fade" id="offersAndNewsItemModal" tabindex="-1" aria-labelledby="offersAndNewsItemModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="offersAndNewsItemModalLabel">Add New OffersAndNews Image</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="offersAndNewsItemForm">
                        <input type="hidden" id="offersAndNewsImageId">
                        <input type="hidden" id="offersAndNewsImageUniqueRandomTag">
                        <div class="mb-3">
                            <label for="offersAndNewsCategorySelect" class="form-label">Category</label>
                            <select class="form-select" id="offersAndNewsCategorySelect" required>
                                <!-- Categories will be populated by JavaScript -->
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="offersAndNewsImageFileInput" class="form-label">Image</label>
                            <input type="file" class="form-control" id="offersAndNewsImageFileInput" accept="image/*" required>
                            <div id="offersAndNewsImagePreview" class="mt-2">
                                <img src="" class="img-fluid" style="max-width: 200px; display: none;">
                            </div>
                        </div>

                        <!-- Language tabs for titles -->
                        <ul class="nav nav-tabs" id="offersAndNewsLanguageTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#offersAndNews-en" type="button">English</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#offersAndNews-de" type="button">German</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#offersAndNews-am" type="button">Amharic</button>
                            </li>
                        </ul>
                        <div class="tab-content mt-3">
                            <div class="tab-pane fade show active" id="offersAndNews-en">
                                <div class="mb-3">
                                    <label for="offersAndNewsImageTitle_en" class="form-label">Title (English)</label>
                                    <input type="text" class="form-control" id="offersAndNewsImageTitle_en" required>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="offersAndNews-de">
                                <div class="mb-3">
                                    <label for="offersAndNewsImageTitle_de" class="form-label">Title (German)</label>
                                    <input type="text" class="form-control" id="offersAndNewsImageTitle_de">
                                </div>
                            </div>
                            <div class="tab-pane fade" id="offersAndNews-am">
                                <div class="mb-3">
                                    <label for="offersAndNewsImageTitle_am" class="form-label">Title (Amharic)</label>
                                    <input type="text" class="form-control" id="offersAndNewsImageTitle_am">
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="offersAndNewsImageHidden">
                                    <label class="form-check-label" for="offersAndNewsImageHidden">Hidden from offersAndNews</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="offersAndNewsImageSelected">
                                    <label class="form-check-label" for="offersAndNewsImageSelected">Featured image</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveOffersAndNewsItem">Save</button>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Shows the modal for adding a new offersAndNews item.
 */
function showAddOffersAndNewsItemModal() {
    const modal = document.getElementById('offersAndNewsItemModal');
    const modalTitle = document.getElementById('offersAndNewsItemModalLabel');
    const form = document.getElementById('offersAndNewsItemForm');

    // Reset form
    form.reset();
    currentOffersAndNewsItemUniqueTag = null;
    currentOffersAndNewsCategoryId = null;//offersAndNewsData.offersAndNews.category[0].categoryId; // Default to the first category

    /*
    document.getElementById('offersAndNewsItemUniqueRandomTag').value = '';
    const preview = document.querySelector('#offersAndNewsImagePreview img');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
   */

    // Set title
    modalTitle.textContent = 'Add New OffersAndNews Image';

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}


/**
 * Opens the modal for editing an existing offersAndNews item.
 * @param {string} categoryId - The category ID of the offersAndNews item.
 * @param {string} uniqueRandomTag - The unique tag of the offersAndNews item.
 */
function editOffersAndNewsItem(categoryId, uniqueRandomTag) {
    const category = offersAndNewsData.offersAndNews.category.find(c => c.categoryId === categoryId);
    const item = category?.item.find(i => i.uniqueRandomTag === uniqueRandomTag);
    
    currentOffersAndNewsItemUniqueTag = uniqueRandomTag;
    currentOffersAndNewsCategoryId = categoryId;

    if (!item) return;

    const modal = document.getElementById('offersAndNewsItemModal');
    document.getElementById('offersAndNewsCategorySelect').value = categoryId;

    document.getElementById('offersAndNewsImageTitle_en').value = item.title.en;
    document.getElementById('offersAndNewsImageTitle_de').value = item.title.de;
    document.getElementById('offersAndNewsImageTitle_am').value = item.title.am;

    document.getElementById('offersAndNewsImageHidden').checked = item.hidden;
    document.getElementById('offersAndNewsImageSelected').checked = item.selected;


        
    // display selectedCategory using show information modal
    showInformationModal(`current offersAndNews Category: ${categoryId}`);    

    const preview = document.querySelector('#offersAndNewsImagePreview img');
    if (preview) {
        preview.src = `assets/img/offersAndNews/${categoryId}/${item.imagefile}`;
        preview.style.display = 'block';
    }

    document.getElementById('offersAndNewsItemModalLabel').textContent = 'Edit OffersAndNews Image';
    const offersAndNewsModal = new bootstrap.Modal(modal);
    offersAndNewsModal.show();
}

/**
 * Saves the offersAndNews item to the global offersAndNewsData.
 */

function saveOffersAndNewsItem() {
    const form = document.getElementById('offersAndNewsItemForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const offersAndNewsImageId = document.getElementById('offersAndNewsImageId').value;
    const uniqueRandomTag = document.getElementById('offersAndNewsImageUniqueRandomTag').value;
    const isNew = !uniqueRandomTag;


    const fileInput = document.getElementById('offersAndNewsImageFileInput');
    const imagefile = fileInput.files[0].name; // Get the file name

    showInformationModal('isNew: ' + isNew + ', uniqueRandomTag: ' + uniqueRandomTag);

    // Get language values
    const title = {
        en: document.getElementById('offersAndNewsImageTitle_en').value,
        de: document.getElementById('offersAndNewsImageTitle_de').value,
        am: document.getElementById('offersAndNewsImageTitle_am').value
    };
    
    // Get checkboxes
    const hidden = document.getElementById('offersAndNewsImageHidden').checked;
    const selected = document.getElementById('offersAndNewsImageSelected').checked;
    
    const timestamp = getCurrentTimestamp();

    
    // Create offersAndNewsImage object
    const item = {
        id: isNew ? 'NA' : offersAndNewsImageId,
        uniqueRandomTag: isNew ? generateUniqueRandomTag(10) : uniqueRandomTag,
        title,
        imagefile,
        hidden,
        selected,
        lastUpdated: timestamp
    };

    // Get form values
    const offersAndNewsCategorySelect = document.getElementById('offersAndNewsCategorySelect');
    const categoryId = offersAndNewsCategorySelect ? offersAndNewsCategorySelect.value : offersAndNewsData.offersAndNews.category[0]?.categoryId;

    // Find the category
    const category = offersAndNewsData.offersAndNews?.category?.find(c => c.categoryId === categoryId);
    if (!category) {
        console.error(`Category with ID ${categoryId} not found.`);
        showInformationModal('Invalid category selected. Please try again.');
        return;
    }

    if (isNew) {
        // Add new dish
        category.item.push(item);
    } else {
        // Update existing dish
        const index = category.item.findIndex(d => d.uniqueRandomTag === uniqueRandomTag);
        if (index !== -1) {
            category.item[index] = item;
        }
    }
    
    offersAndNewsData.lastUpdated = timestamp;

    // mark as changed
    markOffersAndNewsAsChanged();

    // Update the offersAndNews table
    populateOffersAndNewsTable();
    
    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById('offersAndNewsItemModal')).hide();
    
    // In a real app, you would save the data to the server here
    //saveMenuData();
}










/**
 * ===== Data Management =====
 */

/**
 * Loads offersAndNews data from the server.
 */
async function loadOffersAndNewsData() {
    try {
        const response = await fetch('assets/json/offersAndNews.json'); // Updated path
        if (!response.ok) throw new Error('OffersAndNews data not found');
        offersAndNewsData = await response.json();

        // Update UI
        populateOffersAndNewsCategoryFilters();
        populateOffersAndNewsTable();
    } catch (error) {
        console.error('Error loading offersAndNews:', error);
        showInformationModal('Failed to load offersAndNews data. Please check the server.');
    }
}




/**
 * ===== UI Management =====
 */

/**
 * Populates the category filters for the offersAndNews.
 */
function populateOffersAndNewsCategoryFilters() {
    const categoryFilter = document.getElementById('offersAndNewsCategoryFilter');
    const categorySelect = document.getElementById('offersAndNewsCategorySelect');

    // Clear existing options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categorySelect.innerHTML = '';

    offersAndNewsData.offersAndNews.category.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryId;
        option.textContent = category.name.en;
        categoryFilter.appendChild(option);

        categoryFilter.appendChild(option.cloneNode(true));
        categorySelect.appendChild(option);
    });
}

/**
 * Populates the offersAndNews table with data.
 */
function populateOffersAndNewsTable() {
    const tbody = document.querySelector('#offersAndNewsTable tbody');
    tbody.innerHTML = '';

    const selectedCategory = document.getElementById('offersAndNewsCategoryFilter').value;
    const searchTerm = document.getElementById('offersAndNewsSearchInput').value.toLowerCase();
    const showHidden = document.getElementById('showHiddenOffersAndNewsItems').checked;

    
    // display selectedCategory using show information modal
   // showInformationModal(`Selected offersAndNews Category: ${selectedCategory}`);

    let itemCount = 1;

    offersAndNewsData.offersAndNews.category.forEach(category => {
        if (!selectedCategory || category.categoryId === selectedCategory) {
            category.item.forEach(item => {
                if (showHidden || !item.hidden) {
                    const titleMatch = item.title.en.toLowerCase().includes(searchTerm);

                    if (!searchTerm || titleMatch) {
                        const tr = document.createElement('tr');
                        tr.dataset.categoryId = category.categoryId;
                        tr.dataset.uniqueRandomTag = item.uniqueRandomTag;

                        // Status badge
                        let statusBadge = '';
                        if (item.hidden) {
                            statusBadge = '<span class="badge bg-secondary">Hidden</span>';
                        } else if (item.selected) {
                            statusBadge = '<span class="badge bg-success">Featured</span>';
                        } else {
                            statusBadge = '<span class="badge bg-primary">Active</span>';
                        }

                        // Actions buttons - using same classes as other sections
                        const actions = `
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-primary edit-offersAndNews-item" title="Edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger delete-offersAndNews-item" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button type="button" class="btn btn-outline-secondary toggle-offersAndNews-hidden" title="${item.hidden ? 'Show' : 'Hide'}">
                                    <i class="bi bi-eye${item.hidden ? '-slash' : ''}"></i>
                                </button>
                                <button type="button" class="btn btn-outline-success toggle-offersAndNews-featured" title="${item.selected ? 'Remove featured' : 'Make featured'}">
                                    <i class="bi bi-star${item.selected ? '-fill' : ''}"></i>
                                </button>
                            </div>
                        `;

                        tr.innerHTML = `
                            <td>${itemCount++}</td>
                            <td><img src="assets/img/offersAndNews/${category.categoryId}/${item.imagefile}" alt="${item.title.en}" style="height: 50px; object-fit: cover;"></td>
                            <td>
                                <div class="fw-bold">${item.title.en}</div>
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
    setupOffersAndNewsActionButtons();
}

/**
 * Sets up action buttons for the offersAndNews table.
 */
function setupOffersAndNewsActionButtons() {
    // Edit button
    document.querySelectorAll('.edit-offersAndNews-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            editOffersAndNewsItem(categoryId, uniqueRandomTag);
        });
    });

    // Delete button
    document.querySelectorAll('.delete-offersAndNews-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;

            showConfirmationModal('Are you sure you want to delete this item?', () => {
                deleteOffersAndNewsItem(categoryId, uniqueRandomTag);
            });
        });
    });

    // Toggle hidden button
    document.querySelectorAll('.toggle-offersAndNews-hidden').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            toggleOffersAndNewsItemHidden(categoryId, uniqueRandomTag);
            populateOffersAndNewsTable();
        });
    });

    // Toggle featured button
    document.querySelectorAll('.toggle-offersAndNews-featured').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const categoryId = tr.dataset.categoryId;
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            toggleOffersAndNewsItemFeatured(categoryId, uniqueRandomTag);
            populateOffersAndNewsTable();
        });
    });
}





/**
 * Deletes a offersAndNews item.
 * @param {string} categoryId - The category ID of the offersAndNews item.
 * @param {string} uniqueRandomTag - The unique tag of the offersAndNews item.
 */
function deleteOffersAndNewsItem(categoryId, uniqueRandomTag) {
    const category = offersAndNewsData.offersAndNews.category.find(c => c.categoryId === categoryId);
    if (category) {
        category.item = category.item.filter(i => i.uniqueRandomTag !== uniqueRandomTag);
        offersAndNewsData.lastUpdated = getCurrentTimestamp();
        markOffersAndNewsAsChanged();
        populateOffersAndNewsTable();

        // Show feedback
        showInformationModal('Image deleted successfully!');
    }
}

/**
 * Toggles the hidden status of a offersAndNews item.
 * @param {string} categoryId - The category ID of the offersAndNews item.
 * @param {string} uniqueRandomTag - The unique tag of the offersAndNews item.
 */
function toggleOffersAndNewsItemHidden(categoryId, uniqueRandomTag) {
    const category = offersAndNewsData.offersAndNews.category.find(c => c.categoryId === categoryId);
    const item = category?.item.find(i => i.uniqueRandomTag === uniqueRandomTag);
    if (item) {
        item.hidden = !item.hidden;
        item.lastUpdated = getCurrentTimestamp();
        offersAndNewsData.lastUpdated = getCurrentTimestamp();
        markOffersAndNewsAsChanged();
        populateOffersAndNewsTable();
    }
}

/**
 * Toggles the featured status of a offersAndNews item.
 * @param {string} categoryId - The category ID of the offersAndNews item.
 * @param {string} uniqueRandomTag - The unique tag of the offersAndNews item.
 */
function toggleOffersAndNewsItemFeatured(categoryId, uniqueRandomTag) {
    const category = offersAndNewsData.offersAndNews.category.find(c => c.categoryId === categoryId);
    const item = category?.item.find(i => i.uniqueRandomTag === uniqueRandomTag);
    if (item) {
        item.selected = !item.selected;
        item.lastUpdated = getCurrentTimestamp();
        offersAndNewsData.lastUpdated = getCurrentTimestamp();
        markOffersAndNewsAsChanged();
        populateOffersAndNewsTable();
    }
}




/**
 * Updates the offersAndNews data on the server.
 */
async function updateWebsiteOffersAndNews() {
    if (!offersAndNewsData || !offersAndNewsData.offersAndNews || !offersAndNewsData.offersAndNews.category) {
        showInformationModal('No offersAndNews data available to update.');
        return;
    }

    try {
        const jsonStr = JSON.stringify(offersAndNewsData, null, 2);
        const formData = new FormData();
        const blob = new Blob([jsonStr], { type: 'application/json' });

        formData.append('jsonFile', blob, 'offersAndNews.json');
        const response = await fetch('upload_json.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('updateWebsiteOffersAndNews').disabled = true;
            isOffersAndNewsChanged = false;
            showInformationModal('OffersAndNews updated successfully!');
            resetOffersAndNewsChangedStatus();
        } else {
            throw new Error(data.message || 'Failed to update offersAndNews');
        }
    } catch (error) {
        console.error('Error updating offersAndNews:', error);
        showInformationModal('Failed to update the website offersAndNews: ' + error.message);
    }
}

/**
 * Exports the offersAndNews data as a JSON file.
 */
function exportOffersAndNewsJson() {
    if (!offersAndNewsData || !offersAndNewsData.offersAndNews || !offersAndNewsData.offersAndNews.category) {
        showInformationModal('No offersAndNews data available to export.');
        return;
    }

    const jsonStr = JSON.stringify(offersAndNewsData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'offersAndNews.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showInformationModal('OffersAndNews data exported successfully!');
}

/**
 * Imports offersAndNews data from a JSON file.
 */
async function importOffersAndNewsJson() {
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

                if (!jsonData.offersAndNews || !Array.isArray(jsonData.offersAndNews.category)) {
                    throw new Error('Invalid offersAndNews data structure');
                }

                offersAndNewsData = jsonData;
                populateOffersAndNewsCategoryFilters();
                populateOffersAndNewsTable();
                markOffersAndNewsAsChanged();

                bootstrap.Modal.getInstance(document.getElementById('importJsonModal')).hide();
                fileInput.value = '';
                showInformationModal('OffersAndNews data imported successfully!');
            } catch (error) {
                showInformationModal('Error parsing offersAndNews data: ' + error.message);
            }
        };
        reader.readAsText(file);
    } catch (error) {
        showInformationModal('Error importing offersAndNews data: ' + error.message);
    }
}


/**
 * ===== Event Listeners =====
 */

/**
 * Uploads the selected offersAndNews item to the server.
 */
function uploadOffersAndNewsImageToServer(event, categoryId) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Handle file upload first
        const formData = new FormData();
        formData.append('image', file);
        formData.append('upload_path', `assets/img/offersAndNews/${categoryId}/`); // Adjust the path as needed

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
                const preview = document.querySelector('#offersAndNewsImagePreview img');
                if (preview) {
                    preview.src = `assets/img/offersAndNews/${categoryId}/${data.filename}`;
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
     * ===== OffersAndNews Management Event Listeners =====
     */

    document.getElementById('addNewOffersAndNewsItem').addEventListener('click', function () {
        showAddOffersAndNewsItemModal();
    });

    document.getElementById('saveOffersAndNewsItem').addEventListener('click', function () {
        saveOffersAndNewsItem();
    });

    /*
    document.getElementById('exportOffersAndNewsJson').addEventListener('click', function () {
        exportOffersAndNewsJson();
    });

    document.getElementById('importOffersAndNewsJson').addEventListener('click', function () {
        importJsonModal.show();
        document.getElementById('confirmImport').onclick = importOffersAndNewsJson;
    });
*/
    document.getElementById('updateWebsiteOffersAndNews').addEventListener('click', function () {
        showConfirmationModal('Are you sure you want to update the website offersAndNews? This will overwrite the current reviews on the website.', function () {
            updateWebsiteOffersAndNews();
        });
    });

    document.getElementById('offersAndNewsCategoryFilter').addEventListener('change', function () {
        populateOffersAndNewsTable();
    });

    document.getElementById('offersAndNewsSearchInput').addEventListener('input', function () {
        populateOffersAndNewsTable();
    });

    document.getElementById('showHiddenOffersAndNewsItems').addEventListener('change', function () {
        populateOffersAndNewsTable();
    });

    // Attach event listener to file input for uploading offersAndNews item
    document.getElementById('offersAndNewsImageFileInput').addEventListener('change', function (event) {
        uploadOffersAndNewsImageToServer(event, currentOffersAndNewsCategoryId);
    });

    // Load initial offersAndNews data
    loadOffersAndNewsData();
});


