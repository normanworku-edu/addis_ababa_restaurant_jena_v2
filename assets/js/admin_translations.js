/**
 * ===== Global Variables =====
 */

let translationsData = {};
let isTranslationsChanged = false;
let sortState = {}; // Keeps track of the sorting state for each column

/**
 * Marks the translations as changed and enables the update button.
 */
function markTranslationsAsChanged() {
    isTranslationsChanged = true;
    const updateButton = document.getElementById('updateWebsiteTranslations');
    if (updateButton) {
        updateButton.disabled = false;
    }
}

/**
 * Resets the translations change status and disables the update button.
 */
function resetTranslationsChangedStatus() {
    isTranslationsChanged = false;
    const updateButton = document.getElementById('updateWebsiteTranslations');
    if (updateButton) {
        updateButton.disabled = true;
    }
}

/**
 * Loads translations data from the server.
 */
async function loadTranslationsData() {
    try {
        const response = await fetch('assets/translations/translations.json');
        if (!response.ok) throw new Error('Translations data not found');
        const data = await response.json();
        translationsData = data.translate || {};

        // Update UI
        populateTranslationsTable();
    } catch (error) {
        console.error('Error loading translations:', error);
        showInformationModal('Failed to load translations data. Please check the server.');
    }
}

/**
 * Populates the translations table with data.
 */
function populateTranslationsTable() {
    const tbody = document.querySelector('#translationsTable tbody');
    if (!tbody) {
        console.error('Translations table body not found.');
        return;
    }
    tbody.innerHTML = '';

    const keys = Object.keys(translationsData);
    if (keys.length === 0) {
        console.warn('No translations data available.');
        return;
    }

    keys.forEach((key, index) => {
        const translation = translationsData[key];
        const row = document.createElement('tr');
        row.dataset.key = key;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="editable" contenteditable="false">${translation.en || ''}</td>
            <td class="editable" contenteditable="false">${translation.de || ''}</td>
            <td class="editable" contenteditable="false">${translation.am || ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary toggle-edit">
                    <i class="bi bi-pencil"></i> Edit
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    setupEditButtons();
}

/**
 * Sets up the edit/save functionality for each row.
 */
function setupEditButtons() {
    const editButtons = document.querySelectorAll('.toggle-edit');
    if (!editButtons) {
        console.error('Edit buttons not found.');
        return;
    }

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const isEditing = row.classList.toggle('editing');

            row.querySelectorAll('.editable').forEach(cell => {
                cell.contentEditable = isEditing;
            });

            if (isEditing) {
                this.innerHTML = '<i class="bi bi-save"></i> Save';
                this.classList.replace('btn-outline-primary', 'btn-outline-success');
            } else {
                saveRow(row);
                markTranslationsAsChanged(); // Mark translations as changed after saving
                this.innerHTML = '<i class="bi bi-pencil"></i> Edit';
                this.classList.replace('btn-outline-success', 'btn-outline-primary');
            }
        });
    });
}

/**
 * Saves the edited row data back to the translationsData object.
 * @param {HTMLTableRowElement} row - The row being saved.
 */
function saveRow(row) {
    const key = row.dataset.key;
    const cells = row.querySelectorAll('.editable');

    if (translationsData[key]) {
        translationsData[key].en = cells[0].textContent.trim();
        translationsData[key].de = cells[1].textContent.trim();
        translationsData[key].am = cells[2].textContent.trim();
    }
}

/**
 * Sorts the translations data by a specific column.
 * @param {string} column - The column to sort by ('index', 'en', 'de', 'am').
 */
function sortTranslations(column) {
    const isAscending = sortState[column] !== true; // Toggle sorting state
    sortState[column] = isAscending;

    const sortedKeys = Object.keys(translationsData).sort((a, b) => {
        let valA, valB;

        if (column === 'index') {
            valA = Object.keys(translationsData).indexOf(a);
            valB = Object.keys(translationsData).indexOf(b);
        } else {
            valA = translationsData[a][column] || '';
            valB = translationsData[b][column] || '';
        }

        if (valA < valB) return isAscending ? -1 : 1;
        if (valA > valB) return isAscending ? 1 : -1;
        return 0;
    });

    // Rebuild translationsData with sorted keys
    const sortedData = {};
    sortedKeys.forEach(key => {
        sortedData[key] = translationsData[key];
    });
    translationsData = sortedData;

    populateTranslationsTable();
}

/**
 * Adds sorting functionality to table headers.
 */
function setupSorting() {
    const headers = document.querySelectorAll('#translationsTable thead th');
    if (!headers) {
        console.error('Table headers not found.');
        return;
    }

    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            switch (index) {
                case 0:
                    sortTranslations('index');
                    break;
                case 1:
                    sortTranslations('en');
                    break;
                case 2:
                    sortTranslations('de');
                    break;
                case 3:
                    sortTranslations('am');
                    break;
                default:
                    break;
            }
        });
    });
}

/**
 * Updates the translations data on the server.
 */
async function updateWebsiteTranslations() {
    if (!translationsData || Object.keys(translationsData).length === 0) {
        showInformationModal('No translations data available to update.');
        return;
    }

    try {
        const jsonStr = JSON.stringify({ translate: translationsData }, null, 2);
        const formData = new FormData();
        const blob = new Blob([jsonStr], { type: 'application/json' });

        formData.append('jsonFile', blob, 'translations.json');
        formData.append('upload_path', 'assets/translations'); // Pass the upload path

        const response = await fetch('upload_json.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            showInformationModal('Translations updated successfully!');
            resetTranslationsChangedStatus();
        } else {
            throw new Error(data.message || 'Failed to update translations');
        }
    } catch (error) {
        console.error('Error updating translations:', error);
        showInformationModal('Failed to update the website translations: ' + error.message);
    }
}

/**
 * Displays an information modal with a message.
 * @param {string} message - The message to display.
 */
if (typeof showInformationModal !== 'function') {
    function showInformationModal(message) {
        let modal = document.getElementById('informationModal');
        if (!modal) {
            // Create the modal dynamically if it doesn't exist
            modal = document.createElement('div');
            modal.id = 'informationModal';
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Information</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.textContent = message;
        }

        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
        bootstrapModal.show();
    }
}

/**
 * ===== Event Listeners =====
 */

document.addEventListener('DOMContentLoaded', function () {
    loadTranslationsData();
    setupSorting();

    const updateButton = document.getElementById('updateWebsiteTranslations');
    if (updateButton) {
        updateButton.addEventListener('click', updateWebsiteTranslations);
    } else {
        console.error('Update button not found.');
    }
});
