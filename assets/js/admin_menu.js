/**
 * Global State
 */
let menuData = {};
let currentDishUniqueRandomTag = null;
let currentMenuCategoryId = null;
let availableMenuImages = [];
let isMenuChanged = false;

/**
 * Utility Functions
 */

/**
 * Marks the menu as changed and enables the update button.
 */
function markMenuAsChanged() {
    isMenuChanged = true;
    document.getElementById('updateWebsiteMenu').disabled = false;
}

/**
 * Resets the menu change status and disables the update button.
 */
function resetMenuChangeStatus() {
    isMenuChanged = false;
    document.getElementById('updateWebsiteMenu').disabled = true;
}

/**
 * Extracts all images from menu items.
 * @returns {string[]} Array of image filenames.
 */
function getAllListedMenuImages() {
    try {
        // Get images from menu data
        const menuJsonImages = getAllMenuImagesFromMenuJSON();

        // Merge both arrays and remove duplicates using a Set
        const allImages = Array.from(new Set([...menuJsonImages]));

        return allImages; // Return the merged array
    } catch (error) {
        console.error('Error generating all images:', error);
        return []; // Return an empty array on error
    }
}

function getAllMenuImagesFromMenuJSON() {
    const images = new Set();
    for (const category of menuData.menu.category) {
        for (const dish of category.dish) {
            if (dish.imagefile) {
                images.add(dish.imagefile);
            }
        }
    }
    return Array.from(images);
}

async function getAllAvailableMenuImagesFromServer() {
    try {
        const response = await fetch('available_menu_images.php');
        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const images = await response.json();
        return images; // Array of image filenames
    } catch (error) {
        console.error('Error fetching images:', error);
        return []; // Return an empty array on error
    }
}

/**
 * Modal Management
 */

/**
 * Generates the HTML for the menu item modal.
 * @returns {string} Modal HTML.
 */
function generateMenuItemModal() {
    return `
    <div class="modal fade" id="menuItemModal" tabindex="-1" aria-labelledby="menuItemModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="menuItemModalLabel">Add New Menu Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="menuItemForm">
                        <input type="hidden" id="dishId">
                        <input type="hidden" id="dishUniqueRandomTag">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="dishCategorySelect" class="form-label">Category</label>
                                <select class="form-select" id="dishCategorySelect" required>
                                    <!-- Categories will be populated by JavaScript -->
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="dishImageSelect" class="form-label">Image</label>
                                <div class="input-group">
                                    <select class="form-select" id="dishImageSelect">
                                        <!-- Images will be populated by JavaScript -->
                                    </select>
                                    <button class="btn btn-outline-secondary" type="button" id="uploadImageBtn">
                                        <i class="bi bi-upload"></i> Upload
                                    </button>
                                    <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                                </div>
                                <div id="imagePreviewContainer" class="mt-2">
                                    <img id="imagePreview" class="preview-image img-fluid rounded" src="" alt="Preview" style="max-width: 200px; max-height: 200px; display: none;">
                                </div>
                            </div>
                        </div>
                        <!-- Language tabs and content -->
                        <ul class="nav nav-tabs" id="languageTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="en-tab" data-bs-toggle="tab" data-bs-target="#en" type="button" role="tab" aria-controls="en" aria-selected="true">English</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="de-tab" data-bs-toggle="tab" data-bs-target="#de" type="button" role="tab" aria-controls="de" aria-selected="false">German</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="am-tab" data-bs-toggle="tab" data-bs-target="#am" type="button" role="tab" aria-controls="am" aria-selected="false">Amharic</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="languageTabContent">
                            <!-- English Tab -->
                            <div class="tab-pane fade show active language-tab-content" id="en" role="tabpanel" aria-labelledby="en-tab">
                                <div class="mb-3">
                                    <label for="dishName_en" class="form-label">Name (English)</label>
                                    <input type="text" class="form-control" id="dishName_en" required>
                                </div>
                                <div class="mb-3">
                                    <label for="dishShortDescription_en" class="form-label">Short Description (English)</label>
                                    <input type="text" class="form-control" id="dishShortDescription_en" required>
                                </div>
                                <div class="mb-3">
                                    <label for="dishLongDescription_en" class="form-label">Long Description (English)</label>
                                    <textarea class="form-control" id="dishLongDescription_en" rows="3"></textarea>
                                </div>
                            </div>
                            <!-- German Tab -->
                            <div class="tab-pane fade language-tab-content" id="de" role="tabpanel" aria-labelledby="de-tab">
                                <div class="mb-3">
                                    <label for="dishName_de" class="form-label">Name (German)</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="dishName_de" required>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishName_en" data-target="dishName_de" data-lang="de">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="dishShortDescription_de" class="form-label">Short Description (German)</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="dishShortDescription_de" required>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishShortDescription_en" data-target="dishShortDescription_de" data-lang="de">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="dishLongDescription_de" class="form-label">Long Description (German)</label>
                                    <div class="input-group">
                                        <textarea class="form-control" id="dishLongDescription_de" rows="3"></textarea>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishLongDescription_en" data-target="dishLongDescription_de" data-lang="de">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <!-- Amharic Tab -->
                            <div class="tab-pane fade language-tab-content" id="am" role="tabpanel" aria-labelledby="am-tab">
                                <div class="mb-3">
                                    <label for="dishName_am" class="form-label">Name (Amharic)</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="dishName_am" required>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishName_en" data-target="dishName_am" data-lang="am">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="dishShortDescription_am" class="form-label">Short Description (Amharic)</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="dishShortDescription_am" required>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishShortDescription_en" data-target="dishShortDescription_am" data-lang="am">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="dishLongDescription_am" class="form-label">Long Description (Amharic)</label>
                                    <div class="input-group">
                                        <textarea class="form-control" id="dishLongDescription_am" rows="3"></textarea>
                                        <button class="btn btn-outline-secondary translate-btn" type="button" data-source="dishLongDescription_en" data-target="dishLongDescription_am" data-lang="am">
                                            <i class="bi bi-translate"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Price Inputs -->
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="dishPrice" class="form-label">Price (€)</label>
                                <input type="number" class="form-control" id="dishPrice" step="0.01" min="0" required>
                            </div>
                            <div class="col-md-4">
                                <label for="dishPrice2" class="form-label">Secondary Price (€)</label>
                                <input type="number" class="form-control" id="dishPrice2" step="0.01" min="0">
                            </div>
                            <div class="col-md-4">
                                <label for="dishPrice3" class="form-label">Third Price (€)</label>
                                <input type="number" class="form-control" id="dishPrice3" step="0.01" min="0">
                            </div>
                        </div>

                        <!-- hidden and selected Checkboxes -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="dishHidden">
                                    <label class="form-check-label" for="dishHidden">Hidden from menu</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="dishSelected">
                                    <label class="form-check-label" for="dishSelected">Featured item</label>
                                </div>
                            </div>
                        </div>

                        <!-- Allergens and Additives -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="allergens" class="form-label">Allergens</label>
                                <div class="row" id="allergensContainer">
                                    <!-- Dropdown Allergens Input Box -->
                                    <div class="d-flex align-items-center mt-4">
                                        <div id="dishSelectedAllergenItems" class="d-flex flex-wrap me-2"></div>
                                        <div class="dropdown dropdown-allergens-additives">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownAllergenMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="min-width: 150px;">
                                                Select items
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownAllergenMenuButton" id="dropdownAllergenList">
                                                <!-- Dropdown items will be populated here dynamically -->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="additives" class="form-label">Additives</label>
                                <div class="row" id="additivesContainer">
                                    <div class="d-flex align-items-center mt-4">
                                        <div id="dishSelectedAdditiveItems" class="d-flex flex-wrap me-2"></div>
                                        <div class="dropdown dropdown-allergens-additives">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownAdditiveMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="min-width: 150px;">
                                                Select items
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownAdditiveMenuButton" id="dropdownAdditiveList">
                                                <!-- Dropdown items will be populated here dynamically -->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveMenuItem">Save</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Data Management
 */

/**
 * Loads menu data from the server.
 */
async function loadMenuData() {
    try {
        const response = await fetch('assets/json/menu.json'); // Updated path
        if (!response.ok) throw new Error('Menu data not found');
        menuData = await response.json();
    } catch (error) {
        console.error('Error loading menu:', error);
        showInformationModal('Failed to load menu data. Please check the server.');
    }

    // Ensure allergen_mapping and additive_mapping exist in menuData
    if (!menuData.allergen_mapping) {
        menuData.allergen_mapping = {};
        console.warn('No allergen mapping found in menuData.');
    }

    if (!menuData.additive_mapping) {
        menuData.additive_mapping = {};
        console.warn('No additive mapping found in menuData.');
    }

    // Extract all available images from menu items
    availableMenuImages = getAllListedMenuImages();

    // Populate the UI
    populateCategoryFilters();
    populateMenuTable();
}

/**
 * Saves menu data to the server.
 */
function saveMenuData() {
    //console.log('Saving menu data...');
    // Implement the actual save logic here, e.g., sending data to the server via AJAX
}

/**
 * UI Management
 */

/**
 * Populates the category filters in the UI.
 */
function populateCategoryFilters() {
    const dishCategoryFilter = document.getElementById('dishCategoryFilter');
    const dishCategorySelect = document.getElementById('dishCategorySelect'); // Ensure unique ID

    if (!dishCategoryFilter || !dishCategorySelect) {
        console.error('Category filter or select element not found.');
        return;
    }

    // Clear existing options
    dishCategoryFilter.innerHTML = '<option value="">All Categories</option>';
    dishCategorySelect.innerHTML = '';

    // Add options for each category
    menuData.menu.category.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryId;
        option.textContent = category.name.en;
        dishCategoryFilter.appendChild(option);

        // Append the same option to both dropdowns
        dishCategoryFilter.appendChild(option.cloneNode(true));
        dishCategorySelect.appendChild(option);
    });
}

/**
 * Populates the menu table in the UI.
 */
function populateMenuTable() {
    const tbody = document.querySelector('#menuTable tbody');
    tbody.innerHTML = '';

    const selectedCategory = document.getElementById('dishCategoryFilter').value; // Get selected category
    const showHidden = document.getElementById('showHiddenItems').checked; // Check hidden items toggle
    
    let itemCount = 1;
    menuData.menu.category.forEach(category => {
        if (!selectedCategory || category.categoryId === selectedCategory) { // Apply category filter
            category.dish.forEach(dish => {
                if (showHidden || !dish.hidden) { // Apply hidden items filter
                    const tr = document.createElement('tr');
                    tr.dataset.uniqueRandomTag = dish.uniqueRandomTag;
                    tr.dataset.categoryId = category.categoryId;
                    
                    // Status badge
                    let statusBadge = '';
                    if (dish.hidden) {
                        statusBadge = '<span class="badge bg-secondary status-badge">Hidden</span>';
                    } else if (dish.selected) {
                        statusBadge = '<span class="badge bg-success status-badge">Featured</span>';
                    } else {
                        statusBadge = '<span class="badge bg-primary status-badge">Active</span>';
                    }
                    
                    // Action buttons
                    const actions = `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary edit-dish" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger delete-dish" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary toggle-hidden-dish" title="${dish.hidden ? 'Show' : 'Hide'}">
                                <i class="bi bi-eye${dish.hidden ? '-slash' : ''}"></i>
                            </button>
                            <button type="button" class="btn btn-outline-success toggle-featured-dish" title="${dish.selected ? 'Remove featured' : 'Make featured'}">
                                <i class="bi bi-star${dish.selected ? '-fill' : ''}"></i>
                            </button>
                        </div>
                    `;
                    
                    // Create table row
                    tr.innerHTML = `
                        <td>${itemCount++}</td>
                        <td>${dish.dishId}</td>
                        <td>${dish.name.en}</td>
                        <td>€${dish.price}</td>
                        <td>${statusBadge}</td>
                        <td>${actions}</td>
                    `;
                    
                    tbody.appendChild(tr);
                }
            });
        }
    });
    
    setupMenuActionButtons();
}

function setupMenuActionButtons(){
    // Reapply event listeners to action buttons
    document.querySelectorAll('.edit-dish').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            editMenuItem(uniqueRandomTag, categoryId);
        });
    });
    
    document.querySelectorAll('.delete-dish').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            currentDishUniqueRandomTag = tr.dataset.uniqueRandomTag;
            currentMenuCategoryId = tr.dataset.categoryId;
            bootstrap.Modal.getInstance(document.getElementById('confirmDeleteDishModal')).show();
        });
    });
    
    document.querySelectorAll('.toggle-hidden-dish').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            toggleHiddenStatus(uniqueRandomTag, categoryId);
            markMenuAsChanged();
            populateMenuTable(); // Reapply filters after toggling
        });
    });
    
    document.querySelectorAll('.toggle-featured-dish').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            toggleFeaturedStatus(uniqueRandomTag, categoryId);
            markMenuAsChanged();
            populateMenuTable(); // Reapply filters after toggling
        });
    });
}

// when document loaded
document.addEventListener('DOMContentLoaded', async function () {
    // Add event listener for category dropdown changes
    document.getElementById('dishCategoryFilter').addEventListener('change', async function () {
        populateMenuTable(); // Repopulate menu table based on selected category
    });
});


// Function to show the add modal
function showAddMenuItemModal() {
    const modal = document.getElementById('menuItemModal');
    const modalTitle = document.getElementById('menuItemModalLabel');
    const form = document.getElementById('menuItemForm');

    // Reset form
    form.reset();
    document.getElementById('dishId').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    
    // Set title
    modalTitle.textContent = 'Add New Menu Item';
    
    // Populate image select
    populateImageSelect();
    
    // populate the allergen and additive dropdowns
    populateAllergenAndAdditiveItemsSelect();

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}

// Function to edit a menu item
function editMenuItem(uniqueRandomTag, categoryId) {
    const modal = document.getElementById('menuItemModal');
    const modalTitle = document.getElementById('menuItemModalLabel');
    const form = document.getElementById('menuItemForm');
    
    // Find the category and dish
    const category = menuData.menu.category.find(c => c.categoryId === categoryId);
    const dish = category.dish.find(d => d.uniqueRandomTag === uniqueRandomTag);
    
    if (!dish) return;
    
    // Set title
    modalTitle.textContent = `Edit ${dish.name.en}`;
    
    // Populate form fields
    document.getElementById('dishId').value = dish.dishId;
    document.getElementById('dishUniqueRandomTag').value = dish.uniqueRandomTag;
    document.getElementById('dishCategorySelect').value = categoryId;
    
    // Set language fields
    document.getElementById('dishName_en').value = dish.name.en || '';
    document.getElementById('dishShortDescription_en').value = dish.shortDescription.en || '';
    document.getElementById('dishLongDescription_en').value = dish.longDescription.en || '';
    
    document.getElementById('dishName_de').value = dish.name.de || '';
    document.getElementById('dishShortDescription_de').value = dish.shortDescription.de || '';
    document.getElementById('dishLongDescription_de').value = dish.longDescription.de || '';
    
    document.getElementById('dishName_am').value = dish.name.am || '';
    document.getElementById('dishShortDescription_am').value = dish.shortDescription.am || '';
    document.getElementById('dishLongDescription_am').value = dish.longDescription.am || '';
    
    // Set prices
    document.getElementById('dishPrice').value = dish.price || '';
    document.getElementById('dishPrice2').value = dish.price2 || '';
    document.getElementById('dishPrice3').value = dish.price3 || '';
    
    // Set checkboxes
    document.getElementById('dishHidden').checked = dish.hidden;
    document.getElementById('dishSelected').checked = dish.selected;
    
    // Populate image select and set current image
    populateImageSelect();
    document.getElementById('dishImageSelect').value = dish.imagefile || '';
    updateImagePreview();
    
    // populate the allergen and additive dropdowns
    populateAllergenAndAdditiveItemsSelect();

    // populate the allergen and additive dropdowns
    updateCurrentDishAllergenAndAdditiveItems(dish.allergens, dish.additives);

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}

// Function to populate Allergen And Additive Items select dropdown
function populateAllergenAndAdditiveItemsSelect() {
     // Multi-select dropdown functionality
     const dropdownAllergenList = document.getElementById('dropdownAllergenList');
     const selectedAllergenItemsContainer = document.getElementById('dishSelectedAllergenItems');

    const dropdownAdditiveList = document.getElementById('dropdownAdditiveList');
    const selectedAdditiveItemsContainer = document.getElementById('dishSelectedAdditiveItems');    
    
    // Clear existing items in the dropdown lists
    if (selectedAdditiveItemsContainer) {
        selectedAdditiveItemsContainer.innerHTML = '';
    }
    if (selectedAllergenItemsContainer) {
        selectedAllergenItemsContainer.innerHTML = '';
    }

    // Clear existing items in the dropdown lists
    if (dropdownAdditiveList) {
        dropdownAdditiveList.innerHTML = '';

    }
    if (dropdownAllergenList) {
        dropdownAllergenList.innerHTML = '';
    }


    // Check if allergen_mapping exists and is an object
    if (menuData.allergen_mapping && typeof menuData.allergen_mapping === 'object') {
        for (const [allergen_id, allergen_name] of Object.entries(menuData.allergen_mapping)) {
            const allergenListItem = document.createElement('li');
            allergenListItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${allergen_name.en}">${allergen_name.en}</a>`;
            dropdownAllergenList.appendChild(allergenListItem);
        }
    } else {
        console.warn('No allergen mapping found in menuData.');
    }

    // Check if additive_mapping exists and is an object
    if (menuData.additive_mapping && typeof menuData.additive_mapping === 'object') {
        for (const [additive_id, additive_name] of Object.entries(menuData.additive_mapping)) {
            const additiveListItem = document.createElement('li');
            additiveListItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${additive_name.en}">${additive_name.en}</a>`;
            dropdownAdditiveList.appendChild(additiveListItem);
        }
    } else {
        console.warn('No additive mapping found in menuData.');
    }

     dropdownAllergenList.addEventListener('click', function (e) {
         e.preventDefault();
         if (e.target.tagName === 'A') {
             const selectedValue = e.target.getAttribute('data-value');

             // Check if the item is already selected
             if (![...selectedAllergenItemsContainer.children].some(item => item.dataset.value === selectedValue)) {
                 // Create a badge for the selected item
                 const badge = document.createElement('span');
                 badge.className = 'badge bg-primary me-2 mb-2';
                 badge.dataset.value = selectedValue;
                 badge.innerHTML = `
                     ${selectedValue}
                     <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
                 `;
                 selectedAllergenItemsContainer.appendChild(badge);

                 // Hide the selected item from the dropdown
                 [...dropdownAllergenList.children].forEach(item => {
                     if (item.querySelector('a').getAttribute('data-value') === selectedValue) {
                         item.classList.add('d-none');
                     }
                 });

                 // Add event listener to remove the badge
                 badge.querySelector('.btn-close').addEventListener('click', function () {
                     badge.remove();
                     [...dropdownAllergenList.children].forEach(item => {
                         if (item.querySelector('a').getAttribute('data-value') === selectedValue) {
                             item.classList.remove('d-none');
                         }
                     });
                 });
             }
         }
     });

     dropdownAdditiveList.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const selectedValue = e.target.getAttribute('data-value');

            // Check if the item is already selected
            if (![...selectedAdditiveItemsContainer.children].some(item => item.dataset.value === selectedValue)) {
                // Create a badge for the selected item
                const badge = document.createElement('span');
                badge.className = 'badge bg-primary me-2 mb-2';
                badge.dataset.value = selectedValue;
                badge.innerHTML = `
                    ${selectedValue}
                    <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
                `;
                selectedAdditiveItemsContainer.appendChild(badge);

                // Hide the selected item from the dropdown
                [...dropdownAdditiveList.children].forEach(item => {
                    if (item.querySelector('a').getAttribute('data-value') === selectedValue) {
                        item.classList.add('d-none');
                    }
                });

                // Add event listener to remove the badge
                badge.querySelector('.btn-close').addEventListener('click', function () {
                    badge.remove();
                    [...dropdownAdditiveList.children].forEach(item => {
                        if (item.querySelector('a').getAttribute('data-value') === selectedValue) {
                            item.classList.remove('d-none');
                        }
                    });
                });
            }
        }
    });
}

function updateCurrentDishAllergenAndAdditiveItems(allergen_ids = [], additive_ids = []) {
    // Check if additive_mapping exists and is an object
    if (menuData.additive_mapping && typeof menuData.additive_mapping === 'object') {
        for (const [this_additive_id, this_additive_name] of Object.entries(menuData.additive_mapping)) {
            if (additive_ids.includes(this_additive_id)) {
                addSelectedAdditivesItem(this_additive_name.en);
            }
        }
    } else {
        console.warn('No additive mapping found in menuData.');
    }

    // Check if allergen_mapping exists and is an object
    if (menuData.allergen_mapping && typeof menuData.allergen_mapping === 'object') {
        for (const [this_allergen_id, this_allergen_name] of Object.entries(menuData.allergen_mapping)) {
            if (allergen_ids.includes(this_allergen_id)) {
                addSelectedAllergensItem(this_allergen_name.en);
            }
        }
    } else {
        console.warn('No allergen mapping found in menuData.');
    }
}

// Function to populate image select dropdown
function populateImageSelect() {
    const select = document.getElementById('dishImageSelect');
    select.innerHTML = '<option value="">Select an image</option>';
    availableMenuImages.forEach(imagefile => {
        const option = document.createElement('option');
        option.value = imagefile;
        option.textContent = imagefile;
        select.appendChild(option);
    });
}

// Function to update image preview
function updateImagePreview() {
    const select = document.getElementById('dishImageSelect');
    const preview = document.getElementById('imagePreview');
    
    if (select.value) {
        preview.src = `assets/img/dishes/${select.value}`;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    // Add event listener to the dropdown
    document.getElementById('dishImageSelect').addEventListener('change', updateImagePreview);
}

// Function to programmatically add items to the selected items list
function addSelectedAllergensItem(itemValue) {
    const selectedAllergenItemsContainer = document.getElementById('dishSelectedAllergenItems');
    const dropdownAllergenList = document.getElementById('dropdownAllergenList');
    // Check if the item is already selected
    if (![...selectedAllergenItemsContainer.children].some(item => item.dataset.value === itemValue)) {
        // Create a badge for the selected item
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-2 mb-2';
        badge.dataset.value = itemValue;
        badge.innerHTML = `
            ${itemValue}
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
        `;
        selectedAllergenItemsContainer.appendChild(badge);

        // Hide the selected item from the dropdown
        [...dropdownAllergenList.children].forEach(item => {
            if (item.querySelector('a').getAttribute('data-value') === itemValue) {
                item.classList.add('d-none');
            }
        });

        // Add event listener to remove the badge
        badge.querySelector('.btn-close').addEventListener('click', function () {
            badge.remove();
            [...dropdownAllergenList.children].forEach(item => {
                if (item.querySelector('a').getAttribute('data-value') === itemValue) {
                    item.classList.remove('d-none');
                }
            });
        });
    }
}

// Function to programmatically add items to the selected items list
function addSelectedAdditivesItem(itemValue) {
    const selectedAdditiveItemsContainer = document.getElementById('dishSelectedAdditiveItems');
    const dropdownAdditiveList = document.getElementById('dropdownAdditiveList');
    // Check if the item is already selected
    if (![...selectedAdditiveItemsContainer.children].some(item => item.dataset.value === itemValue)) {
        // Create a badge for the selected item
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-2 mb-2';
        badge.dataset.value = itemValue;
        badge.innerHTML = `
            ${itemValue}
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
        `;
        selectedAdditiveItemsContainer.appendChild(badge);

        // Hide the selected item from the dropdown
        [...dropdownAdditiveList.children].forEach(item => {
            if (item.querySelector('a').getAttribute('data-value') === itemValue) {
                item.classList.add('d-none');
            }
        });

        // Add event listener to remove the badge
        badge.querySelector('.btn-close').addEventListener('click', function () {
            badge.remove();
            [...dropdownAdditiveList.children].forEach(item => {
                if (item.querySelector('a').getAttribute('data-value') === itemValue) {
                    item.classList.remove('d-none');
                }
            });
        });
    }
}

// Function to trigger image upload
function triggerImageUpload() {
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
        fileInput.click();
    } else {
        console.error('Image upload input element not found.');
    }
}

// Function to handle image upload
function handleMenuImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showInformationModal('Invalid file type. Please upload an image (JPEG, PNG, or GIF).');
        return;
    }

    // Validate file size (e.g., max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        showInformationModal('File size exceeds 2MB. Please upload a smaller image.');
        return;
    }

    // Create a FormData object to send the file to the server
    const formData = new FormData();
    formData.append('image', file);
    formData.append('upload_path', 'assets/img/dishes/'); // or 'assets/img/dishes/'

    // Send the file to the server using fetch
    fetch('upload_image.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Add the uploaded image to the available images
                availableMenuImages.push(data.filename);

                // Update the image select dropdown
                const select = document.getElementById('dishImageSelect');
                const option = document.createElement('option');
                option.value = data.filename;
                option.textContent = data.filename;
                select.appendChild(option);
                select.value = data.filename;

                // Update the preview
                updateImagePreview();
                
                showInformationModal('Image uploaded successfully!');
            } else {
                showInformationModal(`Failed to upload image: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            showInformationModal('An error occurred while uploading the image. Please try again.');
        });
}






// Function to save a menu item
function saveMenuItem() {
    const form = document.getElementById('menuItemForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const dishId = document.getElementById('dishId').value;
    const uniqueRandomTag = document.getElementById('dishUniqueRandomTag').value;
    const isNew = !uniqueRandomTag;

    showInformationModal('isNew: ' + isNew + ', uniqueRandomTag: ' + uniqueRandomTag);

    // Get form values
    const categoryId = document.getElementById('dishCategorySelect').value;
    const imagefile = document.getElementById('dishImageSelect').value;

    // Get language values
    const name = {
        en: document.getElementById('dishName_en').value,
        de: document.getElementById('dishName_de').value,
        am: document.getElementById('dishName_am').value
    };
    
    const shortDescription = {
        en: document.getElementById('dishShortDescription_en').value,
        de: document.getElementById('dishShortDescription_de').value,
        am: document.getElementById('dishShortDescription_am').value
    };
    
    const longDescription = {
        en: document.getElementById('dishLongDescription_en').value,
        de: document.getElementById('dishLongDescription_de').value,
        am: document.getElementById('dishLongDescription_am').value
    };

    // Get prices
    const price = document.getElementById('dishPrice').value;
    const price2 = document.getElementById('dishPrice2').value || undefined;
    const price3 = document.getElementById('dishPrice3').value || undefined;
    
    // Get checkboxes
    const hidden = document.getElementById('dishHidden').checked;
    const selected = document.getElementById('dishSelected').checked;
    
    const timestamp = getCurrentTimestamp();

    // Get allergens and additives
    const selectedAllergenItems = document.querySelectorAll('#dishSelectedAllergenItems .badge');
    const selectedAdditiveItems = document.querySelectorAll('#dishSelectedAdditiveItems .badge');
    const allergens = Array.from(selectedAllergenItems).map(item => item.dataset.value);
    const additives = Array.from(selectedAdditiveItems).map(item => item.dataset.value);
    const allergensIds = Object.keys(menuData.allergen_mapping).filter(key => allergens.includes(menuData.allergen_mapping[key].en));
    const additivesIds = Object.keys(menuData.additive_mapping).filter(key => additives.includes(menuData.additive_mapping[key].en));

    // show in modal window the selected items allergens and additives together with their ids
    // showInformationModal('Selected allergens: ' + allergens.join(', ') + '<br>Selected additives: ' + additives.join(', '));

    
    // Create dish object
    const dish = {
        dishId: isNew ? 'NA' : dishId,
        uniqueRandomTag: isNew ? generateUniqueRandomTag(10) : uniqueRandomTag,
        name,
        shortDescription,
        longDescription,
        price,
        imagefile,
        hidden,
        selected,
        allergens: allergensIds,
        additives: additivesIds,
        lastUpdated: timestamp
    };

    // Add optional prices if they exist
    if (price2) dish.price2 = price2;
    if (price3) dish.price3 = price3;
    
    // Find the category
    const category = menuData.menu?.category?.find(c => c.categoryId === categoryId);
    if (!category) {
        console.error(`Category with ID ${categoryId} not found.`);
        showInformationModal('Invalid category selected. Please try again.');
        return;
    }

    if (isNew) {
        // Add new dish
        category.dish.push(dish);
    } else {
        // Update existing dish
        const index = category.dish.findIndex(d => d.uniqueRandomTag === uniqueRandomTag);
        if (index !== -1) {
            category.dish[index] = dish;
        }
    }
    
    menuData.lastUpdated = timestamp;

    // mark as changed
    markMenuAsChanged();

    // Update the menu table
    populateMenuTable();
    
    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();
    
    // In a real app, you would save the data to the server here
    //saveMenuData();
}

// Updated deleteMenuItem function
function deleteMenuItem() {
    // Validate current IDs
    if (!currentMenuCategoryId) {
        console.error('No category ID specified for deletion.');
        return;
    }
    if (!currentDishUniqueRandomTag) {
        console.error('No dish unique random tag specified for deletion.');
        return;
    }

    // Find the category
    const category = menuData.menu?.category?.find(c => c.categoryId === currentMenuCategoryId);
    if (!category) {
        console.error(`Category with ID ${currentMenuCategoryId} not found.`);
        return;
    }

    // Remove the dish
    const initialDishCount = category.dish.length;
    category.dish = category.dish.filter(d => d.uniqueRandomTag !== currentDishUniqueRandomTag);

    if (category.dish.length === initialDishCount) {
        console.warn(`Dish with unique random tag ${currentDishUniqueRandomTag} not found in category ${currentMenuCategoryId}.`);
    } else {
        console.log(`Dish with unique random tag ${currentDishUniqueRandomTag} deleted successfully.`);
    }

    // mark as changed
    markMenuAsChanged();
    // Update the menu table
    populateMenuTable();

    // Save the updated data to the server
    //saveMenuData();

    // Hide modal
    const modal = document.getElementById('confirmDeleteDishModal');
    if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
    } else {
        console.warn('Confirmation modal not found.');
    }

    // Reset current IDs
    currentDishUniqueRandomTag = null;
    currentMenuCategoryId = null;
}

// Updated toggleHiddenStatus function
function toggleHiddenStatus(uniqueRandomTag, categoryId) {
    const category = menuData.menu?.category?.find(c => c.categoryId === categoryId);
    if (!category) {
        console.error(`Category with ID ${categoryId} not found.`);
        return;
    }

    const dish = category.dish.find(d => d.uniqueRandomTag === uniqueRandomTag);
    if (!dish) {
        console.error(`Dish with unique random tag ${uniqueRandomTag} not found.`);
        return;
    }

    dish.hidden = !dish.hidden;
    dish.lastUpdated = getCurrentTimestamp();
    menuData.lastUpdated = getCurrentTimestamp();
    
    // Update the menu table
    populateMenuTable();
    
    // In a real app, you would save the data to the server here
    //saveMenuData();
}

// Updated toggleFeaturedStatus function
function toggleFeaturedStatus(uniqueRandomTag, categoryId) {
    const category = menuData.menu?.category?.find(c => c.categoryId === categoryId);
    if (!category) {
        console.error(`Category with ID ${categoryId} not found.`);
        return;
    }

    const dish = category.dish.find(d => d.uniqueRandomTag === uniqueRandomTag);
    if (!dish) {
        console.error(`Dish with unique random tag ${uniqueRandomTag} not found.`);
        return;
    }

    dish.selected = !dish.selected;
    dish.lastUpdated = getCurrentTimestamp();
    menuData.lastUpdated = getCurrentTimestamp();
    
    // Update the menu table
    populateMenuTable();
    
    // In a real app, you would save the data to the server here
    //saveMenuData();
}

// Function to filter menu items
function filterMenuItems() {
    const dishCategoryFilter = document.getElementById('dishCategoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const showHidden = document.getElementById('showHiddenItems').checked;

    document.querySelectorAll('#menuTable tbody tr').forEach(tr => {
        const dishCategory = tr.dataset.categoryId;
        const dishName = tr.cells[2].textContent.toLowerCase();
        const dishHidden = tr.querySelector('.toggle-hidden-dish i').classList.contains('bi-eye-slash');
        
        // Check category filter
        const categoryMatch = !dishCategoryFilter || dishCategory === dishCategoryFilter;
        
        // Check search term
        const searchMatch = !searchTerm || dishName.includes(searchTerm);
        
        // Check hidden status
        const hiddenMatch = showHidden || !dishHidden;
        
        // Show/hide row based on filters
        tr.style.display = categoryMatch && searchMatch && hiddenMatch ? '' : 'none';
    });
}

// Function to show import modal
function showImportModal() {
    bootstrap.Modal.getInstance(document.getElementById('importJsonModal')).show();
}

// Function to show confirmation modal
/*
function showConfirmationModal(message, onConfirm) {
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    document.getElementById('confirmationModalBody').textContent = message;

    const confirmButton = document.getElementById('confirmationModalConfirm');
    confirmButton.onclick = function () {
        confirmationModal.hide();
        onConfirm();
    };

    confirmationModal.show();
}
*/

// Updated importJson function to use confirmation modal
async function importJson() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (!file) {
        showInformationModal('Please select a JSON file to import.');
        return;
    }

    showConfirmationModal('Importing this JSON file will overwrite the current menu. Do you want to proceed?', async function () {
        try {
            // Check if menu.json exists on the server
            const response = await fetch('menu.json', { method: 'HEAD' });
            if (response.ok) {
                // Rename the existing menu.json file
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format date and time
                const renamedFile = `menu_backup_on_${timestamp}.json`;

                const renameResponse = await fetch('rename_menu.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldName: 'menu.json', newName: renamedFile }),
                });

                if (!renameResponse.ok) {
                    throw new Error('Failed to rename the existing menu.json file.');
                }
            }

            // Read and parse the new JSON file
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    // Validate the structure of the JSON file
                    if (!jsonData.menu || !Array.isArray(jsonData.menu.category)) {
                        throw new Error('Invalid JSON structure. Please ensure the file contains valid menu data.');
                    }

                    menuData = jsonData;

                    // Update the UI
                    availableMenuImages = getAllListedMenuImages();
                    populateCategoryFilters();
                    populateMenuTable();

                    // Save the data (optional, depending on your backend setup)
                    //saveMenuData();

                    // Hide modal and reset file input
                    bootstrap.Modal.getInstance(document.getElementById('importJsonModal')).hide();
                    fileInput.value = '';

                    showInformationModal('Menu data imported successfully!');
                } catch (error) {
                    showInformationModal('Error parsing JSON file: ' + error.message);
                }
            };
            reader.readAsText(file);
        } catch (error) {
            showInformationModal('An error occurred during the import process: ' + error.message);
        }
    });
}

// Updated exportJson function to use information modal
function exportJson() {
    if (!menuData || Object.keys(menuData).length === 0) {
        showInformationModal('No menu data available to export.');
        return;
    }

    // Convert menu data to JSON string
    const jsonStr = JSON.stringify(menuData, null, 2);

    // Create a Blob object with the JSON data
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'menu.json'; // Set the file name

    // Trigger the download
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(a.href);

    showInformationModal('Menu data exported successfully!');
}

// Function to update website menu
async function updateWebsiteMenu() {
    if (!menuData || Object.keys(menuData).length === 0) {
        showInformationModal('No menu data available to update.');
        return;
    }

    try {
        // Save the updated menu data
        const jsonStr = JSON.stringify(menuData, null, 2);
        const formData = new FormData();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        
        formData.append('jsonFile', blob, 'menu.json');
        const uploadResponse = await fetch('upload_json.php', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload the updated menu.json file.');
        }

        showInformationModal('Menu data updated successfully!');
        resetMenuChangeStatus();

        // Ensure admin panel is displayed
        document.querySelector('.modal-backdrop')?.remove(); // Remove dimmed overlay
        document.body.classList.remove('modal-open'); // Remove modal-open class
    } catch (error) {
        console.error('Error updating menu:', error);
        showInformationModal('Failed to update the website menu. Please check the server.');
    }
}

// Ensure the upload button is enabled and add event listener
document.addEventListener('DOMContentLoaded', function () {
    /**
     * ===== Menu Management Event Listeners =====
     */

    document.getElementById('addNewItem').addEventListener('click', function () {
        showAddMenuItemModal();
    });

    document.getElementById('saveMenuItem').addEventListener('click', function () {
        saveMenuItem();
    });

    /*
    document.getElementById('exportJson').addEventListener('click', function () {
        exportJson();
    });

    document.getElementById('importJson').addEventListener('click', function () {
        importJsonModal.show();
    });
*/
    document.getElementById('confirmImport').addEventListener('click', function () {
        importJson();
    });

    document.getElementById('updateWebsiteMenu').addEventListener('click', function () {
        showConfirmationModal('Are you sure you want to update the website menu? This will overwrite the current menu on the website.', function () {
            updateWebsiteMenu();
        });
    });

    

    /**
     * ===== Menu Filters =====
     */

    document.getElementById('dishCategoryFilter').addEventListener('change', function () {
        populateMenuTable();
    });

    document.getElementById('searchInput').addEventListener('input', function () {
        filterMenuItems();
    });

    document.getElementById('showHiddenItems').addEventListener('change', function () {
        filterMenuItems();
    });


    
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const fileInput = document.getElementById('imageUpload');

    if (uploadImageBtn && fileInput) {
        // Ensure the button is enabled
        uploadImageBtn.disabled = false;

        // Add event listener to the upload button
        uploadImageBtn.addEventListener('click', function () {
            // Trigger the hidden file input
            fileInput.click();
        });
    } else {
        console.error('Upload image button or file input not found.');
    }

    // Add event listener to the file input for handling uploads
    document.getElementById('imageUpload').addEventListener('change', handleMenuImageUpload);

    // Add event listener for the Delete button in the confirmation modal
    const confirmDeleteButton = document.getElementById('confirmDeleteDish');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function () {
            deleteMenuItem();
        });
    } else {
        console.error('Confirm Delete button not found.');
    }
});



