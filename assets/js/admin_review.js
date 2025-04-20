/**
 * Global State
 */
let reviewsData = {};
let currentReviewUniqueRandomTag = null;
let currentReviewCategoryId = null;
let isReviewsChanged = false;    
    
// Function to mark reviews as changed
function markReviewsAsChanged() {
    isReviewsChanged = true;
    document.getElementById('updateWebsiteReviews').disabled = false;
}

/**
 * Resets the reviews change status and disables the update button.
 */
function resetReviewsChangeStatus() {
    isReviewsChanged = false;
    document.getElementById('updateWebsiteReviews').disabled = true;
}

/**
 * Modal Management
 */

/**
 * Generates the HTML for the Review item modal.
 * @returns {string} Modal HTML.
 */

// Generate ReviewModal HTML 
function generateReviewModal() {
    return `
        <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reviewModalLabel">Add New Review</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="reviewForm">
                            <input type="hidden" id="reviewId">
                            <input type="hidden" id="reviewUniqueRandomTag">
                            <div class="col-md-6">
                                <label for="reviewCategorySelect" class="form-label">Category</label>
                                <select class="form-select" id="reviewCategorySelect" required>
                                    <!-- Categories will be populated by JavaScript -->
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="reviewRating" class="form-label">Rating (1-5)</label>
                                <input type="number" class="form-control" id="reviewRating" min="1" max="5" required>
                            </div>

                            <div class="mb-3">
                                <label for="reviewUrl" class="form-label">Review URL</label>
                                <input type="url" class="form-control" id="reviewUrl">
                            </div>
    
                            <!-- Multilingual Tabs -->
                            <ul class="nav nav-tabs" id="reviewLanguageTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="review-en-tab" data-bs-toggle="tab" data-bs-target="#review-en" type="button" role="tab" aria-controls="review-en" aria-selected="true">English</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="review-de-tab" data-bs-toggle="tab" data-bs-target="#review-de" type="button" role="tab" aria-controls="review-de" aria-selected="false">German</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="review-am-tab" data-bs-toggle="tab" data-bs-target="#review-am" type="button" role="tab" aria-controls="review-am" aria-selected="false">Amharic</button>
                                </li>
                            </ul>
                            <div class="tab-content" id="reviewLanguageTabContent">
                                <!-- English Tab -->
                                <div class="tab-pane fade show active" id="review-en" role="tabpanel" aria-labelledby="review-en-tab">
                                    <div class="mb-3">
                                        <label for="reviewerName_en" class="form-label">Reviewer Name (English)</label>
                                        <input type="text" class="form-control" id="reviewerName_en" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reviewText_en" class="form-label">Review Text (English)</label>
                                        <textarea class="form-control" id="reviewText_en" rows="3" required></textarea>
                                    </div>
                                </div>
                                <!-- German Tab -->
                                <div class="tab-pane fade" id="review-de" role="tabpanel" aria-labelledby="review-de-tab">
                                    <div class="mb-3">
                                        <label for="reviewerName_de" class="form-label">Reviewer Name (German)</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="reviewerName_de">
                                            <button class="btn btn-outline-secondary translate-btn" type="button" data-source="reviewerName_en" data-target="reviewerName_de" data-lang="de">
                                                <i class="bi bi-translate"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reviewText_de" class="form-label">Review Text (German)</label>
                                        <div class="input-group">
                                            <textarea class="form-control" id="reviewText_de" rows="3"></textarea>
                                            <button class="btn btn-outline-secondary translate-btn" type="button" data-source="reviewText_en" data-target="reviewText_de" data-lang="de">
                                                <i class="bi bi-translate"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- Amharic Tab -->
                                <div class="tab-pane fade" id="review-am" role="tabpanel" aria-labelledby="review-am-tab">
                                    <div class="mb-3">
                                        <label for="reviewerName_am" class="form-label">Reviewer Name (Amharic)</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="reviewerName_am">
                                            <button class="btn btn-outline-secondary translate-btn" type="button" data-source="reviewerName_en" data-target="reviewerName_am" data-lang="am">
                                                <i class="bi bi-translate"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reviewText_am" class="form-label">Review Text (Amharic)</label>
                                        <div class="input-group">
                                            <textarea class="form-control" id="reviewText_am" rows="3"></textarea>
                                            <button class="btn btn-outline-secondary translate-btn" type="button" data-source="reviewText_en" data-target="reviewText_am" data-lang="am">
                                                <i class="bi bi-translate"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="reviewDate" class="form-label">Review Date</label>
                                <input type="date" class="form-control" id="reviewDate" required>
                            </div>
                            <!-- hidden and selected Checkboxes -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="reviewHidden">
                                        <label class="form-check-label" for="reviewHidden">Hidden from review</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="reviewSelected">
                                        <label class="form-check-label" for="reviewSelected">Featured item</label>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveReviewItem">Save</button>
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
 * Loads reviews data from the server.
 */
// Add error handling for reviews.json fetch
async function loadReviewsData() {
    try {
        const response = await fetch('assets/json/reviews.json'); // Updated path
        if (!response.ok) throw new Error('Reviews data not found');
        reviewsData = await response.json();
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsData = { reviews: { category: [] } }; // Fallback to an empty structure
    }

    populateReviewCategoryFilters();
    populateReviewsTable();
}

// Function to populate review category filters
function populateReviewCategoryFilters() {
    const reviewCategoryFilter = document.getElementById('reviewCategoryFilter');
    const reviewCategorySelect = document.getElementById('reviewCategorySelect'); // Ensure unique ID

    // modify the following from reviews to review

    if (!reviewCategoryFilter || !reviewCategorySelect) {
        console.error('Category filter or select element not found.');
        return;
    }

    // Clear existing options
    reviewCategoryFilter.innerHTML = '<option value="">All Categories</option>';
    reviewCategorySelect.innerHTML = '';

    // Add options for each category
    reviewsData.reviews.category.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryId;
        option.textContent = category.name.en;
        reviewCategoryFilter.appendChild(option);

        // Append the same option to both dropdowns
        reviewCategoryFilter.appendChild(option.cloneNode(true));
        reviewCategorySelect.appendChild(option);
    });

}
/**
 * Populates the reviews table in the UI.
 */
// Function to populate the reviews table
function populateReviewsTable() {
    const tbody = document.querySelector('#reviewsTable tbody');
    tbody.innerHTML = '';
    const selectedCategory = document.getElementById('reviewCategoryFilter').value;
    const showHidden = document.getElementById('showHiddenReviews').checked;

        // display selectedCategory using show information modal
       // showInformationModal(`Selected review Category: ${selectedCategory}`);

    let reviewCount = 1;

    reviewsData.reviews.category.forEach(category => {
        if (!selectedCategory || category.categoryId === selectedCategory) {
            category.review.forEach(review => {
                if (showHidden || !review.hidden) {
        const tr = document.createElement('tr');
                    tr.dataset.uniqueRandomTag = review.uniqueRandomTag;
                    tr.dataset.categoryId = category.categoryId;

                    const actions = `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary edit-review" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger delete-review" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary toggle-hidden-review" title="${review.hidden ? 'Show' : 'Hide'}">
                                <i class="bi bi-eye${review.hidden ? '-slash' : ''}"></i>
                            </button>
                            <button type="button" class="btn btn-outline-success toggle-featured-review" title="${review.selected ? 'Remove featured' : 'Make featured'}">
                                <i class="bi bi-star${review.selected ? '-fill' : ''}"></i>
                            </button>
                        </div>
                    `;

                    tr.innerHTML = `
                        <td>${reviewCount++}</td>
                        <td>${review.name.en}</td>
                        <td>${review.rating}</td>
                        <td>${review.comment.en}</td>
                        <td>${actions}</td>
                    `;

                    tbody.appendChild(tr);
                }
            });
        }
    });

    setupReviewActionButtons();
}

// Function to handle action buttons in the reviews table
function setupReviewActionButtons() {
    document.querySelectorAll('.edit-review').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            editReview(uniqueRandomTag, categoryId);
        });
    });

    document.querySelectorAll('.delete-review').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            currentReviewUniqueRandomTag = tr.dataset.uniqueRandomTag;
            currentReviewCategoryId = tr.dataset.categoryId;
            bootstrap.Modal.getInstance(document.getElementById('confirmDeleteReviewModal')).show();

            //showConfirmationModal('Are you sure you want to delete this review?', deleteReview);
        });
    });

    document.querySelectorAll('.toggle-hidden-review').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            toggleHiddenReview(uniqueRandomTag, categoryId);
            populateReviewsTable();
        });
    });

    document.querySelectorAll('.toggle-featured-review').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            const uniqueRandomTag = tr.dataset.uniqueRandomTag;
            const categoryId = tr.dataset.categoryId;
            toggleFeaturedReview(uniqueRandomTag, categoryId);
            populateReviewsTable();
        });
    });
}

// Add event listener for category dropdown changes
document.getElementById('reviewCategoryFilter').addEventListener('change', async function () {
    populateReviewsTable(); // Repopulate review table based on selected category
});

// Function to toggle hidden status for a review
function toggleHiddenReview(uniqueRandomTag, categoryId) {
    const category = reviewsData.reviews.category.find(c => c.categoryId === categoryId);
    const review = category.review.find(r => r.uniqueRandomTag === uniqueRandomTag);

    if (review) {
        review.hidden = !review.hidden;
        review.lastUpdated = getCurrentTimestamp();
        reviewsData.lastUpdated = getCurrentTimestamp();

        // Update the reviews table
        populateReviewsTable();

        // Mark reviews as changed
        markReviewsAsChanged();

        // Save the updated reviews data (optional, depending on your backend setup)
        //saveReviewsData();
    }
}

// Function to toggle featured status for a review
function toggleFeaturedReview(uniqueRandomTag, categoryId) {
    const category = reviewsData.reviews.category.find(c => c.categoryId === categoryId);
    const review = category.review.find(r => r.uniqueRandomTag === uniqueRandomTag);

    if (review) {
        review.selected = !review.selected;
        review.lastUpdated = getCurrentTimestamp();
        reviewsData.lastUpdated = getCurrentTimestamp();

        // Update the reviews table
        populateReviewsTable();

        // Mark reviews as changed
        markReviewsAsChanged();

        // Save the updated reviews data (optional, depending on your backend setup)
        //saveReviewsData();
    }
}

// Updated deleteReviewItem function
function deleteReviewItem() {
    // Validate current IDs
    if (!currentReviewCategoryId) {
        console.error('No review category ID specified for deletion.');
        return;
    }
    if (!currentReviewUniqueRandomTag) {
        console.error('No review unique random tag specified for deletion.');
        return;
    }

    // Find the category
    const category = reviewsData.reviews?.category?.find(c => c.categoryId === currentReviewCategoryId);
    if (!category) {
        console.error(`Category with ID ${currentReviewCategoryId} not found.`);
        return;
    }

    // Remove the review
    const initialReviewCount = category.review.length;
    category.review = category.review.filter(r => r.uniqueRandomTag !== currentReviewUniqueRandomTag);

    if (category.review.length === initialReviewCount) {
        console.warn(`Review with unique random tag ${currentReviewUniqueRandomTag} not found in category ${currentReviewCategoryId}.`);
    } else {
        console.log(`Review with unique random tag ${currentReviewUniqueRandomTag} deleted successfully.`);
    }

    // mark as changed
    markReviewsAsChanged();
    // Update the review table
    populateReviewsTable();

    // Save the updated data to the server
    //saveReviewData();

    // Hide modal
    const modal = document.getElementById('confirmDeleteReviewModal');
    if (confirmDeleteReviewModal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
    } else {
        console.warn('Confirmation modal not found.');
    }

    // Reset current IDs
    currentReviewUniqueRandomTag = null;
    currentReviewCategoryId = null;
}



// Placeholder for saving reviews data
function saveReviewsData() {
    // console.log('Saving reviews data...');
    // Implement the actual save logic here, e.g., sending data to the server via AJAX
}

// Function to show the Add Review modal
function showAddReviewModal() {
    const modal = document.getElementById('reviewModal');
    const modalTitle = document.getElementById('reviewModalLabel');
    const form = document.getElementById('reviewForm');

    // Reset form
    form.reset();
    document.getElementById('reviewUniqueRandomTag').value = '';
    document.getElementById('reviewUrl').value = '';
    document.getElementById('reviewId').value = '';

    // Set modal title
    modalTitle.textContent = 'Add New Review';

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}

// Function to edit a review with multilingual support
function editReview(uniqueRandomTag, categoryId) {
    const modal = document.getElementById('reviewModal');
    const modalTitle = document.getElementById('reviewModalLabel');
    const form = document.getElementById('reviewForm');

    // Find the category and review
    const category = reviewsData.reviews.category.find(c => c.categoryId === categoryId);
    if (!category) {
        showInformationModal('Category not found.');
        return;
    }

    const review = category.review.find(r => r.uniqueRandomTag === uniqueRandomTag);
    if (!review) {
       showInformationModal('Review not found.');
        return;
    }

    // Display category and review info
    // showInformationModal(`Category: ${category.name.en}, Review: ${review.name.en}`);

    // Set modal title
    modalTitle.textContent = `Edit Review by ${review.name.en}`;

    // Populate form fields for all languages
    document.getElementById('reviewCategorySelect').value = categoryId;
    document.getElementById('reviewUniqueRandomTag').value = uniqueRandomTag;
    document.getElementById('reviewId').value = review.id;
    document.getElementById('reviewRating').value = review.rating;
    document.getElementById('reviewUrl').value = review.url || '';

    // Populate multilingual fields
    document.getElementById('reviewerName_en').value = review.name.en || '';
    document.getElementById('reviewerName_de').value = review.name.de || '';
    document.getElementById('reviewerName_am').value = review.name.am || '';

    document.getElementById('reviewText_en').value = review.comment.en || '';
    document.getElementById('reviewText_de').value = review.comment.de || '';
    document.getElementById('reviewText_am').value = review.comment.am || '';

    // Set date
    document.getElementById('reviewDate').value = review.date;

    // Set checkboxes
    document.getElementById('reviewHidden').checked = review.hidden;
    document.getElementById('reviewSelected').checked = review.selected;

    // Show modal
    bootstrap.Modal.getInstance(modal).show();
}

// Function to save a review (handles both adding and editing reviews)
function saveReviewItem() {
    const uniqueRandomTag = document.getElementById('reviewUniqueRandomTag').value;
    const reviewId = document.getElementById('reviewId').value;
    const isNew = !uniqueRandomTag;

    const reviewCategorySelect = document.getElementById('reviewCategorySelect');
    const categoryId = reviewCategorySelect ? reviewCategorySelect.value : reviewsData.reviews.category[0]?.categoryId;

    


    if (!categoryId) {
        showInformationModal('No category selected or available.');
        return;
    }

    // Find the category
    const category = reviewsData.reviews.category.find(c => c.categoryId === categoryId);

    if (!category) {
        showInformationModal('Invalid category selected.');
        return;
    }

    const timestamp = getCurrentTimestamp();

    // Create or update the review
    const review = {
        id: isNew ? 'NA' : reviewId,
        uniqueRandomTag: isNew ? generateUniqueRandomTag(10) : uniqueRandomTag,
        name: {
            en: document.getElementById('reviewerName_en').value,
            de: document.getElementById('reviewerName_de').value,
            am: document.getElementById('reviewerName_am').value,
        },
        comment: {
            en: document.getElementById('reviewText_en').value,
            de: document.getElementById('reviewText_de').value,
            am: document.getElementById('reviewText_am').value,
        },
        rating: document.getElementById('reviewRating').value,
        url: document.getElementById('reviewUrl').value,
        hidden: document.getElementById('reviewHidden').checked,
        selected: document.getElementById('reviewSelected').checked,
        lastUpdated: timestamp,
        date: document.getElementById('reviewDate').value,
    };

    if (isNew) {
        category.review.push(review);
    } else {
        const existingReviewIndex = category.review.findIndex(r => r.uniqueRandomTag === uniqueRandomTag);
        if (existingReviewIndex !== -1) {
            category.review[existingReviewIndex] = review;
        }
    }

    reviewsData.lastUpdated = timestamp;

    // Close modal and refresh the reviews table
    bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
    populateReviewsTable();

    // Mark reviews as changed
    markReviewsAsChanged();

    // Save the updated reviews data (optional, depending on your backend setup)
    //saveReviewsData();
}

// Function to update website reviews
async function updateWebsiteReviews() {
    if (!reviewsData || Object.keys(reviewsData).length === 0) {
        showInformationModal('No reviews data available to update.');
        return;
    }

    try {
        // Save the updated reviews data
        const jsonStr = JSON.stringify(reviewsData, null, 2);
        const formData = new FormData();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        
        formData.append('jsonFile', blob, 'reviews.json');
        const uploadResponse = await fetch('upload_json.php', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload the updated reviews.json file.');
        }

        showInformationModal('Reviews data updated successfully!');
        resetReviewsChangeStatus();

        // Ensure admin panel is displayed
        document.querySelector('.modal-backdrop')?.remove(); // Remove dimmed overlay
        document.body.classList.remove('modal-open'); // Remove modal-open class
    } catch (error) {
        console.error('Error updating reviews:', error);
        showInformationModal('Failed to update the website reviews. Please check the server.');
    }
}

// Updated exportReviewsJson function
function exportReviewsJson() {
    if (!reviewsData || Object.keys(reviewsData).length === 0) {
        showInformationModal('No reviews data available to export.');
        return;
    }

    // Convert reviews data to JSON string
    const jsonStr = JSON.stringify(reviewsData, null, 2);

    // Create a Blob object with the JSON data
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reviews.json'; // Set the file name

    // Trigger the download
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(a.href);

    showInformationModal('Reviews data exported successfully!');
}

// Updated importReviewsJson function
async function importReviewsJson() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (!file) {
        showInformationModal('Please select a JSON file to import.');
        return;
    }

    showConfirmationModal('Importing this JSON file will overwrite the current reviews. Do you want to proceed?', async function () {
        try {
            // Check if reviews.json exists on the server
            const response = await fetch('reviews.json', { method: 'HEAD' });
            if (response.ok) {
                // Rename the existing reviews.json file
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format date and time
                const renamedFile = `reviews_backup_on_${timestamp}.json`;

                const renameResponse = await fetch('rename_reviews.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldName: 'reviews.json', newName: renamedFile }),
                });

                if (!renameResponse.ok) {
                    throw new Error('Failed to rename the existing reviews.json file.');
                }
            }

            // Read and parse the new JSON file
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    // Validate the structure of the JSON file
                    if (!jsonData.reviews || !Array.isArray(jsonData.reviews.category)) {
                        throw new Error('Invalid JSON structure. Please ensure the file contains valid reviews data.');
                    }

                    reviewsData = jsonData;

                    // Update the UI
                    populateReviewCategoryFilters();
                    populateReviewsTable();

                    // Save the data (optional, depending on your backend setup)
                    saveReviewsData();

                    // Hide modal and reset file input
                    bootstrap.Modal.getInstance(document.getElementById('importJsonModal')).hide();
                    fileInput.value = '';

                    showInformationModal('Reviews data imported successfully!');
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






//  add event listener
document.addEventListener('DOMContentLoaded', function () {

    /**
     * ===== Review Management Event Listeners =====
     */

    document.getElementById('addNewReview').addEventListener('click', function () {
        showAddReviewModal();
    });

    document.getElementById('saveReviewItem').addEventListener('click', function () {
        saveReviewItem();
    });

    /*
    document.getElementById('exportReviewsJson').addEventListener('click', function () {
        exportReviewsJson();
    });

    document.getElementById('importReviewsJson').addEventListener('click', function () {
        importJsonModal.show();
        document.getElementById('confirmImport').onclick = importReviewsJson;
    });
*/
    document.getElementById('updateWebsiteReviews').addEventListener('click', function () {
        showConfirmationModal('Are you sure you want to update the website reviews? This will overwrite the current reviews on the website.', function () {
            updateWebsiteReviews();
        });
    });

    document.getElementById('reviewCategoryFilter').addEventListener('change', function () {
        populateReviewsTable();
    });

    document.getElementById('reviewSearchInput').addEventListener('input', function () {
        populateReviewsTable();
    });

    document.getElementById('showHiddenReviews').addEventListener('change', function () {
        populateReviewsTable();
    });


    // Add event listener for the Delete button in the confirmation modal
    const confirmDeleteButton = document.getElementById('confirmDeleteReview');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function () {
            deleteReviewItem();
        });
    } else {
        console.error('Confirm Delete button not found.');
    }


});
