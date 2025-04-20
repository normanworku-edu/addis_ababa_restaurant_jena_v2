
/**
 * Main JavaScript functionality for the Ethiopian restaurant website
 * Includes page-specific functionality for all pages except admin
 */
// Check for hash on page load AND after navigation
function scrollToAnchor() {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Get the height of your fixed header/banner
          const headerHeight = document.querySelector('header')?.offsetHeight + 5 || 80; // Fallback to 60px if header not found
          
          // Calculate the position with offset
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          // Scroll to the adjusted position
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  

  
  // Run when URL changes (like after button click)
  window.addEventListener('hashchange', scrollToAnchor);

// Function to handle both initial load and language changes
function loadCurrentPage() {
    // Load menu on menu page
    if (document.querySelector('.menu-page')) {
        loadMenuJSON();
        
    }

    // Initialize reservation form
    if (document.getElementById('reservation-form')) {
        initReservationForm();
    }

    // Initialize contact form
    if (document.getElementById('contact-form')) {
        initContactForm();
    }

    // Initialize gallery lightbox
    if (document.querySelector('.gallery-page')) {
        loadGalleryJSON();
    }

    // Load reviews on reviews page
    if (document.querySelector('.reviews-page')) {
        const onlySelectedReview = false;
        loadReviewsJSON(onlySelectedReview);
    }

    // Load special offers from localStorage
    if (document.querySelector('.home-page')) {
        loadHomePageDynamicJSON();
        loadSelectedDishesJSON();
        loadSpecialOffersAndNewsJSON();
        const onlySelectedReview = true;
        loadReviewsJSON(onlySelectedReview);
    }

    // Load special offers from localStorage
    if (document.querySelector('.admin-page')) {
        
    }
}




// Load and display selected dishes from json
async function loadMenuJSON() {
    try {
    // Load the JSON data
    const response = await fetch('assets/json/menu.json');
    if (!response.ok) throw new Error('Menu data not found');
    const menuData = await response.json();
        
    displayMenuJSON(menuData);


    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menu-items-container').innerHTML = 
            '<div class="alert alert-danger" data-translate="fileLoadError">Error loading json menu file. Please try again later.</div>';
    }
}

// Display menu categories and items
function displayMenuJSON(menuData) {
    const menuContainer = document.getElementById('menu-items-container');
    const currentLang = localStorage.getItem('language') || 'de';

    // Clear existing content
    menuContainer.innerHTML = '';

    // Loop through each category
    menuData.menu.category.forEach(category => {
        const categoryName = category.name[currentLang];
        const categoryId = category.categoryId;
        const dishes = category.dish;
        
        // Create category section
        const categorySection = document.createElement('section');
        categorySection.className = 'menu-category';
        categorySection.id = categoryId;
        
        // Create category heading
        const heading = document.createElement('h3');
        heading.textContent = categoryName;
        categorySection.appendChild(heading);
        
        // Create row for dishes
        const row = document.createElement('div');
        row.className = 'row';

        // Loop through dishes in this category
        dishes.forEach(dish => {
            if (dish.hidden === false) {
            // Access dish details
            const name = dish.name[currentLang];
            const shortDesc = dish.shortDescription[currentLang];
            const longDesc = dish.longDescription[currentLang];
            const price = dish.price;
            const image = dish.image;
            const allergens = dish.allergens || []; // Array of numbers/letters
            const additives = dish.additives || []; // Array of numbers/letters
            const dishId = dish.dishId;

            // Create dish card
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            
            col.innerHTML = `
                <div class="menu-item">
                    <!--
                    <img src="assets/img/dishes/${image}" alt="${name}" class="img-fluid mb-3">
                    -->
                    <div class="d-flex align-items-center justify-content-between">  <!-- Changed to space-between -->
                        <!-- Name on the left -->
                        <h4>${dishId}. ${name}</h4>
                        
                        <!-- Arrow button on the right -->
                        <a href="#top" class="btn btn-sm btn-link p-0 ms-2" title="Go to top" style="font-size: 1.5rem;">
                            <i class="bi bi-arrow-up-circle"></i>  <!-- Upward arrow icon -->
                        </a>
                    </div>
                    <!--
                    <h4>${dishId}. ${name}</h4>
                    -->

                    <p class="text-muted">${shortDesc}</p>
                    
                    <!-- Price and allergens in one line -->
                    <div class="d-flex align-items-center justify-content-between">  <!-- Flex container -->
                        <!-- Price (keeps original styling) -->
                        <p class="price mb-2">€${price}</p>  <!-- mb-0 removes default paragraph margin -->
                        
                        <!-- Allergens and Additives (keeps original styling) -->
                        <div class="allergens mb-2">
                             <span style="color: #ff0000; font-size: 1.1em">⚠</span> ${allergens.map(a => `<span>${a}</span>`).join(' ')} ${additives.map(a => `<span>${a}</span>`).join(' ')}
                        </div>

                    </div>
                    
                    <!-- Centered button -->
                    <div class="text-center">
                        <button class="btn btn-sm btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#dishModal" 
                                data-name="${name}" data-desc="${longDesc}" data-price="${price}" data-image="${image}">
                                <span data-translate="viewDetails">View Details</span>
                        </button>
                    </div>                   
                </div>
            `;
            
            row.appendChild(col);
            }

          });   
          categorySection.appendChild(row);
          menuContainer.appendChild(categorySection); 
    });


    // Add allergen information section
    displayAllergyJSON(menuData);

    
}

function displayAllergyJSON(menuData) {
    const menuContainer = document.getElementById('menu-items-container');
    const allergenSection = document.createElement('section');
    const currentLang = localStorage.getItem('language') || 'de';

    allergenSection.className = 'allergen-info mt-5';
    

        // Built tabular list to Render allergen list
        const allergenList = document.createElement('ul');
    allergenList.className = 'list-unstyled';
    allergenList.innerHTML = '';
    Object.entries(menuData.allergen_mapping).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `<strong>${key}:</strong> ${value[currentLang] || value['de']}`;
        allergenList.appendChild(li);
    });
    
    // Built tabular list to  Render additive list
        const additiveList = document.createElement('ul');
    additiveList.className = 'list-unstyled';
    additiveList.innerHTML = '';
    Object.entries(menuData.additive_mapping).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `<strong>${key}:</strong> ${value[currentLang] || value['de']}`;
        additiveList.appendChild(li);
    });


    // Clear existing content
        allergenSection.innerHTML = `
        <div class="container mt-5" id="allergen-additive-info">
            <h3 data-translate="allergenInfoTitle">Allergen Information</h3>
            <p data-translate="allergenInfoText">Please inform our staff about any food allergies or intolerances. 
            The following symbols indicate possible allergens in our dishes:</p>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5 class="mb-0" id="allergen-header" data-translate="allergens">Allergens</h5>
                        </div>
                        <div class="card-body">
                            "${allergenList.innerHTML}"
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5 class="mb-0" id="additive-header" data-translate="additives">Additives</h5>
                        </div>
                        <div class="card-body">
                            "${additiveList.outerHTML}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    



    menuContainer.appendChild(allergenSection);
}


// Load and display gallery from json
async function loadGalleryJSON() {
    try {
    // Load the JSON data
    const response = await fetch('assets/json/gallery.json');
    if (!response.ok) throw new Error('Gallery data not found');
    const galleryData = await response.json();
        
    displayGalleryJSON(galleryData);


    } catch (error) {
        console.error('Error loading gallery:', error);
        document.getElementById('gallery-items-container').innerHTML = 
            '<div class="alert alert-danger" data-translate="fileLoadError">Error loading json gallery file. Please try again later.</div>';
    }
}

// Display menu categories and items
function displayGalleryJSON(galleryData) {
    const galleryContainer = document.getElementById('gallery-items-container');
        const currentLang = localStorage.getItem('language') || 'de';

    // Clear existing content
    galleryContainer.innerHTML = '';

    // Generate the HTML using template literals
    const buttonsHTML = `
    <div class="d-flex flex-wrap justify-content-center gap-1 mb-5">
    ${galleryData.gallery.category.map(category => `
        <a href="#" 
        class="btn btn-outline-primary btn-lg flex-fill text-center scroll-to-category" 
        data-target="${category.categoryId}">
        ${category.name[currentLang]}
        </a>
    `).join('')}
    </div>
    `;

    // Insert the generated HTML
    galleryContainer.innerHTML = buttonsHTML;



    // Loop through each category
    galleryData.gallery.category.forEach(category => {
        const categoryName = category.name[currentLang];
        const categoryId = category.categoryId;
        const images = category.image;
        
        // Create category section
        const categorySection = document.createElement('section');
        categorySection.className = 'gallery-category';
        categorySection.id = categoryId;
        
      const galleryCategoryHeaderHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <!-- Empty div to balance the arrow button -->
            <div style="width: 24px; visibility: hidden;"></div>
            
            <!-- Centered heading -->
            <h3 class="text-center mb-0">${categoryName}</h3>
            
            <!-- Arrow button -->
            <a href="#top" class="btn btn-link p-0" style="font-size: 1.5rem;">
                <i class="bi bi-arrow-up-circle"></i>
            </a>
        </div>
    `;

      categorySection.insertAdjacentHTML('beforeend', galleryCategoryHeaderHTML);


        
        
        // Create row for dishes
        const row = document.createElement('div');
        row.className = 'row';

        // Loop through dishes in this category
        images.forEach(image => {
            if (image.hidden === true) {
                return; // Skip this image
            }
            // Access dish details
            const title = image.title[currentLang];
            const imagefile = image.imagefile;

            // Create image card
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
 
            col.innerHTML = `
                <div class="gallery-item position-relative">
                    <img src="assets/img/gallery/${categoryId}/${imagefile}" 
                        alt="${title}" 
                        class="img-fluid rounded mb-3">
                    
                    <!-- Title overlay -->
                    <div class="image-title-overlay w-100 px-2 py-1">
                        <p class="text-white mb-0 text-center fw-bold">${title}</p>
                    </div>
                </div>
            `;

            row.appendChild(col);

          });   
          categorySection.appendChild(row);
          galleryContainer.appendChild(categorySection); 
    });
}

// Initialize reservation form
function initReservationForm() {
    const form = document.getElementById('reservation-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('reservation-name').value;
        const phone = document.getElementById('reservation-phone').value;
        const guests = document.getElementById('reservation-guests').value;
        const date = document.getElementById('reservation-date').value;
        const time = document.getElementById('reservation-time').value;
        const tablePref = document.getElementById('reservation-table-pref').value;
        const notes = document.getElementById('reservation-notes').value;
        
        // Format WhatsApp message
        const message = `New Reservation:\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}\nDate: ${date}\nTime: ${time}\nTable Preference: ${tablePref}\nNotes: ${notes}`;
        
        // Open WhatsApp with pre-filled message
        const formattedMessage = `
            ✨ *New Reservation Request* ✨

            👤 *Guest Information:*
            • 🏷️ Name: ${name}
            • 📞 Phone: ${phone}
            • 👥 Guests: ${guests}

            ⏰ *Visit Details:*
            • 📅 Date: ${date}
            • 🕒 Time: ${time}
            • 🪑 Table Preference: ${tablePref}

            📝 *Special Notes:*
            ${notes ? `   • ✏️ ${notes.replace(/\n/g, '\n      ')}` : '   • No special requests'}

            Please confirm my request. Thanks! 🍽️
            `;

            // For WhatsApp/plain text version:
            const plainTextMessage = `
            *New Reservation Request*
            -----------------------
            *Guest Information:*
            - Name: ${name}
            - Phone: ${phone}
            - Guests: ${guests}

            *Visit Details:*
            - Date: ${date}
            - Time: ${time}
            - Table Preference: ${tablePref}

            *Special Notes:*
            ${notes || 'No special requests'}

            Please confirm my request. Thanks!
            `;

        window.open(`https://wa.me/4917685905441?text=${encodeURIComponent(plainTextMessage)}`, '_blank');
        
        // Show success message
        alert('Please send the pre-filled WhatsApp message to confirm your reservation. Thank you!');
        form.reset();
    });
}

// Initialize contact form (simulated)
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        form.reset();
    });
}

// Initialize gallery lightbox
function initGallery() {
    // This would use the lightbox.js library
    // Implementation depends on the specific lightbox library chosen
    console.log('Gallery initialized');
}

// Load dynamic content for homepage
async function loadHomePageDynamicJSON() {
    try {
        const response = await fetch('assets/json/home.json'); // Updated path
        if (!response.ok) throw new Error('Home page data not found');
        const homePageData = await response.json();

        displayHomePageDynamicJSON(homePageData);
    } catch (error) {
        console.error('Error loading home:', error);
        document.getElementById('selected-dishes-placeholder').innerHTML = 
            '<div class="alert alert-danger" data-translate="fileLoadError">Error loading json menu file. Please try again later.</div>';
    }
}


// Load and display selected dishes from json
async function loadSelectedDishesJSON() {
    try {
        const response = await fetch('assets/json/menu.json'); // Updated path
        if (!response.ok) throw new Error('Menu data not found');
        const menuData = await response.json();
        displaySelectedDishesJSON(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('selected-dishes-placeholder').innerHTML = 
            '<div class="alert alert-danger" data-translate="fileLoadError">Error loading json menu file. Please try again later.</div>';
    }
}


// Display menu categories and items
function displayHomePageDynamicJSON(homeContentData) {
    const currentLang = localStorage.getItem('language') || 'de';
    // Use the fetched data
    // set hero title
    document.querySelector('.hero-title').textContent = homeContentData.homeTitle[currentLang];
    // set hero subtitle
    document.querySelector('.hero-subtitle').textContent = homeContentData.homeSubtitle[currentLang];
    
    // set home background image
    // Assuming homeContentData.homeBackgroundImage contains the image path
    const heroSection = document.querySelector('.hero');
    if (heroSection && homeContentData?.homeBackgroundImage) {
    heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${homeContentData.homeBackgroundImage}')`;
    }

    // set about text
    document.getElementById('aboutText').textContent = homeContentData.aboutText[currentLang];
    // set about image
    const aboutImage = document.getElementById('aboutImage');

    if (aboutImage && homeContentData.aboutImage) {
        aboutImage.src = homeContentData.aboutImage; // Update the src dynamically
    }
}

// Display menu categories and items
function displaySelectedDishesJSON(menuData) {
    const selectedDishesContainer = document.getElementById('selected-dishes-placeholder');
        const currentLang = localStorage.getItem('language') || 'de';

    // Clear existing content
    selectedDishesContainer.innerHTML = '';
    
    // Create row for dishes
    const row = document.createElement('div');
    row.className = 'row';

    // Loop through each category
    menuData.menu.category.forEach(category => {
        const categoryName = category.name[currentLang];
        const categoryId = category.categoryId;
        
        // Loop through dishes in this category
        category.dish.forEach(dish => {
          if (dish.selected === true && dish.hidden === false) {
            // Access dish details
            const name = dish.name[currentLang];
            const shortDesc = dish.shortDescription[currentLang];
            const price = dish.price;
            const image = dish.image;
            const allergens = dish.allergens || []; // Array of numbers/letters
            const additives = dish.additives || []; // Array of numbers/letters
            const dishId = dish.dishId;

            // Create dish card
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            col.innerHTML = `
                <div class="menu-item">
                    <img src="assets/img/dishes/${image}" alt="${name}" class="img-fluid mb-3">
                    <h4>${dishId}. ${name}</h4>
                    <p class="text-muted">${shortDesc}</p>
                    
                    <!-- Price and allergens in one line -->
                    <div class="d-flex align-items-center justify-content-between">  <!-- Flex container -->
                        <!-- Price (keeps original styling) -->
                        <p class="price mb-2">€${price}</p>  <!-- mb-0 removes default paragraph margin -->
                        
                        <!-- Allergens and Additives (keeps original styling) -->
                        <div class="allergens mb-2">
                             <span style="color: #ff0000; font-size: 1.1em">⚠</span> ${allergens.map(a => `<span>${a}</span>`).join(' ')} ${additives.map(a => `<span>${a}</span>`).join(' ')}
                        </div>

                    </div>
                    
                    <!-- Centered button -->
                    <div class="text-center">
                        <a href="menu.html#${categoryId}" class="btn btn-sm btn-outline-primary" data-translate="viewBtnMenu">View Menu</a>
                    </div>                   
                </div>
            `;
            
            row.appendChild(col);
            }
          });    
        selectedDishesContainer.appendChild(row);
    });
}

// Load and display special offers and news from json
async function loadSpecialOffersAndNewsJSON() {
    try {
        const response = await fetch('assets/json/offersAndNews.json'); // Updated path
        if (!response.ok) throw new Error('Offers and News data not found');
        const offersAndNewsData = await response.json();
    
        displaySpecialOffersAndNewsJSON(offersAndNewsData);
    } catch (error) {
        console.error('Error loading Offers and news:', error);
        document.getElementById('offers-news-placeholder').innerHTML = 
            '<div class="alert alert-danger" data-translate="jsonLoadError">Error loading json file. Please try again later.</div>';
    }
}

// Display menu categories and items
function displaySpecialOffersAndNewsJSON(offersAndNewsData) {
    const offerNewsContainer = document.getElementById('offers-news-placeholder');
    const currentLang = localStorage.getItem('language') || 'de';

    // Clear existing content
    offerNewsContainer.innerHTML = '';

    // Loop through each category
    offersAndNewsData.offersAndNews.category.forEach(category => {
        const categoryName = category.name?.[currentLang] || 'Unnamed Category';
        const categoryId = category.categoryId || 'unknown-category';
        
        // Create category section
        const categorySection = document.createElement('section');
        categorySection.className = 'offers-news-category';
        categorySection.id = categoryId;
        
        // Create category heading
        const heading = document.createElement('h3');
        heading.textContent = categoryName;
        categorySection.appendChild(heading);
        
        // Create row for items
        const row = document.createElement('div');
        row.className = 'row';

        // Track if any item is displayed
        let hasItems = false;

        // Loop through items in this category
        category.item.forEach(item => {
            // Show if item is not hidden and is selected
            if (!item.hidden && item.selected) {
                hasItems = true; // Mark that at least one item is displayed

                // Create item card
                const title = item.title?.[currentLang] || 'Untitled';
                const shortDesc = item.shortDescription?.[currentLang] || 'No description available.';
                const longDesc = item.longDescription?.[currentLang] || 'No details available.';
                const date = item.date || 'Unknown date';
                const image = item.image || 'placeholder.jpg'; // Default image
                const itemId = item.id || 'unknown-id';

                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-6 mb-4'; // Two 50% width columns
                col.innerHTML = `
                    <div class="menu-item">
                        <img src="assets/img/offersAndNews/${image}" alt="${title}" class="img-fluid mb-3">
                        <h4>${itemId}. ${title}</h4>
                        <p class="text-muted">${shortDesc}</p>
                        <p class="date">${date}</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#offerNewsModal" 
                            data-title="${title}" data-desc="${longDesc}" data-date="${date}" data-image="${image}">
                            <span data-translate="viewDetails">View Details</span>
                        </button>
                    </div>
                `;
                row.appendChild(col);
            }
        });

        // If no items are displayed, show a placeholder message
        if (!hasItems) {
            const noItemsMessage = document.createElement('p');
            noItemsMessage.className = 'text-muted';
            noItemsMessage.textContent = categoryId === 'special-offers' 
                ? 'Currently there are no special offers.' 
                : 'Currently there are no restaurant news.';
            categorySection.appendChild(noItemsMessage);
        } else {
            categorySection.appendChild(row);
        }

        offerNewsContainer.appendChild(categorySection);
    });
}

// Load and display selected reviews from json
async function loadReviewsJSON(onlySelected) {
    try {
        const response = await fetch('assets/json/reviews.json'); // Updated path
        if (!response.ok) throw new Error('Menu data not found');
        const reviewsData = await response.json();
            
        displayReviewsJSON(reviewsData, onlySelected);

    } catch (error) {
        console.error('Error loading reviews:', error);
        const review_placeholder_name = onlySelected ? 'selected-reviews-placeholder' : 'reviews-placeholder';
        document.getElementById(review_placeholder_name).innerHTML = 
            '<div class="alert alert-danger" data-translate="jsonLoadError">Error loading json file. Please try again later.</div>';
    }
}

function displayReviewsJSON(reviewsData,onlySelected) {

    const review_placeholder_name = onlySelected ? 'selected-reviews-placeholder' : 'reviews-placeholder';
    

    const currentReviewsContainer = document.getElementById(review_placeholder_name);
    
    const currentLang = localStorage.getItem('language') || 'de';

    // Clear existing content
    currentReviewsContainer.innerHTML = '';
    
    // Create row for reviews
    const row = document.createElement('div');
    row.className = 'row';


    // Loop through each category
    reviewsData.reviews.category.forEach(category => {
        const categoryName = category.name[currentLang];
        const categoryId = category.categoryId;
        
        // Loop through reviews in this category
        category.review.forEach(review => {
            if ((onlySelected === false || review.selected === true) && review.hidden === false) {
                // Access review details
                const name = review.name[currentLang];
                const comment = review.comment[currentLang];
                const rating = review.rating;
                const date = review.date;
                const url = review.url ; 
                const reviewId = review.id;

                // Create dish card
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-6 mb-4'; // 50 % width each
                
                col.innerHTML = `
                        <div class="review-card">
                            <div class="d-flex align-items-center mb-3 justify-content-between">
                                <!-- Left-aligned content -->
                                <div class="d-flex align-items-center">
                                                                <div class="reviewer-img bg-secondary me-3 d-flex align-items-center justify-content-center text-white fw-bold fs-3">
                                    ${name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h5 class="mb-0">${name}</h5>
                                        <div class="star-rating">${generateStarRating(rating)}</div>
                                    </div>
                                </div>

                                <!-- Right-aligned platform link -->
                                <a href="${url}"
                                   class="btn btn-sm btn-link p-0" title="View on ${categoryName}" target="_blank">

                                    ${categoryId === 'googlemaps' ? 
                                        '<img src="assets/img/icons/icons8-google-240.svg" style="height: 40px; width: 40px;">' :
                                        categoryId === 'tripadvisor' ? 
                                            '<img src="assets/img/icons/tripadvisor-icon.svg" style="height: 40px; width: 40px;">' :
                                            '<img src="assets/img/icons/yelp-icon.svg" style="height: 40px; width: 40px;">'}

                                </a>
                            </div>
                            <p>${comment}</p>
                            <small class="text-muted">${date}</small>
                        </div>
                    `;
                
                row.appendChild(col);
            }
        });    
        currentReviewsContainer.appendChild(row);
    });
}




document.addEventListener('DOMContentLoaded', function () {
    loadCurrentPage()
});

// Run on initial load
document.addEventListener('DOMContentLoaded', scrollToAnchor);

document.addEventListener('DOMContentLoaded', function () {
    // Insert header and footer
    document.getElementById('header-placeholder').innerHTML = generateHeader();
});


// Insert header and footer on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const footerHTML = await generateFooter('en'); // Language: 'en'
        document.getElementById('footer-placeholder').innerHTML = footerHTML;
    } catch (error) {
        console.error("Could not render footer:", error);
        document.getElementById('footer-placeholder').innerHTML =
            '<p class="error">Failed to load footer. Please refresh.</p>';
    }
});