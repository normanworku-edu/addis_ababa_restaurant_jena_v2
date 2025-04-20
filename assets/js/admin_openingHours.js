let openingHoursData = null; // Store the opening hours data globally
let isOpeningHoursChanged = false;
/**
 * Marks the OpeningHours as changed and enables the update button.
 */
function markOpeningHoursAsChanged() {
    isOpeningHoursChanged = true;
    document.getElementById('updateWebsiteOpeningHours').disabled = false;
}

/**
 * Resets the OpeningHours change status and disables the update button.
 */
function resetOpeningHoursChangedStatus() {
    isOpeningHoursChanged = false;
    document.getElementById('updateWebsiteOpeningHours').disabled = true;
}

const openingTimesTable = document.getElementById('openingTimesTable');

// Fetch opening hours from the JSON file
async function fetchOpeningHours() {
    try {
        const response = await fetch('assets/json/openingHours.json'); // Updated path
        if (!response.ok) {
            throw new Error(`Failed to fetch opening hours: ${response.status}`);
        }
        openingHoursData = await response.json();
        populateOpeningTimesTable(openingHoursData.days);
    } catch (error) {
        console.error('Error fetching opening hours:', error);
    }
}

// Populate the table with opening hours
function populateOpeningTimesTable(days) {
    days.forEach(({ name, openingHours, isClosed }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${name.en}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="opening-times-container flex-grow-1">
                        ${isClosed || openingHours.length === 0
                ? '<span class="text-muted">Closed</span>'
                : openingHours
                    .map(
                        time =>
                            `<span class="badge bg-success me-2 mb-2 d-inline-flex align-items-center">
                                                  ${time}
                                                  <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
                                              </span>`
                    )
                    .join('')
            }
                    </div>
                    <button class="btn btn-sm btn-outline-primary ms-2 add-opening-time-btn" data-day="${name.en}" data-bs-toggle="modal" data-bs-target="#openingTimeModal">
                        <i class="bi bi-plus-circle"></i> Add Opening Hour
                    </button>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger mark-closed-btn" data-day="${name.en}">
                    <i class="bi bi-x-circle"></i> Mark Closed
                </button>
            </td>
        `;
        openingTimesTable.appendChild(row);
    });

    attachEventListeners();
}

// Attach event listeners to dynamically added buttons
function attachEventListeners() {
    document.querySelectorAll('.add-opening-time-btn').forEach(button => {
        button.addEventListener('click', function () {
            currentDay = this.getAttribute('data-day');
        });
    });

    document.querySelectorAll('.mark-closed-btn').forEach(button => {
        button.addEventListener('click', function () {
            const day = this.getAttribute('data-day');
            const openingTimesContainer = [...openingTimesTable.querySelectorAll('tr')].find(row => row.querySelector('.mark-closed-btn').getAttribute('data-day') === day).querySelector('.opening-times-container');
            openingTimesContainer.innerHTML = '<span class="text-muted">Closed</span>'; // Clear all opening times and set to "Closed"

            // Update openingHoursData
            const dayData = openingHoursData.days.find(d => d.name.en === day);
            dayData.openingHours = [];
            dayData.isClosed = true;

            markOpeningHoursAsChanged(); // Mark as changed
        });
    });

    document.querySelectorAll('.btn-close').forEach(button => {
        button.addEventListener('click', function () {
            const badge = this.parentElement;
            const container = badge.parentElement;
            const timeRange = badge.textContent.trim().split('\n')[0];
            badge.remove();

            // Update openingHoursData
            const day = container.closest('tr').querySelector('td strong').textContent;
            const dayData = openingHoursData.days.find(d => d.name.en === day);
            dayData.openingHours = dayData.openingHours.filter(time => time !== timeRange);

            if (!container.querySelector('.badge')) {
                container.innerHTML = '<span class="text-muted">Closed</span>'; // Set to "Closed" if no badges remain
                dayData.isClosed = true;
            }

            markOpeningHoursAsChanged(); // Mark as changed
        });
    });
}

// Fetch and display opening hours on page load
fetchOpeningHours();

//-- Initialize flatpickr with dropdown time selectors --
flatpickr("#fromTime, #toTime", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",       // 24-hour format (e.g., "14:30")
    time_24hr: true,           // Force 24-hour UI (no AM/PM)
    allowInput: true,          // Allow manual typing
    defaultHour: 17,            // Default to  (17:00)
    defaultMinute: 0,           // Default to 0 minutes (17:00)
    minuteIncrement: 5,        // Step minutes by 1 (default)
    hourIncrement: 1,          // Step hours by 1 (default)
    // Enable dropdown selectors:
    static: true,             // Forces dropdown UI (instead of inline)
    // Optional: Customize dropdown labels
    locale: {
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
    },
});

let currentDay = null;

document.addEventListener('DOMContentLoaded', function () {
    /**
     * ===== Opening Hours Management Event Listeners =====
     */

    // Save opening time
    document.getElementById('saveOpeningTime').addEventListener('click', function () {
        const fromTime = document.getElementById('fromTime').value;
        const toTime = document.getElementById('toTime').value;

        if (fromTime && toTime) {
            const openingTimeText = `${fromTime} - ${toTime}`;
            const openingTimesContainer = [...openingTimesTable.querySelectorAll('tr')].find(row => row.querySelector('.add-opening-time-btn').getAttribute('data-day') === currentDay).querySelector('.opening-times-container');

            // Check for duplicate opening times
            const existingBadges = [...openingTimesContainer.querySelectorAll('.badge')];
            if (existingBadges.some(badge => badge.textContent.trim().startsWith(openingTimeText))) {
                alert('This opening time already exists. Please add a different time.');
                return;
            }

            if (openingTimesContainer.textContent.includes('Closed')) {
                openingTimesContainer.innerHTML = ''; // Clear "Closed" text
            }

            const badge = document.createElement('span');
            badge.className = 'badge bg-success me-2 mb-2 d-inline-flex align-items-center';
            badge.innerHTML = `
            ${openingTimeText}
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close"></button>
        `;
            openingTimesContainer.appendChild(badge);

            // Add event listener to remove the badge
            badge.querySelector('.btn-close').addEventListener('click', function () {
                badge.remove();
                const day = openingTimesContainer.closest('tr').querySelector('td strong').textContent;
                const dayData = openingHoursData.days.find(d => d.name.en === day);
                dayData.openingHours = dayData.openingHours.filter(time => time !== openingTimeText);

                if (!openingTimesContainer.querySelector('.badge')) {
                    openingTimesContainer.innerHTML = '<span class="text-muted">Closed</span>'; // Set to "Closed" if no badges remain
                    dayData.isClosed = true;
                }

                markOpeningHoursAsChanged(); // Mark as changed
            });

            // Update openingHoursData
            const dayData = openingHoursData.days.find(d => d.name.en === currentDay);
            dayData.openingHours.push(openingTimeText);
            dayData.isClosed = false;

            markOpeningHoursAsChanged(); // Mark as changed

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('openingTimeModal'));
            modal.hide();
        }
    });




    // Save the current opening hours to the server using upload_json.php
    document.getElementById('updateWebsiteOpeningHours').addEventListener('click', async function () {
        showConfirmationModal(
            'Are you sure you want to update the website opening hours? This will overwrite the current opening hours on the website.',


            async function () {
                openingHoursData.lastUpdated = new Date().toISOString();

                // Convert JSON data to a pretty-printed format
                const prettyPrintedJSON = JSON.stringify(openingHoursData, null, 4); // Indent with 4 spaces
                const jsonBlob = new Blob([prettyPrintedJSON], { type: 'application/json' });
                const formData = new FormData();
                formData.append('jsonFile', jsonBlob, 'openingHours.json');

                try {
                    const response = await fetch('upload_json.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(result.message || 'Failed to upload JSON file');
                    }

                    showInformationModal('Opening hours updated successfully!');
                    resetOpeningHoursChangedStatus(); // Reset status
                } catch (error) {
                    console.error('Error uploading JSON file:', error);
                    alert('An error occurred while updating opening hours. Please try again.');
                }
            }
        );
    });
})