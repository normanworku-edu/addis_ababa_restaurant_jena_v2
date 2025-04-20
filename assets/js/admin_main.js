



/**
 * ===== Utility Functions =====
 */

/**
 * Generates a random string of specified length.
 * @param {number} n - Length of the random string.
 * @returns {string} Random string.
 */
function generateUniqueRandomTag(n) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

/**
 * Gets the current ISO timestamp.
 * @returns {string} ISO timestamp.
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

/**
 * ===== Authentication Functions =====
 */

/**
 * Checks if the admin is logged in.
 * @returns {boolean} Login status.
 */
function isAdminLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

/**
 * ===== Modal Functions =====
 */

/**
 * Translates text between languages.
 * @param {string} sourceId - Source element ID.
 * @param {string} targetId - Target element ID.
 * @param {string} targetLang - Target language code.
 */
async function translateField(sourceId, targetId, targetLang) {
    const sourceText = document.getElementById(sourceId).value;
    if (!sourceText) {
        showInformationModal('Please enter English text first.');
        return;
    }

    const targetElement = document.getElementById(targetId);
    const originalValue = targetElement.value;
    targetElement.value = 'Translating...';
    targetElement.disabled = true;

    try {
        const response = await fetch('translate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sourceText, targetLang })
        });

        const data = await response.json();
        targetElement.value = data.success ? data.translation : originalValue;
        if (!data.success) throw new Error(data.message || 'Translation failed');
    } catch (error) {
        console.error('Translation error:', error);
        showInformationModal('Translation failed: ' + error.message);
    } finally {
        targetElement.disabled = false;
    }
}

/**
 * ===== Initial Setup =====
 */

// Check login status and show the appropriate form
if (!isAdminLoggedIn() && window.location.hash.includes('#login')) {
    document.getElementById('login-form-container').style.display = 'block';
    document.querySelector('main.container').style.display = 'none';
}


/**
 * Shows a confirmation modal with a custom message and callback.
 * @param {string} message - The confirmation message.
 * @param {Function} onConfirm - Callback function to execute on confirmation.
 */
function showConfirmationModal(message, onConfirm) {
    // Check if the modal already exists
    let confirmationModalDiv = document.getElementById('confirmationModal');
    if (!confirmationModalDiv) {
        // Dynamically create the modal
        const modalHtml = `
            <!-- Confirmation Modal -->
            <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmationModalLabel">Confirmation</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="confirmationModalBody">
                            <!-- Confirmation message will be dynamically set -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmationModalConfirm">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        confirmationModalDiv = document.getElementById('confirmationModal');
    }

    // Set the modal message
    document.getElementById('confirmationModalBody').textContent = message;

    // Initialize the Bootstrap modal
    const confirmationModal = new bootstrap.Modal(confirmationModalDiv);

    // Add event listener for the confirm button
    const confirmButton = document.getElementById('confirmationModalConfirm');
    confirmButton.onclick = function () {
        confirmationModal.hide();
        onConfirm();
    };

    // Show the modal
    confirmationModal.show();
}

/**
 * Shows an information modal with a custom message.
 * @param {string} message - Message to display.
 */
function showInformationModal(message) {
    const informationModal = new bootstrap.Modal(document.getElementById('informationModal'), {
        backdrop: 'static'
    });

    informationModal._element.addEventListener('show.bs.modal', () => {
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop:last-child');
            if (backdrop) backdrop.classList.add('information-backdrop');
        }, 0);
    });

    document.getElementById('informationModalBody').textContent = message;
    informationModal.show();
}




// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    /**
     * ===== Login Form Handling =====
     */

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === 'admin' && password === 'password') {
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('login-form-container').style.display = 'none';
            document.querySelector('main.container').style.display = 'block';
        } else {
            showInformationModal('Invalid credentials');
        }
    });

    /**
     * ===== Translation Buttons Setup =====
     */

    document.querySelectorAll('.translate-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            translateField(this.dataset.source, this.dataset.target, this.dataset.lang);
        });
    });

    /**
     * ===== Modal Initialization =====
     */

    const menuItemModal = new bootstrap.Modal(document.getElementById('menuItemModal'));

    //const offersAndNewsItemModal = new bootstrap.Modal(document.getElementById('offersAndNewsItemModal'));
    const confirmDeleteDishModal = new bootstrap.Modal(document.getElementById('confirmDeleteDishModal'));
    // const importJsonModal = new bootstrap.Modal(document.getElementById('importJsonModal'));
    const informationModal = new bootstrap.Modal(document.getElementById('informationModal'));
    //const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    const galleryItemModal = new bootstrap.Modal(document.getElementById('galleryItemModal'));


    /**
     * ===== Modal Focus Reset =====
     */

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function () {
            document.activeElement.blur();
        });
    });




    /**
     * ===== Load Initial Data =====
     */

    loadMenuData();
    loadReviewsData();
    loadGalleryData();
    loadOffersAndNewsData();
    //populateAllergensAndAdditives();
});








