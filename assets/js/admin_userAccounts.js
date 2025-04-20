let userAccountsData = null;
// Store uploaded icon paths for new social media
let newUserAccountsIcons = {};

let isUserAccountsChanged = false;
/**
 * Marks the UserAccounts as changed and enables the update button.
 */
function markUserAccountsAsChanged() {
    isUserAccountsChanged = true;
    document.getElementById('updateWebsiteUserAccounts').disabled = false;
}

/**
 * Resets the UserAccounts change status and disables the update button.
 */
function resetUserAccountsChangedStatus() {
    isUserAccountsChanged = false;
    document.getElementById('updateWebsiteUserAccounts').disabled = true;
}

// Fetch contact info from the JSON file
async function fetchUserAccounts() {
    try {
        const response = await fetch('assets/json/userAccounts.json'); // Updated path
        if (!response.ok) {
            throw new Error(`Failed to fetch contact info: ${response.status}`);
        }
        userAccountsData = await response.json();
        populateUserAccountsForm(userAccountsData);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        showInformationModal('Failed to fetch user accounts data. Please try again.');
    }
}

// Populate the form with contact info
function populateUserAccountsForm(userAccountsData) {
    const userAccountsContainer = document.getElementById('userAccountsContainer');
    userAccountsContainer.innerHTML = '';
    for (const [userName, details] of Object.entries(userAccountsData.userAccounts)) {
        const userAccountsCard = document.createElement('div');
        userAccountsCard.className = 'col-md-12 col-lg-6 mb-3';
        userAccountsCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body position-relative">
                    <div class="btn-group position-absolute top-0 end-0 m-2" role="group">
                        <button type="button" class="btn btn-outline-primary py-1 px-3 toggle-user-account-edit-save" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary py-1 px-3 toggle-user-account-blocked" title="${details.isBlocked ? 'Show' : 'Hide'}">
                            <i class="bi bi-eye${details.isBlocked ? '-slash' : ''}"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger py-1 px-3 delete-user-account" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">User Name</label>
                        <input type="text" class="form-control user-name" value="${userName}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control user-password" value="${details.password}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">User Email</label>
                        <input type="email" class="form-control user-email" value="${details.userEmail}" disabled>
                    </div>
                </div>
            </div>
        `;

        // Add event listener for edit/save toggle
        userAccountsCard.querySelector('.toggle-user-account-edit-save').addEventListener('click', function () {
            toggleUserAccountsEditSaveMode(this, userName);
        });

        // Add event listener for hide/view toggle
        userAccountsCard.querySelector('.toggle-user-account-blocked').addEventListener('click', function () {
            toggleUserAccountsVisibility(this, userName);
        });

        // Add event listener for delete action
        userAccountsCard.querySelector('.delete-user-account').addEventListener('click', function () {
                deleteUserAccounts(userName);
        });

        userAccountsContainer.appendChild(userAccountsCard);
    }
}

function deleteUserAccounts(userName) {
    const userDetails = userAccountsData.userAccounts[userName];

    // Check if the user is a superadmin
    if (userDetails.isSuperAdmin) {
        showInformationModal('Superadmin accounts cannot be deleted.');
        return;
    }

    // Check if the user is the last account
    const totalAccounts = Object.keys(userAccountsData.userAccounts).length;
    if (totalAccounts === 1) {
        showInformationModal('The last user account cannot be deleted.');
        return;
    }

    // Check if the user is the last admin account
    const adminAccounts = Object.values(userAccountsData.userAccounts).filter(user => user.isAdmin);
    if (userDetails.isAdmin && adminAccounts.length === 1) {
        showInformationModal('The last admin account cannot be deleted.');
        return;
    }

    // Confirm deletion
    showConfirmationModal(`Are you sure you want to delete ${userName}?`, () => {
        delete userAccountsData.userAccounts[userName];
        populateUserAccountsForm(userAccountsData);
        markUserAccountsAsChanged();
    });
}

function toggleCardEditSaveMode(button, card, userName) {
    const isEditing = button.classList.contains('editing');
    const userNameInput = card.querySelector('.user-name');
    const passwordInput = card.querySelector('.user-password');
    const userEmailInput = card.querySelector('.user-email');

    if (isEditing) {
        // Save mode
        button.innerHTML = '<i class="bi bi-pencil"></i>'; // Change to edit icon
        button.title = 'Edit';
        button.classList.remove('editing');
        userNameInput.disabled = true;
        passwordInput.disabled = true;
        userEmailInput.disabled = true;

        // Save changes to userAccountsData
        const newUserName = userNameInput.value.trim();
        const newPassword = passwordInput.value.trim();
        const newUserEmail = userEmailInput.value.trim();

        if (newUserName && newPassword) {
            if (newUserName !== userName) {
                delete userAccountsData.userAccounts[userName];
            }
            userAccountsData.userAccounts[newUserName] = {
                password: newPassword,
                userEmail: newUserEmail,
                isBlocked: userAccountsData.userAccounts[userName]?.isBlocked || false,
                isSuperAdmin:  userAccountsData.userAccounts[newUserName]?.isSuperAdmin || false
            };
            markUserAccountsAsChanged();
        } else {
            showInformationModal('User Name and Password fields cannot be empty.');
        }
    } else {
        // Edit mode
        button.innerHTML = '<i class="bi bi-save"></i>'; // Change to save icon
        button.title = 'Save';
        button.classList.add('editing');
        userNameInput.disabled = false;
        passwordInput.disabled = false;
        userEmailInput.disabled = false;
    }
}

function toggleUserAccountsVisibility(button, userName) {
    const isBlocked = button.querySelector('i').classList.contains('bi-eye-slash');
    button.querySelector('i').classList.toggle('bi-eye', isBlocked);
    button.querySelector('i').classList.toggle('bi-eye-slash', !isBlocked);
    button.title = isBlocked ? 'Hide' : 'Show';
    userAccountsData.userAccounts[userName].isBlocked = !isBlocked;
    markUserAccountsAsChanged();
}


function toggleUserAccountsEditSaveMode(button, userName) {
    AddOrEditUserAccounts(userName);
}

// Add or Edit User Accounts
function AddOrEditUserAccounts(userName = '') {
    // Create and display the modal
    const modalHtml = `
        <div class="modal fade" id="addOrEditUserAccountsModal" tabindex="-1" aria-labelledby="addOrEditUserAccountsModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addOrEditUserAccountsModalLabel">${userName ? 'Edit User Account' : 'Add New User Account'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="userAccountsForm" novalidate>
                            <div class="mb-3">
                                <label class="form-label">User Name <span class="text-danger">*</span></label>
                                <input type="text" id="newUserAccountsName" class="form-control" required pattern="^[a-zA-Z0-9_]{3,20}$" title="User name must be 3-20 characters long and can only contain letters, numbers, and underscores.">
                                <div class="invalid-feedback">User name must be 3-20 characters long and can only contain letters, numbers, and underscores.</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="text" id="newUserAccountsPassword" class="form-control" required pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$" title="Password must be at least 6 characters long and contain at least one letter and one number.">
                                    <button type="button" class="btn btn-outline-secondary btn-sm align-items-center d-flex" id="togglePasswordVisibility">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                                <div class="invalid-feedback">Password must be at least 6 characters long and contain at least one letter and one number.</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">User Email <span class="text-danger">*</span></label>
                                <input type="email" id="newUserAccountsEmail" class="form-control" required pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" title="Please enter a valid email address.">
                                <div class="invalid-feedback">Please enter a valid email address.</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveNewUserAccountsBtn">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listener for password visibility toggle
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('#togglePasswordVisibility')) {
            const passwordInput = document.getElementById('newUserAccountsPassword');
            const icon = event.target.closest('#togglePasswordVisibility').querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        }
    });

    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Initialize Bootstrap modal
    const addOrEditUserAccountsModal = new bootstrap.Modal(document.getElementById('addOrEditUserAccountsModal'));
    addOrEditUserAccountsModal.show();

    // Get form and input elements
    const form = document.getElementById('userAccountsForm');
    const nameInput = document.getElementById('newUserAccountsName');
    const passwordInput = document.getElementById('newUserAccountsPassword');
    const emailInput = document.getElementById('newUserAccountsEmail');

    // If userName is provided, populate fields with existing data
    if (userName && userAccountsData.userAccounts[userName]) {
        const userData = userAccountsData.userAccounts[userName];
        nameInput.value = userName;
        passwordInput.value = userData.password;
        emailInput.value = userData.userEmail;
    } else {
        // If userName is not provided, clear fields
        nameInput.value = '';
        passwordInput.value = '';
        emailInput.value = '';
    }

    // Handle save button click
    document.getElementById('saveNewUserAccountsBtn').addEventListener('click', function () {
        // Manually trigger validation
        nameInput.classList.add('was-validated');
        passwordInput.classList.add('was-validated');
        emailInput.classList.add('was-validated');
        
        // Check validity of each field
        const isNameValid = nameInput.checkValidity();
        const isPasswordValid = passwordInput.checkValidity();
        const isEmailValid = emailInput.checkValidity();
        
        if (!isNameValid || !isPasswordValid || !isEmailValid) {
            // If any field is invalid, show error messages and return
            form.classList.add('was-validated');
            return;
        }

        const newUserName = nameInput.value.trim();
        const password = passwordInput.value.trim();
        const userEmail = emailInput.value.trim();

        let isSuperAdmin = false;

        if (userName) {
            // If editing an existing user
            isSuperAdmin = userAccountsData.userAccounts[userName]?.isSuperAdmin || false; // Preserve isSuperAdmin
            if (newUserName !== userName) {
                if (userAccountsData.userAccounts[newUserName]) {
                    showInformationModal('Username already exists. Please choose a different username.');
                    return;
                }
                // If changing username, remove old entry
                delete userAccountsData.userAccounts[userName];
            }
        } else {
            // If adding a new user
            if (!newUserName) {
                showInformationModal('Username cannot be empty. Please provide a username.');
                return;
            }
            if (userAccountsData.userAccounts[newUserName]) {
                showInformationModal('Username already exists. Please choose a different username.');
                return;
            }
        }

        // Update userAccountsData
        userAccountsData.userAccounts[newUserName] = {
            password,
            userEmail,
            isBlocked: userAccountsData.userAccounts[newUserName]?.isBlocked || false,
            isSuperAdmin: isSuperAdmin // Ensure isSuperAdmin is preserved or initialized
        };

        populateUserAccountsForm(userAccountsData);
        markUserAccountsAsChanged();

        // Hide and remove the modal
        addOrEditUserAccountsModal.hide();
        document.getElementById('addOrEditUserAccountsModal').remove();
    });

    // Add input event listeners for real-time validation
    [nameInput, passwordInput, emailInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });
}



document.getElementById('addUserAccountsBtn').addEventListener('click', async function () {
    // Show modal for adding new user account
    AddOrEditUserAccounts();
})

// Save contact info
document.getElementById('updateWebsiteUserAccounts').addEventListener('click', async function () {
    showConfirmationModal(
        'You are about to overwrite the user accounts data on the server. This action cannot be undone. Do you want to proceed?',
        async function () {
            // Update user accounts data
            document.querySelectorAll('#userAccountsContainer .card').forEach(card => {
                const userNameInput = card.querySelector('.user-name').value.trim();
                const passwordInput = card.querySelector('.user-password').value.trim();
                const userEmailInput = card.querySelector('.user-email').value.trim();
                const isBlocked = card.querySelector('.toggle-user-account-blocked i').classList.contains('bi-eye-slash');

                if (userNameInput && passwordInput) {
                    // Preserve existing isSuperAdmin value
                    const isSuperAdmin = userAccountsData.userAccounts[userNameInput]?.isSuperAdmin || false;

                    userAccountsData.userAccounts[userNameInput] = {
                        password: passwordInput,
                        userEmail: userEmailInput,
                        isBlocked: isBlocked,
                        isSuperAdmin: isSuperAdmin // Preserve isSuperAdmin
                    };
                }
            });

            // Update lastUpdated field
            userAccountsData.lastUpdated = getCurrentTimestamp();

            // Convert userAccountsData to pretty JSON
            const jsonData = JSON.stringify(userAccountsData, null, 4);
            const formData = new FormData();
            formData.append('jsonFile', new Blob([jsonData], { type: 'application/json' }), 'userAccounts.json');
            formData.append('upload_path', 'assets/json/'); // Updated path

            try {
                // Upload userAccounts.json to the server
                const response = await fetch('upload_json.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showInformationModal('User accounts data updated successfully!');
                    resetUserAccountsChangedStatus();
                } else {
                    throw new Error('Failed to update user accounts data.');
                }
            } catch (error) {
                console.error('Error uploading user accounts data:', error);
                showInformationModal('Failed to update user accounts data. Please try again.');
            }
        }
    );
});

// Fetch and display contact info on page load
fetchUserAccounts();
