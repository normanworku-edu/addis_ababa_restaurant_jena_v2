<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Ethiopian Restaurant</title>

    <!-- Bootstrap CSS -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

    <!-- Add this custom style -->
    <style>
        #informationModal {
            z-index: 1060 !important;
            /* Higher than default modal z-index of 1050 */
        }

        .modal-backdrop.information-backdrop {
            z-index: 1055 !important;
        }
    </style>

    <!-- Include flatpickr CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

</head>

<body class="admin-page">

    <!-- Modal Box HTMLs -->
    <!-- Confirm Delete Modal -->
    <div class="modal fade" id="confirmDeleteDishModal" tabindex="-1" aria-labelledby="confirmDeleteDishModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmDeleteDishModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this menu item? This action cannot be undone.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteDish">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Import JSON Modal -->
    <div class="modal fade" id="importJsonModal" tabindex="-1" aria-labelledby="importJsonModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="importJsonModalLabel">Import JSON</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="uploadForm" action="upload_json.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="upload_path" value="assets/json/"> <!-- Updated path -->
                        <div class="mb-3">
                            <label for="jsonFile" class="form-label">Select JSON File</label>
                            <input type="file" class="form-control" id="jsonFile" accept=".json" required>
                            <small class="text-muted">Only JSON files are allowed.</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmImport">Import</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Information Modal -->
    <div class="modal fade" id="informationModal" tabindex="-1" aria-labelledby="informationModalLabel"
        aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="informationModalLabel">Information</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="informationModalBody">
                    <!-- Information message will be dynamically set -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>




    <!-- Header will be inserted here by JavaScript -->
    <div id="header-placeholder"></div>

    <main class="container my-5">
        <div class="row">
            <div class="col-lg-3">
                <div class="admin-nav card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0" data-translate="adminPanel">Admin Panel</h5>
                    </div>
                    <div class="list-group list-group-flush">
                        <a href="#homePage-management" class="list-group-item list-group-item-action active"
                            data-bs-toggle="tab" data-translate="adminHomePageTitle">Home Page</a>
                        <a href="#menu-management" class="list-group-item list-group-item-action" data-bs-toggle="tab"
                            data-translate="adminMenuTitle">Menu</a>
                        <a href="#reviews-management" class="list-group-item list-group-item-action"
                            data-bs-toggle="tab" data-translate="adminReviewsTitle">Reviews</a>
                        <a href="#gallery-management" class="list-group-item list-group-item-action"
                            data-bs-toggle="tab" data-translate="adminGalleryTitle">Gallery</a>
                        <a href="#offersAndNews-management" class="list-group-item list-group-item-action"
                            data-bs-toggle="tab" data-translate="adminOffersAndNewsTitle">Offers & News</a>
                        <a href="#openingHours-management" class="list-group-item list-group-item-action"
                            data-bs-toggle="tab" data-translate="adminOpeningHoursTitle">Opening Hours</a>
                        <a href="#contactInfo-management" class="list-group-item list-group-item-action"
                            data-bs-toggle="tab" data-translate="adminContactInfoTitle">Contact Info</a>
                        <a href="#translations" class="list-group-item list-group-item-action" data-bs-toggle="tab"
                            data-translate="adminTranslationsTitle">Translations</a>
                        <a href="#userAccounts" class="list-group-item list-group-item-action" data-bs-toggle="tab"
                            data-translate="adminUserAccountsTitle">User Accounts</a>
                    </div>
                </div>
            </div>

            <div class="col-lg-9">
                <div class="tab-content">


                    <!-- HomePage Management Tab -->
                    <div class="tab-pane fade show active" id="homePage-management">
                        <div class="admin-panel mb-3">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminHomePageTitle">Home Page</h3>
                                    <p class="text-muted" data-translate="homePageDesc">Manage home page texts and
                                        images</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button class="btn btn-primary" id="updateWebsiteHomePage" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>


                            <!-- Home Title Section -->
                            <div class="card mb-3" id="homeTitleCard">
                                <div class="card-header">Home Title</div>
                                <div class="card-body">
                                    <ul class="nav nav-tabs" id="homeTitleTabs" role="tablist">
                                        <!-- Tabs for each language -->
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="homeTitle-en-tab" data-bs-toggle="tab"
                                                data-bs-target="#homeTitle-en" type="button" role="tab"
                                                aria-controls="review-en" aria-selected="true">English</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="homeTitle-de-tab" data-bs-toggle="tab"
                                                data-bs-target="#homeTitle-de" type="button" role="tab"
                                                aria-controls="review-en" aria-selected="false">German</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="homeTitle-am-tab" data-bs-toggle="tab"
                                                data-bs-target="#homeTitle-am" type="button" role="tab"
                                                aria-controls="review-en" aria-selected="false">Amharic</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <!-- Tab content for each language -->
                                        <div class="tab-pane fade show active" id="homeTitle-en" role="tabpanel"
                                            aria-labelledby="homeTitle-en-tab">
                                            <textarea id="homeTitle-en-input" class="form-control" rows="2"
                                                required></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="homeTitle-de" role="tabpanel"
                                            aria-labelledby="homeTitle-de-tab">
                                            <textarea id="homeTitle-de-input" class="form-control" rows="2"
                                                required></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="homeTitle-am" role="tabpanel"
                                            aria-labelledby="homeTitle-am-tab">
                                            <textarea id="homeTitle-am-input" class="form-control" rows="2"
                                                required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Home Subtitle Section -->
                            <div class="card mb-3" id="homeSubtitleCard">
                                <div class="card-header">Home Subtitle</div>
                                <div class="card-body">
                                    <ul class="nav nav-tabs" id="homeSubtitleTabs" role="tablist">
                                        <!-- Tabs for each language -->
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="homeSubtitle-en-tab"
                                                data-bs-toggle="tab" data-bs-target="#homeSubtitle-en" type="button"
                                                role="tab">English</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="homeSubtitle-de-tab" data-bs-toggle="tab"
                                                data-bs-target="#homeSubtitle-de" type="button"
                                                role="tab">German</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="homeSubtitle-am-tab" data-bs-toggle="tab"
                                                data-bs-target="#homeSubtitle-am" type="button"
                                                role="tab">Amharic</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <!-- Tab content for each language -->
                                        <div class="tab-pane fade show active" id="homeSubtitle-en" role="tabpanel">
                                            <textarea id="homeSubtitle-en-input" class="form-control"
                                                rows="2"></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="homeSubtitle-de" role="tabpanel">
                                            <textarea id="homeSubtitle-de-input" class="form-control"
                                                rows="2"></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="homeSubtitle-am" role="tabpanel">
                                            <textarea id="homeSubtitle-am-input" class="form-control"
                                                rows="2"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- About Text Section -->
                            <div class="card mb-3" id="aboutTextCard">
                                <div class="card-header">About Text</div>
                                <div class="card-body">
                                    <ul class="nav nav-tabs" id="aboutTextTabs" role="tablist">
                                        <!-- Tabs for each language -->
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="aboutText-en-tab" data-bs-toggle="tab"
                                                data-bs-target="#aboutText-en" type="button" role="tab">English</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="aboutText-de-tab" data-bs-toggle="tab"
                                                data-bs-target="#aboutText-de" type="button" role="tab">German</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="aboutText-am-tab" data-bs-toggle="tab"
                                                data-bs-target="#aboutText-am" type="button" role="tab">Amharic</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <!-- Tab content for each language -->
                                        <div class="tab-pane fade show active" id="aboutText-en" role="tabpanel">
                                            <textarea id="aboutText-en-input" class="form-control" rows="4"></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="aboutText-de" role="tabpanel">
                                            <textarea id="aboutText-de-input" class="form-control" rows="4"></textarea>
                                        </div>
                                        <div class="tab-pane fade" id="aboutText-am" role="tabpanel">
                                            <textarea id="aboutText-am-input" class="form-control" rows="4"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Image Fields Section -->
                            <div class="card mb-3" id="homepageImagesCard">
                                <div class="card-header">
                                    <h5 class="mb-0">Homepage Images</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row g-4">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Home Background Image</label>
                                            <div class="text-center border p-3 rounded">
                                                <img id="homeBackgroundImagePreview" src="" alt="Home Background"
                                                    class="img-fluid mb-3 rounded shadow-sm"
                                                    style="max-width: 100%; height: auto; max-height: 200px;">
                                                <input type="file" id="homeBackgroundImageInput" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">About Section Image</label>
                                            <div class="text-center border p-3 rounded">
                                                <img id="aboutSectionImagePreview" src="" alt="About Section"
                                                    class="img-fluid mb-3 rounded shadow-sm"
                                                    style="max-width: 100%; height: auto; max-height: 200px;">
                                                <input type="file" id="aboutSectionImageInput" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>






                    <!-- Menu Management Tab -->
                    <div class="tab-pane fade" id="menu-management">
                        <div class="admin-panel">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminMenuTitle">Menu</h3>
                                    <p class="text-muted" data-translate="menuManagementDesc">Edit menu items and
                                        categories</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button type="button" class="btn btn-primary text-white" id="updateWebsiteMenu"
                                        disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>


                            <div class="card">
                                <div class="card-header">
                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <select class="form-select" id="dishCategoryFilter">
                                                <option value="">All Categories</option>
                                                <!-- Categories will be populated by JavaScript -->
                                            </select>
                                        </div>
                                        <div class="col-md-6 text-end mb-2">
                                            <input type="text" class="form-control" id="searchInput"
                                                placeholder="Search menu items...">
                                        </div>
                                    </div>

                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <div class="form-check form-switch d-inline-block me-3">
                                                <input class="form-check-input" type="checkbox" id="showHiddenItems"
                                                    checked>
                                                <label class="form-check-label" for="showHiddenItems">Show Hidden
                                                    Items</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-md-end text-start mb-2">
                                            <div>
                                                <button class="btn btn-primary" id="addNewItem">
                                                    <i class="bi bi-plus-lg"></i> Add New Menu Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle" id="menuTable">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style="width: 5%">#</th>
                                                    <th scope="col" style="width: 15%">Dish ID</th>
                                                    <th scope="col" style="width: 45%">Name</th>
                                                    <th scope="col" style="width: 15%">Price</th>
                                                    <th scope="col" style="width: 10%">Status</th>
                                                    <th scope="col" style="width: 10%">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Menu items will be populated by JavaScript -->
                                                <tr id="menuItemsLoading">
                                                    <!-- This row will be replaced dynamically by JavaScript -->
                                                    <td colspan="5" class="text-center">Loading menu items ...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Menu Item Modal -->
                    <!-- Dynamically Load Menu Item Modal -->
                    <div id="menuItemModal-placeholder"></div>




                    <!-- Reviews Management Tab -->
                    <div class="tab-pane fade" id="reviews-management">
                        <div class="admin-panel">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminReviewsTitle">Reviews</h3>
                                    <p class="text-muted" data-translate="reviewsDesc">View, add, edit, and delete
                                        customer reviews</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button type="button" class="btn btn-primary text-white" id="updateWebsiteReviews"
                                        disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <select class="form-select" id="reviewCategoryFilter">
                                                <option value="">All Categories</option>
                                                <!-- Categories will be populated by JavaScript -->
                                            </select>
                                        </div>
                                        <div class="col-md-6 text-end mb-2">
                                            <input type="text" class="form-control" id="reviewSearchInput"
                                                placeholder="Search reviews...">
                                        </div>
                                    </div>

                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <div class="form-check form-switch d-inline-block me-3">
                                                <input class="form-check-input" type="checkbox" id="showHiddenReviews"
                                                    checked>
                                                <label class="form-check-label" for="showHiddenReviews">Show Hidden
                                                    Reviews</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-md-end text-start mb-2">
                                            <div>
                                                <button class="btn btn-primary" id="addNewReview">
                                                    <i class="bi bi-plus-lg"></i> Add New Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle" id="reviewsTable">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style="width: 5%">#</th>
                                                    <th scope="col" style="width: 20%">Reviewer</th>
                                                    <th scope="col" style="width: 10%">Rating</th>
                                                    <th scope="col" style="width: 50%">Review</th>
                                                    <th scope="col" style="width: 15%">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Reviews will be populated by JavaScript -->
                                                <tr id="reviewsLoading">
                                                    <td colspan="5" class="text-center">Loading reviews...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                    <!-- Review Modal -->
                    <!-- Dynamically Load review Item Modal -->
                    <div id="reviewModal-placeholder"></div>



                    <!-- Gallery Management Tab -->
                    <div class="tab-pane fade" id="gallery-management">
                        <div class="admin-panel">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminGalleryTitle">Gallery</h3>
                                    <p class="text-muted" data-translate="galleryManagementDesc">Manage gallery images
                                        and categories</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button type="button" class="btn btn-primary text-white" id="updateWebsiteGallery"
                                        disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <select class="form-select" id="galleryCategoryFilter">
                                                <option value="">All Categories</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 text-end mb-2">
                                            <input type="text" class="form-control" id="gallerySearchInput"
                                                placeholder="Search gallery...">
                                        </div>
                                    </div>

                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <div class="form-check form-switch d-inline-block me-3">
                                                <input class="form-check-input" type="checkbox"
                                                    id="showHiddenGalleryItems" checked>
                                                <label class="form-check-label" for="showHiddenGalleryItems">Show Hidden
                                                    Images</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-md-end text-start mb-2">
                                            <div>
                                                <button class="btn btn-primary" id="addNewGalleryItem">
                                                    <i class="bi bi-plus-lg"></i> Add New Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle" id="galleryTable">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style="width: 5%">#</th>
                                                    <th scope="col" style="width: 20%">Image</th>
                                                    <th scope="col" style="width: 45%">Title</th>
                                                    <th scope="col" style="width: 15%">Status</th>
                                                    <th scope="col" style="width: 15%">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Gallery items will be populated by JavaScript -->
                                                <tr id="galleryLoading">
                                                    <td colspan="5" class="text-center">Loading gallery...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery Item Modal -->
                    <!-- Dynamically Load Gallery Item Modal -->
                    <div id="galleryItemModal-placeholder"></div>


                    <!-- OffersAndNews Management Tab -->
                    <div class="tab-pane fade" id="offersAndNews-management">
                        <div class="admin-panel">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminOffersAndNewsTitle">Offers And News</h3>
                                    <p class="text-muted" data-translate="offersAndNewsManagementDesc">Manage offers and
                                        news items</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button type="button" class="btn btn-primary text-white"
                                        id="updateWebsiteOffersAndNews" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <select class="form-select" id="offersAndNewsCategoryFilter">
                                                <option value="">All Categories</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 text-end mb-2">
                                            <input type="text" class="form-control" id="offersAndNewsSearchInput"
                                                placeholder="Search offers and news...">
                                        </div>
                                    </div>

                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6 text-start mb-2">
                                            <div class="form-check form-switch d-inline-block me-3">
                                                <input class="form-check-input" type="checkbox"
                                                    id="showHiddenOffersAndNewsItems" checked>
                                                <label class="form-check-label" for="showHiddenOffersAndNewsItems">Show
                                                    Hidden Items</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-md-end text-start mb-2">
                                            <div>
                                                <button class="btn btn-primary" id="addNewOffersAndNewsItem">
                                                    <i class="bi bi-plus-lg"></i> Add New Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover align-middle" id="offersAndNewsTable">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style="width: 5%">#</th>
                                                    <th scope="col" style="width: 20%">Image</th>
                                                    <th scope="col" style="width: 45%">Title</th>
                                                    <th scope="col" style="width: 15%">Status</th>
                                                    <th scope="col" style="width: 15%">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- OffersAndNews items will be populated by JavaScript -->
                                                <tr id="offersAndNewsLoading">
                                                    <td colspan="5" class="text-center">Loading offers and news items...
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- OffersAndNews Item Modal -->
                    <!-- Dynamically Load OffersAndNews Item Modal -->
                    <div id="offersAndNewsItemModal-placeholder"></div>


                    <!-- OpeningHours Management Tab -->
                    <div class="tab-pane fade" id="openingHours-management">
                        <div class="admin-panel mb-3">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminOpeningHoursTitle">Opening Hours</h3>
                                    <p class="text-muted" data-translate="openingHoursDesc">Manage opening hours images
                                        and categories</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button class="btn btn-primary" id="updateWebsiteOpeningHours" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>


                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover table-striped align-middle"
                                            id="offersAndNewsTable">
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
                            <div class="modal fade" id="openingTimeModal" tabindex="-1"
                                aria-labelledby="openingTimeModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="openingTimeModalLabel">Add Opening Hour</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="mb-3">
                                                <label for="fromTime" class="form-label">From (24-hour format):</label>
                                                <input type="time" id="fromTime" class="form-control" lang="de-DE"
                                                    value="17:00">
                                            </div>
                                            <div class="mb-3">
                                                <label for="toTime" class="form-label">To (24-hour
                                                    format):&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                                <input type="time" id="toTime" class="form-control" lang="de-DE"
                                                    value="22:00">
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-primary"
                                                id="saveOpeningTime">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>



                    <!-- Contact Info Management Tab -->
                    <div class="tab-pane fade" id="contactInfo-management">
                        <div class="admin-panel mb-3">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminContactInfoTitle">Contact Info</h3>
                                    <p class="text-muted" data-translate="contactInfoDesc">Manage contact info images
                                        and categories</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button class="btn btn-primary" id="updateWebsiteContactInfo" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>

                            <div class="container mb-4">
                                <div class="row">
                                    <div class="col-md-6">
                                        <!-- Left Column Content -->
                                        <!-- Address Section -->
                                        <div class="card mb-3" id="addressCard">
                                            <div class="card-header">Address</div>
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label for="street" class="form-label">Street</label>
                                                    <input type="text" id="street" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="city" class="form-label">City</label>
                                                    <input type="text" id="city" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="postalCode" class="form-label">Postal Code</label>
                                                    <input type="text" id="postalCode" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="country" class="form-label">Country</label>
                                                    <input type="text" id="country" class="form-control">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <!-- Right Column Content -->
                                        <div class="mb-3">
                                            <!-- Contact Numbers Section -->
                                            <div class="card mb-3" id="contactNumbersCard">
                                                <div class="card-header">Contact Numbers</div>
                                                <div class="card-body">
                                                    <div class="mb-3">
                                                        <label for="phone" class="form-label">Phone</label>
                                                        <input type="text" id="phone" class="form-control">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="whatsapp" class="form-label">WhatsApp</label>
                                                        <input type="text" id="whatsapp" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>

                                            <!-- Email Section -->
                                            <div class="card mb-3" id="emailCard">
                                                <div class="card-header">Email</div>
                                                <div class="card-body">
                                                    <div class="mb-3">
                                                        <label for="email" class="form-label">Email</label>
                                                        <input type="email" id="email" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>



                            <!-- Social Media Section -->
                            <div class="card mb-3" id="socialMediaCard">
                                <div class="card-header">Social Media</div>
                                <div class="card-body">
                                    <div class="row" id="socialMediaContainer">
                                        <!-- Existing social media links will be dynamically populated -->
                                    </div>
                                </div>
                                <!--
                                <button class="btn btn-primary" id="addSocialMediaBtn">Add New Social Media</button>
                                -->
                            </div>




                        </div>
                    </div>



                    <!-- UserAccounts Tab -->
                    <div class="tab-pane fade" id="userAccounts">
                        <div class="admin-panel">

                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminUserAccountsTitle">User Accounts</h3>
                                    <p class="text-muted" data-translate="userAccountsDesc">Manage user accounts</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button class="btn btn-primary" id="updateWebsiteUserAccounts" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>


                            <!-- Social Media Section -->
                            <div class="card mb-3" id="userAccountsCard">
                                
                                <div class="col-md-6">
                                    <div class="card-header">Current User Accounts</div>
                                </div>
                                <div class="col-md-6 text-md-end text-start">
                                    <button 
                                        id="addUserAccountsBtn" 
                                        class="btn btn-outline-primary btn-sm position-absolute top-0 end-0 m-2"
                                        style="height: 32px; font-size: 1rem;" >
                                        <i class="bi bi-plus"></i> Add New
                                    </button>
                                </div>

                                <div class="card-body">
                                    <div class="row" id="userAccountsContainer">
                                        <!-- Existing social media links will be dynamically populated -->
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>


                    <!-- Confirm Delete Modal -->
                    <div class="modal fade" id="confirmDeleteReviewModal" tabindex="-1"
                        aria-labelledby="confirmDeleteReviewModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="confirmDeleteReviewModalLabel">Confirm Delete</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Are you sure you want to delete this review item? This action cannot be undone.
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-danger"
                                        id="confirmDeleteReview">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Translations Tab -->
                    <div class="tab-pane fade" id="translations">
                        <div class="admin-panel">


                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h3 data-translate="adminTranslationsTitle">Translations</h3>
                                    <p class="text-muted" data-translate="translationsDesc">Edit website content in
                                        different languages</p>
                                </div>
                                <div class="col-md-4 text-md-end text-start">
                                    <button class="btn btn-primary" id="updateWebsiteTranslations" disabled>
                                        <i class="bi bi-cloud-upload"></i> Update Website
                                    </button>
                                </div>
                            </div>

                            <div class="container my-5">

                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover align-middle" id="translationsTable">
                                        <thead class="table-dark">
                                            <tr>
                                                <th class="text-center"> # </th>
                                                <th class="text-center">English <i class="bi bi-arrow-down-up"></i></th>
                                                <th class="text-center">German <i class="bi bi-arrow-down-up"></i></th>
                                                <th class="text-center">Amharic <i class="bi bi-arrow-down-up"></i></th>
                                                <th class="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Rows will be dynamically populated -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Login Form (shown when not logged in) -->
    <div id="login-form-container" class="container my-5" style="max-width: 500px; display: none;">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h3 class="mb-0" data-translate="adminLoginTitle">Admin Login</h3>
            </div>
            <div class="card-body">
                <form id="login-form">
                    <div class="mb-3">
                        <label for="admin-username" class="form-label" data-translate="adminUsername">Username</label>
                        <input type="text" class="form-control" id="admin-username" required>
                    </div>
                    <div class="mb-3">
                        <label for="admin-password" class="form-label" data-translate="adminPassword">Password</label>
                        <input type="password" class="form-control" id="admin-password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" data-translate="adminLoginBtn">Login</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Add missing containers for allergens and additives -->
    <div id="allergensContainer" class="row"></div>
    <div id="additivesContainer" class="row"></div>

    <!-- Footer will be inserted here by JavaScript -->
    <div id="footer-placeholder"></div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="assets/js/bootstrap.bundle.min.js"></script>

    <!-- Main JS -->
    <script src="assets/js/main.js"></script>

    <!-- Shared JS -->
    <script src="assets/js/shared.js"></script>


    <!-- scripts from menu admin page -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js"></script>


    <!-- Admin Main JS -->
    <script src="assets/js/admin_main.js"></script>

    <!-- Admin Home Page JS -->
    <script src="assets/js/admin_homepage.js"></script>

    <!-- Admin Menu JS -->
    <script src="assets/js/admin_menu.js"></script>

    <!-- Admin Review JS -->
    <script src="assets/js/admin_review.js"></script>

    <!-- Admin Gallery JS -->
    <script src="assets/js/admin_gallery.js"></script>

    <!-- Admin Offers and News JS -->
    <script src="assets/js/admin_offersAndNews.js"></script>

    <!-- Admin Opening Hours JS -->
    <script src="assets/js/admin_openingHours.js"></script>

    <!-- Admin Contact Info JS -->
    <script src="assets/js/admin_contactInfo.js"></script>

    <!-- Admin Translations JS -->
    <script src="assets/js/admin_translations.js"></script>

    <!-- Admin User Accounts JS -->
    <script src="assets/js/admin_userAccounts.js"></script>

    <script>
        document.getElementById('header-placeholder').innerHTML = generateHeader();
        document.getElementById('footer-placeholder').innerHTML = generateFooter();
        document.getElementById('galleryItemModal-placeholder').innerHTML = generateGalleryItemModal();
        document.getElementById('offersAndNewsItemModal-placeholder').innerHTML = generateOffersAndNewsItemModal();
        //document.getElementById('openingHoursItemModal-placeholder').innerHTML = generateOpeningHoursItemModal();
        document.getElementById('menuItemModal-placeholder').innerHTML = generateMenuItemModal();
        document.getElementById('reviewModal-placeholder').innerHTML = generateReviewModal();
    </script>

</body>

</html>