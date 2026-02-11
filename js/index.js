// Use proxied API path - works for both HTTP and HTTPS, no mixed content issues
const API_BASE_URL = '/api/';

import { auth } from './firebase-config.js'; // Import the auth object
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

// Global reference for current user
let currentUser = null;

function initFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.displayName || user.email);

            // Update UI for authenticated user
            const authButtonsContainer = document.getElementById('auth-buttons-container');
            const userAvatarContainer = document.getElementById('user-avatar-container');
            const userAvatarImg = document.getElementById('user-avatar-img');

            if (authButtonsContainer) authButtonsContainer.style.display = 'none';
            if (userAvatarContainer) {
                userAvatarContainer.style.display = 'block';
                userAvatarImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName ? user.displayName.substring(0, 2) : user.email.substring(0, 2).toUpperCase()}&background=FBBF24&color=000&size=128`;
            }
            
            // Check if on a login/signup specific page and redirect to portal.html
            // Assuming current page is index.html and portal.html is the target dashboard
            if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
                window.location.href = './portal.html';
            }

        } else {
            // User is signed out
            console.log('User is signed out.');

            // Update UI for unauthenticated user
            const authButtonsContainer = document.getElementById('auth-buttons-container');
            const userAvatarContainer = document.getElementById('user-avatar-container');
            
            if (authButtonsContainer) authButtonsContainer.style.display = 'flex';
            if (userAvatarContainer) userAvatarContainer.style.display = 'none';

            // If on portal.html (protected page), redirect to index.html (login page)
            if (window.location.pathname.endsWith('/portal.html')) {
                window.location.href = './index.html';
            }
        }
    });
}

// Function to create and store news feed posts
function createAndStoreNewsPost(postData) {
    const NEWS_FEED_KEY = 'tbs_news_feed_posts';
    let posts = JSON.parse(localStorage.getItem(NEWS_FEED_KEY) || '[]');

    // Create a unique identifier for the post (topic + week)
    const postIdentifier = `${postData.topic}-${postData.week}`;

    // Check if a similar post for this topic and week already exists
    const existingPostIndex = posts.findIndex(p => p.identifier === postIdentifier);

    const newPost = {
        id: Date.now(), // Unique ID, or use a more robust UUID for very high volume
        identifier: postIdentifier,
        title: postData.title,
        snippet: postData.snippet,
        imageUrl: postData.imageUrl,
        topic: postData.topic,
        week: postData.week,
        timestamp: new Date().toISOString()
    };

    if (existingPostIndex > -1) {
        // Update existing post (e.g., if content changed, though not expected here)
        posts[existingPostIndex] = newPost;
    } else {
        // Add new post to the beginning of the array (most recent first)
        posts.unshift(newPost);
        // Optionally, limit the number of posts to prevent localStorage bloat
        // posts = posts.slice(0, 50); // Keep last 50 posts
    }

    localStorage.setItem(NEWS_FEED_KEY, JSON.stringify(posts));
    console.log(`News feed post for ${postData.title} (Week ${postData.week}) stored.`);
}

// Theme Persistence Loader
function applyTheme() {
    const saved = localStorage.getItem('tbs_portal_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.documentElement.style.setProperty('--orange', settings.primaryColor);
        document.documentElement.style.setProperty('--gold', settings.secondaryColor);
        document.documentElement.style.setProperty('--dark-bg', settings.bgColor);
        document.documentElement.style.setProperty('--card-bg', settings.cardColor);

        document.body.style.fontSize = settings.fontSize + 'px';
        document.body.style.fontFamily = settings.bodyFont;
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
            el.style.fontFamily = settings.headingFont;
        });

        document.body.style.animation = settings.enableAnimations ? '' : 'none';
        document.body.classList.toggle('no-hover', !settings.hoverEffects);
        document.body.classList.toggle('compact', settings.compactMode);

        const gridBg = document.getElementById('shape-container');
        if (gridBg) {
            gridBg.style.display = settings.gridLines ? 'block' : 'none';
        }
    }
}

// Role-Based Access Control
// Role-Based Access Control - now uses Firebase currentUser for auth status
function checkAccess() {
    // Determine if user is authenticated via Firebase
    const isAuthenticated = currentUser !== null; // currentUser is set by onAuthStateChanged

    // For now, simplify roles - assume authenticated users might have more access than guests.
    // Real role management would fetch custom claims from Firebase or a backend.
    const isEmployee = isAuthenticated; // Simplified: all authenticated users are "employees" for tab access

    const tabs = document.querySelectorAll('.tabs .tab-dropdown');
    // Define restricted tabs by index (0-indexed based on index.html)
    // 0: API Keys, 2: Monitoring, 3: Servers, 6: Tools
    const restrictedIndices = [0, 2, 3, 6];

    tabs.forEach((tab, index) => {
        if (restrictedIndices.includes(index)) {
            tab.style.display = isEmployee ? 'block' : 'none';
        }
    });

    // UI elements for authButtonsContainer and userAvatarContainer are now handled by onAuthStateChanged
    // The previous logic for these elements is being moved out of checkAccess.
}

// Show a specific server/content section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.server-section, .content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';

        // Update the appropriate tab button based on section type
        const serversButton = document.querySelectorAll('.tab-dropdown .tab-button')[3]; // Servers is 4th tab
        const monitoringButton = document.querySelectorAll('.tab-dropdown .tab-button')[2]; // Monitoring is 3rd tab
        const toolsButton = document.querySelectorAll('.tab-dropdown .tab-button')[6]; // Tools is 7th tab

        const serverNames = {
            'HomeServerMain': 'Home Server',
            'MailServer': 'Mail Server',
            'CloudServer': 'Cloud Server',
            'BusinessServer': 'Business Server',
            'ArtsServer': 'Arts Server',
            'HomeAssistantServer': 'Home Assistant',
            'pfSenseServer': 'pfSense',
            'OMVServer': 'OMV',
            'VirtualMachines': 'Virtual Machines'
        };

        // Remove active from all tabs first
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-selection'));

        if (serverNames[sectionId]) {
            serversButton.textContent = serverNames[sectionId] + ' ▼';
            serversButton.classList.add('active-selection');
        } else if (sectionId === 'Monitoring' || sectionId === 'Dashboards') {
            // Highlight the Monitoring tab for both Monitoring and Dashboards sections
            if (monitoringButton) {
                monitoringButton.classList.add('active-selection');
            }
        } else if (sectionId === 'ServiceDashboard') {
            // For Tools/ServiceDashboard, highlight the Tools tab instead
            if (toolsButton) {
                toolsButton.classList.add('active-selection');
            }
        }

        // Check status of buttons in this section
        setTimeout(() => {
            selectedSection.querySelectorAll('.app-button').forEach(button => {
                const appName = button.getAttribute('data-app-name');
                if (appName) checkStatus(appName, button);
            });
        }, 100);
    }
}

// Show service content
function showServiceContent(serviceName) {
    showSection('ServicesContent');
    const serviceContent = document.querySelector('#ServicesContent .service-content');

    const serviceData = {
        'JunkRemoval': { title: 'Junk Removal', html: '<h2>Junk Removal Service</h2><p>Contact us for junk removal services.</p>' },
        'MovingHauling': { title: 'Moving & Hauling', html: '<h2>Moving & Hauling Service</h2><p>Professional moving and hauling services.</p>' },
        'DogWalking': { title: 'Dog Walking', html: '<h2>Dog Walking Service</h2><p>Reliable dog walking services.</p>' },
        'CleaningCommercial': { title: 'Cleaning - Commercial', html: '<h2>Commercial Cleaning Services</h2><p>Professional commercial cleaning.</p>' },
        'CleaningResidential': { title: 'Cleaning - Residential', html: '<h2>Residential Cleaning Services</h2><p>Quality residential cleaning.</p>' },
        'CellphoneRepair': { title: 'Cellphone Repair', html: '<h2>Cellphone Repair Service</h2><p>Fast and affordable cellphone repairs.</p>' },
        'MobileLaundryMat': { title: 'Mobile Laundry Mat', html: '<h2>Mobile Laundry Mat</h2><p>On-demand laundry services.</p>' }
    };

    if (serviceContent && serviceData[serviceName]) {
        serviceContent.innerHTML = serviceData[serviceName].html;

        // Update Services tab button
        const servicesButton = document.querySelectorAll('.tab-dropdown .tab-button')[1];
        if (servicesButton) {
            servicesButton.textContent = serviceData[serviceName].title + ' ▼';

            // Highlight the active tab
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-selection'));
            servicesButton.classList.add('active-selection');
        }
    }
}

// Show shopping content
function showShoppingContent(platformName) {
    showSection('ShoppingContent');
    const shoppingContent = document.querySelector('#ShoppingContent .shopping-content');

    const platformData = {
        'eBay': { title: 'eBay', html: '<h2>eBay Store</h2><p><a href="https://www.ebay.com" target="_blank">Go to eBay</a></p>' },
        'Shopify': { title: 'Shopify', html: '<h2>Shopify Store</h2><p><a href="https://www.shopify.com" target="_blank">Go to Shopify</a></p>' },
        'AmazonFBA': { title: 'Amazon FBA', html: '<h2>Amazon FBA</h2><p><a href="https://sellercentral.amazon.com" target="_blank">Go to Seller Central</a></p>' },
        'FacebookStore': { title: 'Facebook Store', html: '<h2>Facebook Store</h2><p><a href="https://www.facebook.com/marketplace" target="_blank">Go to Facebook Marketplace</a></p>' },
        'Craigslist': { title: 'Craigslist', html: '<h2>Craigslist</h2><p><a href="https://www.craigslist.org" target="_blank">Go to Craigslist</a></p>' }
    };

    if (shoppingContent && platformData[platformName]) {
        shoppingContent.innerHTML = platformData[platformName].html;

        // Update Shopping tab button
        const shoppingButton = document.querySelectorAll('.tab-dropdown .tab-button')[2];
        if (shoppingButton) {
            shoppingButton.textContent = platformData[platformName].title + ' ▼';

            // Highlight the active tab
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-selection'));
            shoppingButton.classList.add('active-selection');
        }
    }
}

function showProductsContent() {
    showSection('ProductsContent');
    loadProducts();
}

function loadProducts() {
    // Fetch products from database API with featured products and count
    // Use HTTPS to match the API server
    const apiUrl = API_BASE_URL + 'products';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Update product count
            const countElement = document.getElementById('product-count');
            countElement.textContent = `${data.count || 0} Products`;

            // Load featured products carousel
            const featuredCarousel = document.querySelector('.featured-carousel');
            featuredCarousel.innerHTML = '';

            if (data.featured && data.featured.length > 0) {
                data.featured.forEach(product => {
                    const featuredCard = document.createElement('div');
                    featuredCard.className = 'featured-card';
                    featuredCard.innerHTML = `
                        <img src="${product.image}"
                             alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/200/F97316/FFFFFF?Text=No+Image'">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    `;
                    featuredCarousel.appendChild(featuredCard);
                });
            } else {
                featuredCarousel.innerHTML = '<p style="color: #666;">No featured products yet.</p>';
            }

            // Load all products grid
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = '';

            const products = data.all || [];
            if (products.length === 0) {
                productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products in inventory yet. Scan barcodes to add products!</p>';
                return;
            }

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                // Build media HTML with video support
                let mediaHTML = '';
                if (product.video) {
                    // Has video - show image by default, play video on hover
                    mediaHTML = `
                        <div class="product-media" style="position: relative; height: 200px;">
                            <img class="product-image"
                                 src="${product.image}"
                                 alt="${product.name}"
                                 onerror="this.src='https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'"
                                 style="width: 100%; height: 100%; object-fit: contain; display: block;">
                            <video class="product-video"
                                   src="${product.video}"
                                   loop
                                   muted
                                   preload="auto"
                                   playsinline
                                   style="width: 100%; height: 100%; object-fit: contain; position: absolute; top: 0; left: 0; display: none;">
                            </video>
                        </div>
                    `;
                } else {
                    // No video - just show image
                    mediaHTML = `
                        <img src="${product.image}"
                             alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'"
                             style="width: 100%; max-height: 200px; object-fit: contain;">
                    `;
                }

                productCard.innerHTML = `
                    ${mediaHTML}
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                `;

                // Add hover events if video exists
                if (product.video) {
                    productCard.addEventListener('mouseenter', function () {
                        const img = this.querySelector('.product-image');
                        const video = this.querySelector('.product-video');
                        if (img && video) {
                            img.style.display = 'none';
                            video.style.display = 'block';
                            video.play();
                        }
                    });

                    productCard.addEventListener('mouseleave', function () {
                        const img = this.querySelector('.product-image');
                        const video = this.querySelector('.product-video');
                        if (img && video) {
                            video.pause();
                            video.currentTime = 0;
                            video.style.display = 'none';
                            img.style.display = 'block';
                        }
                    });
                }

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products from database:', error);
            const productGrid = document.getElementById('product-grid');
            const countElement = document.getElementById('product-count');
            countElement.textContent = 'Error';
        });
}




// Generate random background shapes - EDUCATIONAL GEOMETRY
function generateRandomShapes() {
    const shapeContainer = document.getElementById('shape-container');
    if (!shapeContainer) return;

    // Clear existing background shapes but preserve the gold cross
    const existingShapes = shapeContainer.querySelectorAll('.background-shape');
    existingShapes.forEach(shape => shape.remove());

    const numShapes = Math.floor(Math.random() * 201); // 0-200 shapes
    const shapeTypes = [
        // Basic shapes
        'circle', 'square', 'rectangle', 'triangle',
        // Quadrilaterals
        'parallelogram', 'rhombus', 'trapezoid', 'kite', 'quadrilateral',
        // Polygons (3-12 sides)
        'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon', 'hendecagon', 'dodecagon',
        // Stars
        'star', 'star6', 'star8',
        // Curved shapes
        'ellipse', 'oval', 'crescent', 'semicircle',
        // Special shapes
        'diamond', 'arrow', 'chevron', 'cross', 'plus', 'heart', 'teardrop',
        // L and T shapes
        'lshape', 'tshape'
    ];

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = Math.floor(Math.random() * 158) + 2; // 2-159px size variation

        shape.className = 'background-shape ' + shapeType;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.transform = `rotate(${Math.random() * 360}deg)`;

        shapeContainer.appendChild(shape);
    }

    console.log('Generated ' + numShapes + ' educational geometric shapes across ' + shapeTypes.length + ' different types');
}

// Position the gold cross randomly (always upright)
function positionGoldCross() {
    const goldCross = document.getElementById('gold-cross');
    if (goldCross) {
        // Random position (10% to 90% of viewport to avoid edges)
        const randomLeft = Math.random() * 80 + 10;
        const randomTop = Math.random() * 80 + 10;

        goldCross.style.left = randomLeft + '%';
        goldCross.style.top = randomTop + '%';
        goldCross.style.transform = 'translate(-50%, -50%)'; // Center the cross at that position
    }
}

// Random Bible verses - loaded from external file
async function setRandomBibleVerse() {
    try {
        const response = await fetch('few-verses.txt');
        const text = await response.text();
        const verses = text.split('\n').filter(line => line.trim() !== '');

        if (verses.length > 0) {
            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            document.getElementById('bible-verse').textContent = randomVerse;
        } else {
            document.getElementById('bible-verse').textContent = "The Lord bless you and keep you. - Numbers 6:24";
        }
    } catch (error) {
        console.error('Error loading verses:', error);
        document.getElementById('bible-verse').textContent = "The Lord bless you and keep you. - Numbers 6:24";
    }
}

// --- Firebase Auth Functions ---

// Sign in with Google
function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // Google Sign-In successful. onAuthStateChanged will handle UI updates and redirects.
            console.log("Google Sign-In successful!", result.user);
        })
        .catch((error) => {
            console.error("Google Sign-In error:", error);
            alert(`Google Sign-In failed: ${error.message}`);
        });
}

// Sign out
function signOutUser() {
    signOut(auth).then(() => {
        // Sign-out successful. onAuthStateChanged will handle UI updates and redirects.
        console.log("User signed out.");
    }).catch((error) => {
        console.error("Sign-out error:", error);
        alert(`Sign-out failed: ${error.message}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply theme and initialize Keycloak
        applyTheme();
        initFirebaseAuth();
    
        // --- Connect Firebase Auth functions to UI elements ---
        const googleSignInButton = document.getElementById('google-signin-button');
        if (googleSignInButton) {
            googleSignInButton.addEventListener('click', signInWithGoogle);
        } else {
            console.warn("Element with ID 'google-signin-button' not found. Google Sign-In button may not be functional.");
        }
    
        const signOutButton = document.getElementById('signout-button');
        if (signOutButton) {
            signOutButton.addEventListener('click', signOutUser);
        } else {
            console.warn("Element with ID 'signout-button' not found. Sign-out button may not be functional.");
        }
    


    // Set random Bible verse
    setRandomBibleVerse();

    // Rotate verses every 30 seconds
    setInterval(setRandomBibleVerse, 30000);

    // Generate random background shapes
    generateRandomShapes();

    // Position the gold cross
    positionGoldCross();

    // Don't show any section by default - wait for user to click a tab
    // All sections are hidden until a tab is selected
    document.querySelectorAll('.server-section, .content-section').forEach(section => {
        section.style.display = 'none';
    });

    const searchBar = document.getElementById('searchBar');
    const mainContent = document.getElementById('main-content');
    const searchResultsContainer = document.getElementById('searchResults');
    const searchResultsGrid = searchResultsContainer.querySelector('.button-grid');
    const allButtons = document.querySelectorAll('#main-content .app-button');

    if (searchBar) {
        searchBar.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();

            // Clear previous search results
            searchResultsGrid.innerHTML = '';

            if (searchTerm === '') {
                // If search is cleared, hide results and show default content
                searchResultsContainer.style.display = 'none';
                mainContent.style.display = 'block';
                // No longer showing a default section
                // Just keep everything hidden until a tab is clicked
                return;
            }

            // Hide main content and show search results container
            mainContent.style.display = 'none';
            searchResultsContainer.style.display = 'block';

            let matchFound = false;

            allButtons.forEach(button => {
                const appName = button.getAttribute('data-app-name');
                const buttonText = button.querySelector('span');

                if (appName && buttonText) {
                    const nameMatch = appName.toLowerCase().includes(searchTerm);
                    const textMatch = buttonText.textContent.toLowerCase().includes(searchTerm);

                    if (nameMatch || textMatch) {
                        matchFound = true;
                        // Clone the button and append it to the search results grid
                        const buttonClone = button.cloneNode(true);
                        // Ensure cloned buttons are visible and functional
                        buttonClone.style.display = 'inline-flex';
                        searchResultsGrid.appendChild(buttonClone);
                    }
                }
            });

            if (!matchFound) {
                searchResultsGrid.innerHTML = '<p style="color: #ccc;">No applications or services found.</p>';
            }
        });
    }

    document.querySelectorAll('.app-button').forEach(button => {
        const appName = button.getAttribute('data-app-name');
        const uniqueColor = getColor(appName);

        // Add caret indicator to each button
        if (!button.querySelector('.caret')) {
            const caret = document.createElement('span');
            caret.className = 'caret';
            button.appendChild(caret);
        }

        // Add port number display in top-left corner
        const port = button.getAttribute('data-port');
        if (port && port !== '' && port !== '0' && !button.querySelector('.port-badge')) {
            const portBadge = document.createElement('span');
            portBadge.className = 'port-badge';
            portBadge.textContent = port;
            button.appendChild(portBadge);
        }

        // Right-click to toggle visual state (for testing glow effect)
        button.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (this.classList.contains('on')) {
                this.classList.remove('on');
                this.classList.add('off');
                this.style.backgroundColor = '#1a1a1a';
            } else {
                this.classList.remove('off');
                this.classList.add('on');
                this.style.backgroundColor = uniqueColor;
            }
        });

        // Create dropdown menu for each button
        const dropdownId = `dropdown-${appName}`;
        if (!document.getElementById(dropdownId)) {
            const dropdown = document.createElement('div');
            dropdown.id = dropdownId;
            dropdown.className = 'app-button-dropdown';
            button.appendChild(dropdown);
        }

        // Add the press-down effect listeners
        button.addEventListener('mousedown', function () {
            this.classList.add('pressed');
        });
        button.addEventListener('mouseup', function () {
            this.classList.remove('pressed');
        });
        button.addEventListener('mouseleave', function () {
            this.classList.remove('pressed');
        });

        // Main Click Handler
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const port = this.getAttribute('data-port');
            const isCurrentlyOn = this.classList.contains('on');
            const dropdown = document.getElementById(`dropdown-${appName}`);

            // Close all other dropdowns first and reset z-index
            document.querySelectorAll('.app-button').forEach(btn => {
                btn.style.zIndex = '';
            });
            document.querySelectorAll('.app-button-dropdown').forEach(d => {
                if (d.id !== `dropdown-${appName}`) {
                    d.classList.remove('show');
                }
            });

            // Set high z-index on this button
            this.style.zIndex = '10000';

            // Build dropdown content based on current state
            if (isCurrentlyOn) {
                dropdown.innerHTML = `
                    <div class="app-button-dropdown-item go-to-page" data-action="goto">
                        <span>🌐</span> Go to Page
                    </div>
                    <div class="app-button-dropdown-item stop-service" data-action="stop">
                        <span>⏹</span> Stop Service
                    </div>
                `;
            } else {
                dropdown.innerHTML = `
                    <div class="app-button-dropdown-item go-to-page" data-action="start">
                        <span>▶</span> Start Service
                    </div>
                `;
            }

            // Check if dropdown should appear above or below button
            const buttonRect = this.getBoundingClientRect();
            const dropdownHeight = 100; // Approximate dropdown height
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;

            // If not enough space below and more space above, position above
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                dropdown.style.top = 'auto';
                dropdown.style.bottom = 'calc(100% + 5px)';
            } else {
                dropdown.style.top = 'calc(100% + 5px)';
                dropdown.style.bottom = 'auto';
            }

            // Add click handlers to dropdown items
            dropdown.querySelectorAll('.app-button-dropdown-item').forEach(item => {
                item.addEventListener('click', function (evt) {
                    evt.stopPropagation();
                    const action = this.getAttribute('data-action');

                    if (action === 'goto' && port) {
                        // Check if it's a VM with custom URL
                        const isVmButton = button.getAttribute('data-is-vm') === 'true';
                        const vmUrl = button.getAttribute('data-vm-url');

                        if (isVmButton && vmUrl) {
                            window.open(vmUrl, '_blank');
                        } else {
                            const protocol = button.getAttribute('data-protocol') || 'http';
                            const customIp = button.getAttribute('data-ip');
                            let targetUrl;
                            if (customIp) {
                                targetUrl = customIp + ':' + port;
                            } else if (isVM(appName)) {
                                targetUrl = getVmIp(appName) + ':' + port;
                            } else {
                                targetUrl = window.location.hostname + ':' + port;
                            }
                            window.open(protocol + '://' + targetUrl, '_blank');
                        }
                    } else if (action === 'start') {
                        // Check if it's a VM button
                        const isVmButton = button.getAttribute('data-is-vm') === 'true';
                        const vmName = button.getAttribute('data-vm-name');
                        const vmUrl = button.getAttribute('data-vm-url');

                        if (isVmButton && vmName) {
                            // Start VM and navigate to URL
                            startVM(vmName, vmUrl, button);
                        } else {
                            // Start service using Python script (includes visual feedback and browser opening)
                            startServiceWithPython(appName, button);
                        }
                    } else if (action === 'stop') {
                        // Stop the service
                        toggleStatus(appName, 'on', uniqueColor, button);
                    }

                    dropdown.classList.remove('show');
                });
            });

            dropdown.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.app-button')) {
            document.querySelectorAll('.app-button-dropdown').forEach(d => {
                d.classList.remove('show');
            });
        }
    });

    // Check status of all buttons on page load
    try {
        checkAllStatuses();
    } catch (e) {
        console.error("Failed to check statuses:", e);
    }

    // Re-check every 5 seconds for near real-time updates
    setInterval(() => {
        try {
            checkAllStatuses();
        } catch (e) { /* ignore silent failures */ }
    }, 5000);

    // Periodically update products
    setInterval(() => {
        const productsContent = document.getElementById('ProductsContent');
        if (productsContent && productsContent.style.display === 'block') {
            loadProducts();
        }
    }, 5000); // every 5 seconds

    // Close dropdown menus after selection
    document.querySelectorAll('.dropdown-menu a, .submenu a').forEach(link => {
        link.addEventListener('click', function () {
            // Hide all dropdown menus
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
                // Reset after a short delay so hover still works
                setTimeout(() => {
                    menu.style.display = '';
                }, 100);
            });
        });
    });

});

// Random colors for active buttons
const randomColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dfe6e9', '#fd79a8', '#a29bfe', '#00b894', '#e17055',
    '#0984e3', '#6c5ce7', '#fdcb6e', '#e84393', '#00cec9',
    '#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#fab1a0',
    '#81ecec', '#a29bfe', '#fd79a8', '#00b894', '#e17055'
];

// Get random color
function getRandomColor() {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
}

// Determine if a color is light or dark
function isLightColor(color) {
    // Convert hex to RGB
    let hex = color.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

// Set button color with appropriate text color
function setButtonColor(buttonElement, bgColor) {
    buttonElement.style.backgroundColor = bgColor;
    // Use dark text on light backgrounds, white text on dark backgrounds
    buttonElement.style.color = isLightColor(bgColor) ? '#000000' : '#ffffff';
}

// Function to assign unique colors (fallback for off state)
function getColor(appName) {
    const colors = {
        "LeonAI": "#007bff", "BibleServer": "#28a745", "ProductScanner": "#ffc107",
        "WazuhManager": "#dc3545", "WazuhClient": "#17a2b8", "Snort": "#6f42c1",
        "NodeRED": "#fd7e14", "Fail2Ban": "#e83e8c", "Emotion": "#20c997",
        "Jellyfin": "#9933ff", "HomeAssistant": "#00aa00", "OMV": "#3399ff",
        "Postfix": "#6610f2", "Dovecot": "#6c757d", "Matrix": "#343a40",
        "Synapse": "#0099ff", "SocioBoard": "#5555ff", "Elasticsearch": "#f0ad4e",
        "Kibana": "#5bc0de", "OpenVAS": "#5cb85c",
        "pfSense": "#ff4500"
    };
    return colors[appName] || '#6c757d';
}

// Check if an app is a VM (to handle separate IP addressing)
function isVM(appName) {
    return ["HomeAssistant", "OMV", "pfSense"].includes(appName);
}

// VM IP lookup
function getVmIp(appName) {
    switch (appName) {
        case "HomeAssistant": return '10.0.0.246'; // Home Assistant VM IP
        case "OMV": return '10.0.0.205'; // OpenMediaVault VM IP
        case "pfSense": return '10.0.0.148'; // pfSense VM IP
        default: return window.location.hostname;
    }
}

// Function to check status of all containers on page load
function checkAllStatuses() {
    document.querySelectorAll('.app-button').forEach(button => {
        const appName = button.getAttribute('data-app-name');
        checkStatus(appName, button);
    });
}

// Function to check status of a single container
function checkStatus(appName, buttonElement) {
    fetch(API_BASE_URL + 'status/' + appName)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'running') {
                buttonElement.classList.remove('off');
                buttonElement.classList.add('on');
                // Use random color for running services with appropriate text color
                setButtonColor(buttonElement, getRandomColor());
            } else {
                buttonElement.classList.remove('on');
                buttonElement.classList.add('off');
                // Force reset to off state - remove ALL inline styles
                buttonElement.removeAttribute('style');
            }
        })
        .catch(error => {
            console.error('Error checking status for:', appName, error);
        });
}

// Function to communicate with Python backend
function toggleStatus(appName, currentStatus, uniqueColor, buttonElement) {
    fetch(API_BASE_URL + 'toggle/' + appName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'running') {
                buttonElement.classList.remove('off');
                buttonElement.classList.add('on');
                // Use random color when service starts with appropriate text color
                setButtonColor(buttonElement, getRandomColor());
            } else if (data.status === 'off') {
                buttonElement.classList.remove('on');
                buttonElement.classList.add('off');
                // Force reset to off state - remove ALL inline styles
                buttonElement.removeAttribute('style');
            }
        })
        .catch(error => {
            console.error('Error toggling container:', appName, error);
            alert(`Error communicating with the backend for ${appName}.`);
        });
}

// VM Control Functions
function startVM(vmName, url, buttonElement) {
    // Show loading state
    const message = url
        ? `Starting ${vmName} VM and navigating to interface...`
        : `Starting ${vmName} VM...`;

    if (confirm(message + '\n\nThis will power on the virtual machine. Continue?')) {
        // Set button to loading/colored state
        if (buttonElement) {
            buttonElement.classList.remove('off');
            buttonElement.classList.add('on');
            setButtonColor(buttonElement, '#FFA500'); // Orange for starting
        }

        // Call API to start VM
        fetch(API_BASE_URL + 'vm/start/' + vmName, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.status === 'already_running') {
                        // VM is already running - set to green glow
                        if (buttonElement) {
                            setButtonColor(buttonElement, getRandomColor());
                        }
                        alert(`${vmName} is already running!`);
                        if (url) {
                            window.open(url, '_blank');
                        }
                    } else if (data.status === 'started') {
                        // VM started successfully - set to green glow
                        if (buttonElement) {
                            setButtonColor(buttonElement, getRandomColor());
                        }
                        alert(`${vmName} started successfully! Opening in new tab...`);
                        if (url) {
                            // Wait 15 seconds for VM to fully boot, then open
                            setTimeout(() => {
                                window.open(url, '_blank');
                            }, 15000);
                        }
                    }
                } else {
                    // Failed - reset to off
                    if (buttonElement) {
                        buttonElement.classList.remove('on');
                        buttonElement.classList.add('off');
                        buttonElement.removeAttribute('style');
                    }
                    alert(`Failed to start ${vmName}: ${data.error || 'Unknown error'}`);
                }
            })
            .catch(error => {
                console.error('Error starting VM:', vmName, error);
                alert(`Error communicating with backend for ${vmName}.`);
            });
    }
}

// Function to start service using Python script
function startServiceWithPython(appName, buttonElement) {
    // Set button to loading state
    buttonElement.classList.remove('off');
    buttonElement.classList.add('on');
    setButtonColor(buttonElement, '#FFA500'); // Orange for starting

    // Call Python script to start service
    fetch('/api/start-service/' + appName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Service started successfully - set to green glow
                setButtonColor(buttonElement, getRandomColor());
                alert(`${appName} started successfully! Opening in new tab...`);

                // Open service in new tab after a short delay
                setTimeout(() => {
                    const port = buttonElement.getAttribute('data-port');
                    if (port) {
                        const protocol = buttonElement.getAttribute('data-protocol') || 'http';
                        const customIp = buttonElement.getAttribute('data-ip');
                        let targetUrl;
                        if (customIp) {
                            targetUrl = customIp + ':' + port;
                        } else {
                            targetUrl = window.location.hostname + ':' + port;
                        }
                        window.open(protocol + '://' + targetUrl, '_blank');
                    }
                }, 2000);
            } else {
                // Failed - reset to off
                buttonElement.classList.remove('on');
                buttonElement.classList.add('off');
                buttonElement.removeAttribute('style');
                alert(`Failed to start ${appName}: ${data.error || 'Unknown error'}`);
            }
        })
        .catch(error => {
            console.error('Error starting service:', appName, error);
            // Reset button on error
            buttonElement.classList.remove('on');
            buttonElement.classList.add('off');
            buttonElement.removeAttribute('style');
            alert(`Error communicating with backend for ${appName}.`);
        });
}

// API Keys Functions
function getEbayEndpoint() {
    return `https://TheOfficialBlackSheepCompany.com/marketplace/account-deletion`;
}

async function loadEbayConfig() {
    try {
        const response = await fetch(API_BASE_URL + 'ebay/config');
        if (response.ok) {
            const config = await response.json();

            const tokenElement = document.getElementById('verificationToken');
            tokenElement.textContent = config.verification_token || 'Not configured';
            if (!config.is_configured) {
                tokenElement.style.color = '#ff5555';
            } else {
                tokenElement.style.color = '#00ff00';
            }

            document.getElementById('endpointId').textContent = config.endpoint_id || 'Not configured';
            document.getElementById('apiPort').textContent = config.port || 1522;
        } else {
            document.getElementById('verificationToken').textContent = 'Error loading config';
            document.getElementById('verificationToken').style.color = '#ff5555';
        }
    } catch (err) {
        console.error('Error loading eBay config:', err);
        document.getElementById('verificationToken').textContent = 'Error loading config';
        document.getElementById('verificationToken').style.color = '#ff5555';
    }
}

async function checkEndpointStatus() {
    const statusElement = document.getElementById('endpointStatus');

    try {
        const response = await fetch(API_BASE_URL + 'ebay/endpoint-status');
        if (response.ok) {
            const data = await response.json();
            statusElement.textContent = data.status || 'Active';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = 'Unknown';
            statusElement.style.color = '#ff5555';
        }
    } catch (err) {
        statusElement.textContent = 'Checking...';
        statusElement.style.color = '#888';
    }
}

async function refreshNotifications() {
    const logElement = document.getElementById('notificationLog');

    try {
        const response = await fetch(API_BASE_URL + 'ebay/notifications');
        if (response.ok) {
            const data = await response.json();

            if (data.notifications && data.notifications.length > 0) {
                logElement.innerHTML = data.notifications.map(notif => {
                    const timestamp = new Date(notif.timestamp).toLocaleString();
                    let contentHtml = '';

                    if (notif.type === 'account_deletion') {
                        // Display account deletion notification with structured fields
                        const d = notif.data;
                        contentHtml = `
                            <div style="color: #ccc; margin-top: 5px;">
                                <div><strong style="color: #00ff00;">Notification ID:</strong> ${d.notification_id || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">Topic:</strong> ${d.topic || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">Event Date:</strong> ${d.event_date ? new Date(d.event_date).toLocaleString() : 'N/A'}</div>
                                <div><strong style="color: #00ff00;">Username:</strong> ${d.username || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">User ID:</strong> ${d.user_id || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">EIAS Token:</strong> ${d.eias_token || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">Publish Attempt:</strong> ${d.publish_attempt_count || 'N/A'}</div>
                                <div><strong style="color: #00ff00;">Status:</strong> ${d.status || 'N/A'}</div>
                            </div>
                        `;
                    } else if (notif.type === 'challenge_verification') {
                        // Display challenge verification
                        contentHtml = `
                            <div style="color: #ccc; margin-top: 5px;">
                                <div><strong style="color: #00aaff;">Challenge Code:</strong> ${notif.data.challenge_code || 'N/A'}</div>
                                <div><strong style="color: #00aaff;">Endpoint:</strong> ${notif.data.endpoint || 'N/A'}</div>
                                <div><strong style="color: #00aaff;">Status:</strong> ${notif.data.status || 'N/A'}</div>
                            </div>
                        `;
                    } else {
                        // Fallback to JSON display for unknown types
                        contentHtml = `<div style="color: #ccc; margin-top: 5px;"><pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(notif.data, null, 2)}</pre></div>`;
                    }

                    return `
                        <div style="padding: 10px; margin-bottom: 10px; background: #1a1a1a; border-left: 3px solid ${notif.type === 'account_deletion' ? '#ff5555' : '#00ff00'}; border-radius: 5px;">
                            <div>
                                <span style="color: #00aaff; font-weight: 600;">${timestamp}</span>
                                <span style="color: ${notif.type === 'account_deletion' ? '#ff5555' : '#00ff00'}; font-weight: 600; margin-left: 10px;">[${notif.type.toUpperCase().replace('_', ' ')}]</span>
                            </div>
                            ${contentHtml}
                        </div>
                    `;
                }).join('');
            } else {
                logElement.innerHTML = '<p style="color: #888;">No notifications yet. Waiting for eBay verification token or account deletion notifications...</p>';
            }
        } else {
            logElement.innerHTML = '<p style="color: #ff5555;">Failed to load notifications</p>';
        }
    } catch (err) {
        console.error('Error loading notifications:', err);
        logElement.innerHTML = '<p style="color: #ff5555;">Error loading notifications. Make sure the API server is running.</p>';
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy to clipboard');
    });
}

// --- Firebase Auth Functions ---

// Sign in with Google
function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // Google Sign-In successful. onAuthStateChanged will handle UI updates and redirects.
            console.log("Google Sign-In successful!", result.user);
        })
        .catch((error) => {
            console.error("Google Sign-In error:", error);
            alert(`Google Sign-In failed: ${error.message}`);
        });
}

// Sign out
function signOutUser() {
    signOut(auth).then(() => {
        // Sign-out successful. onAuthStateChanged will handle UI updates and redirects.
        console.log("User signed out.");
    }).catch((error) => {
        console.error("Sign-out error:", error);
        alert(`Sign-out failed: ${error.message}`);
    });
}

// Helper to get ISO week number (1-52 or 53)
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// Show Foundations of History sub-tabs with Weekly Report Sidebar
function showFoundationsOfHistoryTab(tabName) {
    // --- 1. Basic Tab Switching ---
    document.querySelectorAll('.blog-content').forEach(content => {
        content.style.display = 'none';
    });

    const selectedContentDiv = document.getElementById(tabName);
    if (selectedContentDiv) {
        selectedContentDiv.style.display = 'block';
    }

    // --- 2. UI Initialization (run once per tab) ---
    const isInitialized = selectedContentDiv.dataset.initialized === 'true';
    if (!isInitialized) {
        const reportContentId = `report-content-${tabName}`;
        const weekListId = `week-list-${tabName}`;
        selectedContentDiv.innerHTML = `
            <div class="history-container" style="display: flex; height: 100%;">
                <div class="history-sidebar" style="width: 250px; background: #1a1a1a; padding: 10px; overflow-y: auto; border-right: 1px solid #333;">
                    <h4 style="color: #FBBF24; margin-top: 0;">Weekly Reports</h4>
                    <ul id="${weekListId}" style="list-style: none; padding: 0; margin: 0;"></ul>
                </div>
                <div class="history-content" id="${reportContentId}" style="flex-grow: 1; padding: 20px; overflow-y: auto;">
                    <p>Loading report...</p>
                </div>
            </div>
        `;
        selectedContentDiv.dataset.initialized = 'true';
    }

    // --- 3. Report Generation Logic and Sidebar Population ---
    const reportFunctionMap = {
        'AfricanAmericanHistory': window.generateAahistReport,
        'Artifacts': window.generateArtifactsReport,
        'HistoricFigures': window.generateHistFiguresReport,
        'BiblicalHistory': window.generateBibhistReport
    };

    const topicListMap = {
        'AfricanAmericanHistory': window.aahistEvents,
        'Artifacts': window.artifactsList,
        'HistoricFigures': window.histFiguresList,
        'BiblicalHistory': window.bibhistTopics
    };
    
    // Day of week mapping for default report (0=Sunday, 1=Monday... 6=Saturday)
    const publishDayMap = {
        'AfricanAmericanHistory': 5, // Friday
        'Artifacts': 3,              // Wednesday
        'HistoricFigures': 1,        // Monday
        'BiblicalHistory': 2         // Tuesday
    };


    const generateReport = async (week) => { // Make generateReport async
        const reportFunction = reportFunctionMap[tabName];
        if (typeof reportFunction === 'function') {
            const reportContainerId = `report-content-${tabName}`;
            // Await the report function to get the returned data
            const reportData = await reportFunction(week, reportContainerId); 
            
            // Highlight active week/report in sidebar
            const weekList = document.getElementById(`week-list-${tabName}`);
            if (weekList) {
                weekList.querySelectorAll('a').forEach(a => a.style.fontWeight = 'normal');
                const activeLink = weekList.querySelector(`a[data-week="${week}"]`);
                if (activeLink) activeLink.style.fontWeight = 'bold';
            }

            // --- News Feed Integration (Phase 2) ---
            // Only create a news post if it's the current week AND the designated publish day
            const today = new Date();
            const currentDayOfWeek = today.getDay();
            const currentWeekNumber = getWeekNumber(today);
            const designatedPublishDay = publishDayMap[tabName];

            if (week === currentWeekNumber && currentDayOfWeek === designatedPublishDay && reportData) {
                createAndStoreNewsPost({
                    title: reportData.title,
                    snippet: reportData.snippet,
                    imageUrl: reportData.imageUrl,
                    topic: tabName,
                    week: week
                });
            }

        } else {
            console.error(`Report generation function for ${tabName} not found or not yet loaded.`);
        }
    };
    
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0=Sunday, 1=Monday...
    const currentWeekNumber = getWeekNumber(today);
    const designatedPublishDay = publishDayMap[tabName];
    const topicList = topicListMap[tabName];


    // Calculate the default week to show (most recently published)
    let defaultWeekToShow = currentWeekNumber;
    if (designatedPublishDay !== undefined) { // If a specific publish day is set
        if (currentDayOfWeek < designatedPublishDay) {
            // If today is before the publish day, show last week's report
            defaultWeekToShow = currentWeekNumber > 1 ? currentWeekNumber - 1 : currentWeekNumber; // Handle Week 1 edge case
        }
    }
    // If no specific publish day, or if today is on/after publish day, show current week's report

    // Populate the sidebar with titles and attach event listeners
    const weekList = document.getElementById(`week-list-${tabName}`);
    if (weekList && topicList) { // Ensure topicList is loaded
        weekList.innerHTML = ''; // Clear previous entries

        // Show all reports from Week 1 up to the current week
        for (let i = 1; i <= currentWeekNumber; i++) {
            const topicTitle = topicList[(i - 1) % topicList.length];
            const li = document.createElement('li');
            li.style.marginBottom = '5px';
            li.innerHTML = `<a href="#" data-week="${i}" style="color: #ccc; text-decoration: none; display: block; padding: 5px 8px; border-radius: 3px; background: #2a2a2a; transition: background 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onmouseover="this.style.background='#3a3a3a'" onmouseout="this.style.background='#2a2a2a'">${topicTitle} (Week ${i})</a>`;
            weekList.appendChild(li);

            // Attach event listener for the newly created link
            li.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                const week = parseInt(this.dataset.week, 10);
                generateReport(week);
            });
        }
    } else if (weekList) {
        weekList.innerHTML = '<li><p style="color:#aaa;">Loading topic list...</p></li>';
    }

    // --- 4. Load Default Report ---
    generateReport(defaultWeekToShow);

    // --- 5. Update Main Tab Button Text and Style (from original function) ---
    // Update sub-tab button styles
    document.querySelectorAll('.blog-subtab').forEach(btn => {
        btn.style.background = '#f3f4f6';
        btn.style.color = '#374151';
        btn.classList.remove('active');
    });

    // Find and highlight the active tab button
    const activeButton = Array.from(document.querySelectorAll('.blog-subtab')).find(
        btn => btn.textContent.trim() === tabName.replace(/([A-Z])/g, ' $1').trim()
    );
    if (activeButton) {
        activeButton.style.background = '#FBBF24';
        activeButton.style.color = '#000000';
        activeButton.classList.add('active');
    }
    
    const foundationsOfHistoryTabButton = document.querySelectorAll('.tab-dropdown .tab-button')[8];
    if (foundationsOfHistoryTabButton) {
        const tabNameDisplay = tabName.replace(/([A-Z])/g, ' $1').trim();
        foundationsOfHistoryTabButton.textContent = tabNameDisplay + ' ▼';
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-selection'));
        foundationsOfHistoryTabButton.classList.add('active-selection');
    }
}

// --- START CHATBOT SCRIPT ---
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatExpand = document.getElementById('chat-expand');
const chatTextIncrease = document.getElementById('chat-text-increase');
const chatTextDecrease = document.getElementById('chat-text-decrease');

// --- START OF CHATBOT KNOWLEDGE BASE ---
// To teach the chatbot new answers, add new entries to this list.
// Each entry needs:
// 1. 'keywords': A list of words that trigger the answer.
// 2. 'response': The answer the chatbot should give.
const knowledgeBase = [
    {
        keywords: ['hi', 'hello', 'hey'],
        response: "Hi! I’m your Service Hub Assistant. I can help with junk removal & moving, cleaning, server monitoring, phone repair, dog walking, mobile laundry, and your online store. What are you looking for today?"
    },
    {
        keywords: ['store', 'shop', 'order'],
        response: "About the online store:\n• Browse and order items 24/7.\n• I can answer basic questions about products, availability, and shipping.\nFor specific order help, you can tell me your order number (don’t share anything sensitive like full card numbers)."
    },
    {
        keywords: ['server', 'monitor', 'uptime', 'infrastructure'],
        response: "Server monitoring & infrastructure:\n• We offer 24/7 monitoring with alerts for downtime and performance issues.\n• We can monitor websites, APIs, servers, and key services.\n• Plans can include uptime checks, resource usage, and incident notifications.\nTell me a bit about how many servers or sites you have, and your preferred contact method for alerts."
    },
    {
        keywords: ['junk', 'haul', 'hauling', 'removal', 'moving', 'move'],
        response: (input) => {
            if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                return "Junk removal & moving pricing:\n• Pricing usually depends on load size, distance, and any special handling.\n• For a quick estimate, tell me: 1) what you need removed or moved, 2) approximate volume (e.g. a small room, full garage, 1‑bedroom apartment), and 3) pickup & drop‑off locations.";
            }
            if (input.includes('same day') || input.includes('today') || input.includes('urgent') || input.includes('emergency')) {
                return "Same‑day junk removal / moving:\n• Same-day options may be available depending on schedule.\n• Tell me your location, what you need done, and your ideal time window and we’ll confirm availability.";
            }
            return "Junk removal & moving services:\n• We handle household junk, furniture, appliances, and general hauling (within reasonable safety limits).\n• We can also help with local moves and loading/unloading.\nTell me what you need moved or removed and the address so we can estimate time and cost.";
        }
    },
    {
        keywords: ['clean', 'cleaning', 'housekeeping'],
        response: (input) => {
            if (input.includes('move out') || input.includes('move-out') || input.includes('moveout') || input.includes('deep')) {
                return "Move‑out / deep cleaning:\n• Focus on kitchens, bathrooms, floors, baseboards, and inside cabinets (as requested).\n• Ideal for end of lease / pre‑sale cleanups.\nShare the type of property (apartment/house, number of bedrooms/bathrooms) and your preferred date so we can give a better estimate.";
            }
            if (input.includes('commercial') || input.includes('office') || input.includes('business')) {
                return "Commercial cleaning:\n• Offices, retail spaces, and other commercial properties.\n• We can set up recurring schedules (daily/weekly) or one‑time projects.\nTell me the type of business, approximate square footage, and how often you’d like cleaning.";
            }
            return "Residential & commercial cleaning:\n• Options for standard, deep, move‑in/move‑out, and recurring cleanings.\n• We bring our own supplies unless you prefer specific products.\nTell me if the space is residential or commercial, how many rooms, and how often you’d like cleaning (one‑time, weekly, bi‑weekly, etc.).";
        }
    },
    {
        keywords: ['phone', 'screen', 'iphone', 'android', 'battery', 'repair'],
        response: (input) => {
            if (input.includes('screen') || input.includes('crack')) {
                return "Phone screen repair:\n• We handle most popular iPhone and Android models.\n• Turnaround time can be same‑day or next‑day for common parts.\nTell me your phone model and the issue (cracked glass only, no touch, display issues) and I can outline next steps.";
            }
            if (input.includes('battery')) {
                return "Phone battery replacement:\n• We replace worn batteries that don’t hold a charge.\n• Typical service time is around 1–2 hours, depending on the model.\nShare your phone model and any battery symptoms (shutting off, draining fast, swelling).";
            }
            if (input.includes('water') || input.includes('liquid')) {
                return "Water‑damage phone repair:\n• Power off the device and avoid charging it.\n• We can inspect and attempt recovery / repair depending on condition.\nTell me when the damage happened and the phone model, and we’ll recommend next steps.";
            }
            return "Cell phone repair services:\n• Screen, battery, charging port, buttons, and other common issues.\n• Many repairs can be done the same day, depending on parts.\nTell me your phone model and the problem you’re seeing so we can guide you.";
        }
    },
    {
        keywords: ['dog', 'dogs', 'walk', 'pet'],
        response: (input) => {
            if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                return "Dog walking pricing:\n• Usually based on walk length (e.g. 20, 30, 60 minutes) and frequency (occasional vs weekly).\n• Multi‑dog households may have a small additional fee.\nTell me how many dogs you have, how often you need walks, and your general location so we can estimate.";
            }
            if (input.includes('schedule') || input.includes('weekly') || input.includes('daily')) {
                return "Dog walking schedules:\n• Options for daily, a few times per week, or occasional walks.\n• We can discuss preferred time windows (morning, mid‑day, evening).\nShare your preferred days/times and any special notes about your dog (age, energy level, anything we should watch for).";
            }
            return "Dog walking services:\n• Regular or occasional walks with updates after each visit.\n• We pay attention to your dog’s routine, energy level, and any special instructions.\nTell me your dog’s age, breed (optional), and how often you’d like walks.";
        }
    },
    {
        keywords: ['laundry', 'laundromat', 'wash', 'fold'],
        response: (input) => {
            if (input.includes('how') && (input.includes('work') || input.includes('works'))) {
                return "Mobile laundry service – how it works:\n1) We pick up your laundry at a scheduled time.\n2) We wash, dry, and fold it for you.\n3) We deliver it back, usually within 24–48 hours depending on volume.\nTell me your approximate number of loads per week and your area so we can plan pickup times.";
            }
            if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('rate')) {
                return "Mobile laundry pricing:\n• Often charged per pound or per standard laundry bag.\n• Pickup and delivery may be included above a minimum amount.\nShare roughly how many loads or pounds of laundry you have and how often you’ll use the service.";
            }
            return "Mobile laundry services:\n• Pickup, wash/dry/fold, and delivery included.\n• Great for busy households or small businesses.\nTell me your location and how much laundry you typically have each week.";
        }
    },
    {
        keywords: ['hour', 'time', 'open', 'close'],
        response: "Hours & availability:\n• Core hours are typically standard business hours, with some services offering evenings or weekends.\n• Junk removal, moving, and cleaning can sometimes be scheduled outside normal hours.\nTell me which service you’re asking about and your preferred date/time so we can check availability."
    },
    {
        keywords: ['where', 'located', 'location', 'area', 'serve'],
        response: "Service area:\n• We serve local clients for in‑person services (junk removal, moving, cleaning, dog walking, laundry, phone repair).\n• Server monitoring and some online services can support clients in many locations.\nTell me your city/area and the service you need so we can confirm coverage."
    },
    {
        keywords: ['whats crackin', "what's good", 'whats good', 'wassup', 'wats good', 'wats up'],
        response: ['whats Brackin homie', 'wats poppin', 'what it do nephew', 'where dem thangs at?', 'U strait?']
    },
    {
        keywords: ["who's the owne'r?", 'who ownes this company?', 'who runs the show?', 'whos the hnic?'],
        response: "Swoop mf Geezy, view our contacts tab for more info!!"
    },
    {
        keywords: ['whats your name?'],
        response: "My name is Black the sheep, one of the blackest sheep in the flock"
    },
    {
        keywords: ['book', 'schedule', 'appointment', 'quote', 'estimate'],
        response: "Booking & quotes:\nI can capture your request so our team can follow up. Please share:\n1) Your name\n2) Service you need (junk removal, cleaning, server monitoring, phone repair, dog walking, laundry, online store help)\n3) Your general location\n4) Ideal date/time window\n(Please avoid sending highly sensitive data here.)"
    }
];
const fallbackResponse = "I’m here to help with:\n• Junk removal, moving & hauling\n• Residential & commercial cleaning\n• Server monitoring & infrastructure\n• Cell phone repair\n• Dog walking\n• Mobile laundry services\n• Online store questions\n\nTry asking something like “How much is weekly dog walking?” or “Do you offer move‑out cleaning?”.";
// --- END OF CHATBOT KNOWLEDGE BASE ---

// --- Text Size Logic ---
const textSizes = ['text-xs', 'text-sm', 'text-base'];
let currentTextSizeIndex = 0; // 'text-xs' is the default

function updateTextSize() {
    if (!chatLog) return;
    textSizes.forEach(sizeClass => chatLog.classList.remove(sizeClass));
    chatLog.classList.add(textSizes[currentTextSizeIndex]);
}

if (chatTextIncrease) {
    chatTextIncrease.addEventListener('click', () => {
        if (currentTextSizeIndex < textSizes.length - 1) {
            currentTextSizeIndex++;
            updateTextSize();
        }
    });
}

if (chatTextDecrease) {
    chatTextDecrease.addEventListener('click', () => {
        if (currentTextSizeIndex > 0) {
            currentTextSizeIndex--;
            updateTextSize();
        }
    });
}
// --- End Text Size Logic ---

function addMessage(content, sender = 'user') {
    const container = document.createElement('div');
    container.className = 'flex ' + (sender === 'user' ? 'justify-end' : 'justify-start');

    const bubble = document.createElement('div');
    bubble.className = [
        'max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-line',
        sender === 'user'
            ? 'bg-yellow-500 text-zinc-950 rounded-br-sm shadow-sm shadow-yellow-500/30'
            : 'bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-bl-sm'
    ].join(' ');
    bubble.textContent = content;

    container.appendChild(bubble);
    chatLog.appendChild(container);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function botReply(text) {
    addMessage(text, 'bot');
}

function buildBotResponse(rawInput) {
    const input = rawInput.toLowerCase();
    for (const pair of knowledgeBase) {
        if (pair.keywords.some(keyword => input.includes(keyword))) {
            const response = pair.response;
            if (typeof response === 'function') {
                return response(input);
            }
            return response;
        }
    }
    return fallbackResponse;
}

function handleUserInput() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
        const reply = buildBotResponse(text);
        botReply(reply);
    }, 300);
}

if (chatSend && chatInput) {
    chatSend.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });
}

// UI Interaction listeners
if (chatToggle) {
    // Open Chatwoot AI widget instead of old chatbot
    chatToggle.addEventListener('click', () => {
        console.log('Chat button clicked');

        // Wait for Chatwoot to load if not ready yet
        const openChatwoot = () => {
            if (window.$chatwoot) {
                console.log('Opening Chatwoot widget');
                window.$chatwoot.toggle();
            } else {
                console.log('Chatwoot not ready, waiting...');
                setTimeout(openChatwoot, 100);
            }
        };

        openChatwoot();
    });
}
if (chatClose) {
    chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));
}
if (chatExpand) {
    chatExpand.addEventListener('click', () => chatWindow.classList.toggle('fullscreen'));
}

// Quick suggestion buttons
document.querySelectorAll('[data-template]').forEach((btn) => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-template');
        let prompt = '';
        switch (type) {
            case 'junk': prompt = 'How much does junk removal usually cost?'; break;
            case 'cleaning': prompt = 'What is included in a move-out cleaning?'; break;
            case 'servers': prompt = 'Do you offer 24/7 server monitoring?'; break;
            case 'phones': prompt = 'Do you repair cracked iPhone screens?'; break;
            case 'dogs': prompt = 'How much is weekly dog walking?'; break;
            case 'laundry': prompt = 'How does your mobile laundry service work?'; break;
        }
        if (prompt) {
            addMessage(prompt, 'user');
            setTimeout(() => {
                const reply = buildBotResponse(prompt);
                botReply(reply);
            }, 250);
        }
    });
});

// Initial welcome messages & text size
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('chat-log')) {
            updateTextSize(); // Set initial text size
            const welcome = "Hi! I’m your Black Sheep Tour Guide, make yourself at home. first create an account and login!! Ask me anything about Junk Removal, Moving, hauling, Residential or Commertial cleaning, server monitoring,cloud space, Cell phone or Tablet repair, Pet servicess, mobile laundry, or any of our online stores or products.";
            botReply(welcome);
            botReply("Tip: Click one of the quick buttons under the chat box to see example questions.");
        }
    }, 500);
});
// --- END CHATBOT SCRIPT ---
