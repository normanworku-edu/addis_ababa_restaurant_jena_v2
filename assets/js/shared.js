/* Global Variables
    * These variables are used throughout the script to manage the state and behavior of the application.
    * They include the current language, the admin login status, and the home page content data.
    * These variables are initialized at the start of the script and are used in various functions to ensure consistent behavior across the application.
*/
let headerImage = "assets/img/shared/headerImage.png";
let footerImage =  "assets/img/shared/footerImage.jpg";
let restaurantLogo =  "assets/img/shared/logo.png";

/**
 * Shared functionality across all pages
 * Includes language switching, header/footer generation, and common utilities
 */
function generateStarRating(rating) {
    // Handle non-numeric cases (null, undefined, string, etc.)
    const numericRating = Number(rating);
    const validatedRating = isNaN(numericRating) 
      ? 0 
      : Math.min(5, Math.max(0, Math.round(numericRating)));
    
    return `
      <div class="star-rating" 
           data-rating="${rating}" 
           data-calculated="${validatedRating}"
           title="${validatedRating} out of 5">
        ${'★'.repeat(validatedRating)}${'☆'.repeat(5 - validatedRating)}
      </div>
    `;
  }
  
// DOM elements
const languageSwitcher = document.getElementById('language-switcher');
const currentLanguage = localStorage.getItem('language') || 'de';

// Initialize the page with translations
document.addEventListener('DOMContentLoaded', function() {
    loadTranslations(currentLanguage);
    setActiveLanguage(currentLanguage);
    initWhatsAppButton();
    initMobileMenu();


    // Implement auto-collapsing behaviors in Bootstrap:


});

// Scroll to category
document.addEventListener('click', function(event) {
    // Check if the clicked element (or its parent) has the class 'scroll-to-category'
    const btn = event.target.closest('.scroll-to-category');
    
    if (btn) {
      const target = btn.getAttribute('data-target');
      
      // Update URL with hash (triggers hashchange)
      history.pushState(null, null, `#${target}`);
      setTimeout(() => {
        history.pushState(null, null, `#${target}`);
      }, 10);
  
      scrollToAnchor(); // Your existing scroll function
    }
  });


// Language switching functionality
function setActiveLanguage(lang) {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-warning'); // Remove the yellowish color
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
            btn.classList.add('btn-warning'); // Add yellowish color to the selected button
        } else {
            btn.classList.add('btn-outline-light'); // Ensure other buttons are outlined
        }
    });
    localStorage.setItem('language', lang);
}









// Load translations from JSON files
// `loadTranslations2` is an alternative implementation of `loadTranslations`.
// Unlike `loadTranslations`, which fetches language-specific files (e.g., `de.json` or `en.json`),
// `loadTranslations2` fetches a single consolidated file (`translations.json`) containing all translations.
// This approach is useful when all translations are stored in one file to reduce the number of HTTP requests.
const failedLanguages = new Set();

async function loadTranslations(lang) {
    try {
        if (failedLanguages.has(lang)) {
            console.error(`Skipping retry for failed language: ${lang}`);
            return;
        }

        const response = await fetch(`assets/translations/translations.json`);
        if (!response.ok) throw new Error('Translation file not found');
        
        const translations = await response.json();
        applyTranslations(translations, lang);
    } catch (error) {
        console.error('Error loading translations:', error);
        failedLanguages.add(lang); // Mark this language as failed

        // Fallback to German if translation fails
        if (lang !== 'de') {
            loadTranslations('de');
        }
    }
}

// Apply translations to the page
// Expected structure of the `translations` object:
// {
//   "translate": {
//     "key1": { "en": "value1", "de": "wert1" },
//     "key2": { "en": "value2", "de": "wert2" },
//     ...
//   }
// }
function applyTranslations(translations, lang) {
    // Translate all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations.translate[key] && translations.translate[key][lang]) {
            element.textContent = translations.translate[key][lang];
        }
    });

    // Translate all elements with data-translate-placeholder attribute
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations.translate[key] && translations.translate[key][lang]) {
            element.setAttribute('placeholder', translations.translate[key][lang]);
        }
    });

    // Translate page title if available
    if (translations.translate['pageTitle'] && translations.translate['pageTitle'][lang]) {
        document.title = translations.translate['pageTitle'][lang];
    }

    loadCurrentPage();
}




// Initialize WhatsApp button
function initWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/4917685905441?text=' + encodeURIComponent('Hello, I have a question about your restaurant.');
    whatsappBtn.className = 'whatsapp-button';
    whatsappBtn.target = '_blank';
    whatsappBtn.innerHTML = '<i class="bi bi-whatsapp"></i>';
    document.body.appendChild(whatsappBtn);
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('main-nav');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Event delegation for language switcher
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lang-btn')) {
        e.preventDefault();
        const lang = e.target.dataset.lang;
        loadTranslations(lang);
        setActiveLanguage(lang);
    }
});

// Generate header HTML (to be inserted in each page)
function generateHeader() {
    return `
    <header class="sticky-top">
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #5A3E1B;">
            <div class="container">
                <!-- Circular Logo with Hover Effect -->
                <a href="index.html" class="d-inline-block">
                <div class="rounded-circle overflow-hidden" 
                    style="width: 60px; height: 60px; transition: transform 0.3s ease;" 
                    onmouseover="this.style.transform='scale(1.2)'" 
                    onmouseout="this.style.transform='scale(1)'">
                    <img src=${restaurantLogo} alt="Restaurant Logo" 
                        class="w-100 h-100 object-fit-cover">
                </div>
                </a>

                <button id="mobile-menu-toggle" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="main-nav">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link text-white" href="index.html" data-translate="navHome">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="menu.html" data-translate="navMenu">Menu</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="reservations.html" data-translate="navReservations">Reservations</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="gallery.html" data-translate="navGallery">Gallery</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="reviews.html" data-translate="navReviews">Reviews</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" href="contact.html" data-translate="navContact">Contact</a>
                        </li>
                    </ul>
                    <div class="language-switcher ms-3">
                        <button class="btn btn-sm lang-btn ${currentLanguage === 'de' ? 'btn-warning' : 'btn-outline-light'}" data-lang="de">DE</button>
                        <button class="btn btn-sm lang-btn ${currentLanguage === 'en' ? 'btn-warning' : 'btn-outline-light'}" data-lang="en">EN</button>
                        <button class="btn btn-sm lang-btn ${currentLanguage === 'am' ? 'btn-warning' : 'btn-outline-light'}" data-lang="am">አማ</button>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    `;
}






// Generate footer HTML (to be inserted in each page)
function generateFooter2() {
    return `
    <footer class="footer py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5 class="footer-heading" data-translate="footerHours">Opening Hours</h5>
                    <ul class="list-unstyled">
                        <li data-translate="footerMonFri">Monday - Friday: 11:00 - 22:00</li>
                        <li data-translate="footerSatSun">Saturday - Sunday: 12:00 - 23:00</li>
                    </ul>
                </div>
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5 class="footer-heading" data-translate="footerContact">Contact</h5>
                    <address>
                        <p data-translate="footerAddress">123 Ethiopian Street, Berlin, Germany</p>
                        <p>Tel: <a href="tel:+49123456789">+49 123 456 789</a></p>
                        <p>Email: <a href="mailto:info@ethiopian-restaurant.com">info@ethiopian-restaurant.com</a></p>
                    </address>
                </div>
                <div class="col-md-4">
                    <h5 class="footer-heading" data-translate="footerFollow">Follow Us</h5>
                    <div class="social-icons">
                        <a href="#" class="text-white me-2"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white me-2"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="text-white me-2"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="text-white"><i class="bi bi-tripadvisor"></i></a>
                    </div>
                    <div class="mt-3">
                        <a href="admin.php" class="btn btn-sm btn-outline-light">Admin</a>
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p class="mb-0" data-translate="footerCopyright">© 2023 Ethiopian Restaurant. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
}






















// Fetch contact info from the JSON file
async function fetchContactInfo_fromJson() {
    try {
        const response = await fetch('assets/json/contactInfo.json'); // Updated path
        if (!response.ok) {
            throw new Error(`Failed to fetch contact info: ${response.status}`);
        }
        return await response.json(); // Return the parsed JSON data
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return null; // Return null or a default value if there's an error
    }
}

// Fetch opening hours from the JSON file
async function fetchOpeningHours_fromJson() {
    try {
        const response = await fetch('assets/json/openingHours.json'); // Updated path
        if (!response.ok) {
            throw new Error(`Failed to fetch opening hours: ${response.status}`);
        }
        return await response.json(); // Return the parsed JSON data
    } catch (error) {
        console.error('Error fetching opening hours:', error);
        return null; // Return null or a default value if there's an error
    }
}

let openingHours = null;
let contactInfo = null;

// Properly assign to global variables
fetchOpeningHours_fromJson().then(data => {
    openingHours = data;
    console.log("Opening hours loaded");
}).catch(console.error);

fetchContactInfo_fromJson().then(data => {
    contactInfo = data;
    console.log("Contact info loaded");
}).catch(console.error);


async function generateFooter(currentLanguage = 'de') {
    // Load data if not already available
    if (!openingHours || !contactInfo) {
        try {
            [openingHours, contactInfo] = await Promise.all([
                fetchOpeningHours_fromJson(),
                fetchContactInfo_fromJson()
            ]);
        } catch (error) {
            console.error("Footer data loading failed:", error);
            return `<footer class="text-center p-4 bg-warning">Data unavailable</footer>`;
        }
    }
    // Helper function to format consecutive days with same hours
    function formatOpeningHours(days) {
        const result = [];
        let currentRange = null;
        
        days.forEach((day, index) => {
            const dayName = day.name[currentLanguage] || day.name.en;
            const hours = day.isClosed ? 'Closed' : 
                          day.openingHours.length ? day.openingHours[0] : 'Closed';
            
            if (!currentRange) {
                currentRange = {
                    start: dayName,
                    end: dayName,
                    hours: hours
                };
            } else if (currentRange.hours === hours) {
                currentRange.end = dayName;
            } else {
                result.push(currentRange);
                currentRange = {
                    start: dayName,
                    end: dayName,
                    hours: hours
                };
            }
            
            if (index === days.length - 1) {
                result.push(currentRange);
            }
        });
        
        return result.map(range => {
            if (range.start === range.end) {
                return `${range.start}: ${range.hours}`;
            } else {
                return `${range.start}-${range.end}: ${range.hours}`;
            }
        });
    }


    if (!openingHours || !contactInfo) {
        console.error("Failed to load footer data");
        return "<footer>Error loading data</footer>"; // Fallback HTML
    }

    // Format address
    const address = contactInfo.address;
    const formattedAddress = `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
    
    // Format contact numbers
    const phoneNumbers = Object.values(contactInfo.contactNumbers)
        .map(num => `<a href="tel:${num.replace(/\D/g, '')}">${num}</a>`)
        .join('<br>');
    
    // Format social media links
    const socialMediaLinks = Object.entries(contactInfo.socialMedia)
        .filter(([_, sm]) => !sm.isHidden)
        .map(([key, sm]) => {
            let icon;
            if (sm.icon.startsWith('data:')) {
                // Base64 encoded image
                icon = `<img src="${sm.icon}" alt="${key}" style="width:24px;height:24px;">`;
            } else {
                // Regular image URL
                icon = `<img src="${sm.icon}" alt="${key}" style="width:24px;height:24px;">`;
            }
            return `<a href="${sm.link}" target="_blank" class="text-white me-3">${icon}</a>`;
        })
        .join('');

    // Generate HTML
    return `
    <footer class="footer py-5 bg-dark text-white">
        <div class="container">
            <div class="row g-4">
                <!-- Opening Hours Column -->
                <div class="col-lg-6">
                    <h5 class="footer-heading mb-4" data-translate="footerHours">Opening Hours</h5>
                    <ul class="list-unstyled">
                        ${formatOpeningHours(openingHours.days).map(hours => 
                            `<li class="mb-2">${hours}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <!-- Contact Information Column -->
                <div class="col-lg-6">
                    <h5 class="footer-heading mb-4" data-translate="footerContact">Contact</h5>
                    <address class="mb-0">
                        <p class="mb-2">${formattedAddress}</p>
                        <p class="mb-2">${phoneNumbers}</p>
                        <p class="mb-0">
                            <a href="mailto:${contactInfo.email}" class="text-white">${contactInfo.email}</a>
                        </p>
                    </address>
                </div>
            </div>
            
            <!-- Social Media Row -->
            <div class="row mt-5">
                <div class="col-12 text-center">
                    <div class="social-icons d-flex justify-content-center">
                        ${socialMediaLinks}
                    </div>
                    ${contactInfo.additionalLinks?.website ? `
                    <div class="mt-3">
                        <a href="${contactInfo.additionalLinks.website.link}" target="_blank" class="btn btn-sm btn-outline-light">
                            <i class="bi bi-globe me-1"></i> Visit Our Website
                        </a>
                    </div>
                    ` : ''}
                    <div class="mt-3">
                        <a href="admin.php" class="btn btn-sm btn-outline-light">
                            <i class="bi bi-gear me-1"></i> Admin
                        </a>
                    </div>
                </div>
            </div>
            
            <hr class="my-4">
            <div class="text-center">
                <p class="mb-0" data-translate="footerCopyright">
                    © ${new Date().getFullYear()} Ethiopian Restaurant. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
    `;
}