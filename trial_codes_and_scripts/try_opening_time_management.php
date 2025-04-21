<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Opening Times</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Include flatpickr CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

</head>



<body>
    <div class="container mt-3 mb-3 text-center">
        <button class="btn btn-primary" id="updateWebsiteOpeningHours">Update Website Opening Hours </button>
    </div>


    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle" id="offersAndNewsTable">
                    <thead class="table-dark">
                        <tr>
                            <th>Day</th>
                            <th>Opening Times</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="openingTimesTable">
                        <!-- Days of the week rows will be dynamically populated -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <!-- Modal for selecting opening hours -->
    <div class="modal fade" id="openingTimeModal" tabindex="-1" aria-labelledby="openingTimeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="openingTimeModalLabel">Add Opening Hour</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="fromTime" class="form-label">From (24-hour format):</label>
                        <input type="time" id="fromTime" class="form-control" lang="de-DE" value="17:00">
                    </div>
                    <div class="mb-3">
                        <label for="toTime" class="form-label">To (24-hour format):&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <input type="time" id="toTime" class="form-control" lang="de-DE" value="22:00">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveOpeningTime">Save</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for selecting opening hours -->
    <div class="modal fade" id="openingTimeModal" tabindex="-1" aria-labelledby="openingTimeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="openingTimeModalLabel">Add Opening Hour</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="fromTime" class="form-label">From (24-hour format):</label>
                        <input type="time" id="fromTime" class="form-control" lang="de-DE">
                    </div>
                    <div class="mb-3">
                        <label for="toTime" class="form-label">To (24-hour format):&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <input type="time" id="toTime" class="form-control" lang="de-DE">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveOpeningTime">Save</button>
                </div>
            </div>
        </div>
    </div>

<!-- Initialize flatpickr with dropdown time selectors -->
<script>
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
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        let openingHoursData = null; // Store the opening hours data globally

        const openingTimesTable = document.getElementById('openingTimesTable');

        // Fetch opening hours from the JSON file
        async function fetchOpeningHours() {
            try {
                const response = await fetch('openingHours.json');
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
                                ${
                                    isClosed || openingHours.length === 0
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
                });
            });
        }

        let currentDay = null;

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
                });

                // Update openingHoursData
                const dayData = openingHoursData.days.find(d => d.name.en === currentDay);
                dayData.openingHours.push(openingTimeText);
                dayData.isClosed = false;

                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('openingTimeModal'));
                modal.hide();
            }
        });

        // Save the current opening hours to the server using upload_json.php
        document.getElementById('updateWebsiteOpeningHours').addEventListener('click', async function () {
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

                alert('Opening hours updated successfully!');
            } catch (error) {
                console.error('Error uploading JSON file:', error);
                alert('An error occurred while updating opening hours. Please try again.');
            }
        });

        // Fetch and display opening hours on page load
        fetchOpeningHours();
    </script>
</body>
</html>