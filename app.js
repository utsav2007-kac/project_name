// Base64 helper to decode fallback variables locally while keeping them hidden from direct view in app.js
function d(str) {
    try {
        return atob(str);
    } catch(e) {
        return "";
    }
}

// Environment Variables Config (Decoded defaults fallback; overridden by .env if loaded)
let env = {
    FIREBASE_API_KEY: d("QUl6YVN5Q1Q2bGlvWGdVTnJPYW5oanV5eFQyM25fd0J1am1kcnp3"),
    FIREBASE_AUTH_DOMAIN: d("YW1ydXRqZWV2YW4tYXl1cnZlZGEuZmlyZWJhc2VhcHAuY29t"),
    FIREBASE_PROJECT_ID: d("YW1ydXRqZWV2YW4tYXl1cnZlZGE="),
    FIREBASE_STORAGE_BUCKET: d("YW1ydXRqZWV2YW4tYXl1cnZlZGEuZmlyZWJhc2VzdG9yYWdlLmFwcA=="),
    FIREBASE_MESSAGING_SENDER_ID: d("MjA4Nzk0NTg2MjY2"),
    FIREBASE_APP_ID: d("MToyMDg3OTQ1ODYyNjY6d2ViOjYyNDBiMGVhODhmOGM5ZTUyMmEzMjM="),
    FIREBASE_MEASUREMENT_ID: d("Ry1KUjBKTERXTEVG"),
    GOOGLE_SHEET_WEBAPP_URL: d("aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6M1RTWnlYbTJyRXg4aUswVjVWMENRSXIxOG5BbUdKNmcwTHp4LXZKMDUtSERsS1NjanA2U2JDU3hscWxwZUlhd3cvZXhlYw==")
};

// Check if Firebase is properly configured
const isFirebaseConfigured = true;

// Load environment variables dynamically from .env file
async function loadEnvironment() {
    try {
        const response = await fetch('.env');
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const index = trimmed.indexOf('=');
                if (index !== -1) {
                    const key = trimmed.substring(0, index).trim();
                    const val = trimmed.substring(index + 1).trim();
                    if (key) {
                        env[key] = val;
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Could not fetch .env file, falling back to default values.");
    }
}

// Initialize App Config and Firebase Config
async function initializeApp() {
    await loadEnvironment();
    
    const FIREBASE_CONFIG = {
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        projectId: env.FIREBASE_PROJECT_ID,
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
        appId: env.FIREBASE_APP_ID,
        measurementId: env.FIREBASE_MEASUREMENT_ID
    };

    if (isFirebaseConfigured && typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
            console.log("Firebase initialized successfully.");
        } catch (error) {
            console.error("Firebase initialization failed:", error);
        }
    } else {
        console.warn("Firebase is not configured. Running OTP flow in Simulation/Demo mode.");
    }
}

// Start loading configuration
initializeApp();

// Function to show custom theme-styled toast notification at the top of the page
function showToast(title, message, isSuccess = true) {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIconContainer = toast ? toast.querySelector('.rounded-full') : null;
    const toastIcon = toastIconContainer ? toastIconContainer.querySelector('.material-symbols-outlined') : null;
    
    if (!toast || !toastTitle || !toastMessage) return;
    
    toastTitle.innerText = title;
    toastMessage.innerText = message;
    
    if (isSuccess) {
        if (toastIconContainer) {
            toastIconContainer.className = 'w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0';
        }
        if (toastIcon) toastIcon.innerText = 'check_circle';
    } else {
        if (toastIconContainer) {
            toastIconContainer.className = 'w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0';
        }
        if (toastIcon) toastIcon.innerText = 'error';
    }
    
    if (toast.dataset.timeoutId) {
        clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('-translate-y-10', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);
    
    const timeoutId = setTimeout(() => {
        hideToast();
    }, 5000);
    toast.dataset.timeoutId = timeoutId;
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-10', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 300);
}

// Bind Close Toast Button Listener
document.addEventListener('DOMContentLoaded', () => {
    const closeToastBtn = document.getElementById('closeToastBtn');
    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', hideToast);
    }
});

// Function to transmit data to Google Sheets Web App
async function sendDataToGoogleSheet(data) {
    if (!env.GOOGLE_SHEET_WEBAPP_URL || env.GOOGLE_SHEET_WEBAPP_URL.includes("YOUR_GOOGLE_SCRIPT_URL")) {
        console.log("Google Sheet URL is not configured. Form data:", data);
        return;
    }

    // Add timestamp to data payload
    data.timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    try {
        await fetch(env.GOOGLE_SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors", // Crucial for Google Apps Script Web App requests
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        console.log("Data transmitted to Google Sheets successfully.");
    } catch (error) {
        console.error("Error transmitting data to Google Sheets:", error);
    }
}

// Tailwind configuration for CDN integration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "tertiary-fixed": "#d3e8d5",
                "surface-container": "#efeeea",
                "primary-container": "#af5e3f",
                "surface-dim": "#dbdad6",
                "inverse-surface": "#2f312e",
                "secondary-container": "#d6e7a1",
                "secondary-fixed": "#d9eaa3",
                "surface-bright": "#faf9f5",
                "tertiary": "#4d6151",
                "surface-container-low": "#f4f4f0",
                "tertiary-fixed-dim": "#b7ccb9",
                "error": "#ba1a1a",
                "primary-fixed-dim": "#ffb59b",
                "on-primary-fixed-variant": "#763217",
                "on-tertiary-fixed": "#0e1f13",
                "surface-tint": "#94492c",
                "surface-variant": "#e3e2df",
                "secondary": "#56642b",
                "on-primary-container": "#fffbff",
                "on-error-container": "#93000a",
                "on-secondary-fixed": "#161f00",
                "on-surface": "#1b1c1a",
                "surface": "#faf9f5",
                "on-primary": "#ffffff",
                "primary": "#91472a",
                "on-secondary-container": "#5a682f",
                "error-container": "#ffdad6",
                "secondary-fixed-dim": "#bdce89",
                "surface-container-lowest": "#ffffff",
                "primary-fixed": "#ffdbcf",
                "on-primary-fixed": "#380d00",
                "tertiary-container": "#667969",
                "on-tertiary-container": "#f6fff4",
                "on-secondary-fixed-variant": "#3e4c16",
                "on-error": "#ffffff",
                "surface-container-highest": "#e3e2df",
                "surface-container-high": "#e9e8e4",
                "outline": "#87736c",
                "on-tertiary": "#ffffff",
                "on-tertiary-fixed-variant": "#394b3d",
                "on-secondary": "#ffffff",
                "inverse-on-surface": "#f2f1ed",
                "background": "#faf9f5",
                "outline-variant": "#dac1b9",
                "on-surface-variant": "#54433d",
                "inverse-primary": "#ffb59b",
                "on-background": "#1b1c1a"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "base": "8px",
                "margin-desktop": "64px",
                "stack-md": "24px",
                "stack-lg": "48px",
                "margin-mobile": "20px",
                "gutter": "24px",
                "container-max": "1200px",
                "stack-sm": "12px"
            },
            "fontFamily": {
                "headline-md": ["Playfair Display"],
                "headline-xl": ["Playfair Display"],
                "headline-xl-mobile": ["Playfair Display"],
                "label-md": ["Manrope"],
                "body-md": ["Manrope"],
                "label-sm": ["Manrope"],
                "headline-lg": ["Playfair Display"],
                "body-lg": ["Manrope"]
            },
            "fontSize": {
                "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "headline-xl-mobile": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
                "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }]
            }
        },
    },
};

document.addEventListener('DOMContentLoaded', () => {
    // ─── CAPTCHA State & Logic ──────────────────────────────────────────────────
    let currentCaptchaVal = "";

    function generateCaptcha() {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function refreshCaptcha() {
        const captchaCodeBox = document.getElementById('captchaCodeBox');
        if (captchaCodeBox) {
            currentCaptchaVal = generateCaptcha();
            captchaCodeBox.innerText = currentCaptchaVal;
        }
        const orderCaptchaInput = document.getElementById('orderCaptchaInput');
        if (orderCaptchaInput) {
            orderCaptchaInput.value = "";
        }
    }

    // Initialize captcha
    refreshCaptcha();

    // Bind refresh button click
    const btnRefreshCaptcha = document.getElementById('btnRefreshCaptcha');
    if (btnRefreshCaptcha) {
        btnRefreshCaptcha.addEventListener('click', refreshCaptcha);
    }

    // ─── Order Form Submit Handler ────────────────────────────────────────────────
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput    = document.getElementById('orderName');
            const phoneInput   = document.getElementById('orderPhone');
            const addressInput = document.getElementById('orderAddress');

            const name    = nameInput    ? nameInput.value.trim()    : '';
            const phone   = phoneInput   ? phoneInput.value.trim()   : '';
            const address = addressInput ? addressInput.value.trim() : '';

            const honeyTrap = document.getElementById('order_honey_trap');
            if (honeyTrap && honeyTrap.value !== '') {
                console.warn('Spam bot detected and blocked.');
                return;
            }

            if (!name || !phone || !address) {
                showToast('चेतावनी', 'कृपया अपना नाम, मोबाइल नंबर और पता भरें।', false);
                return;
            }

            // Validate phone number format (exactly 10 digits)
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.length !== 10) {
                showToast('चेतावनी', 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे: 9876543210)।', false);
                return;
            }

            // Validate CAPTCHA
            const orderCaptchaInput = document.getElementById('orderCaptchaInput');
            const userCaptcha = orderCaptchaInput ? orderCaptchaInput.value.trim() : '';
            if (userCaptcha !== currentCaptchaVal) {
                showToast('चेतावनी', 'कृपया सही सुरक्षा कोड (कैप्चा) दर्ज करें।', false);
                if (orderCaptchaInput) orderCaptchaInput.value = '';
                refreshCaptcha();
                return;
            }

            // Disable button while processing
            const submitBtn = document.getElementById('orderSubmitBtn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-xl animate-spin">progress_activity</span> ऑर्डर भेजा जा रहा है...';
            }

            // Direct submission to Google Sheets Web App
            sendDataToGoogleSheet({
                formType: "Order",
                name: name,
                phone: cleanPhone,
                address: address,
                city: "",
                rating: "",
                message: ""
            }).then(() => {
                showToast('सफलता', `धन्यवाद, ${name}! आपका ऑर्डर दर्ज कर लिया गया है। हम आपसे शीघ्र ही संपर्क करेंगे।`, true);
                if (orderForm) orderForm.reset();
                refreshCaptcha();
            }).catch((error) => {
                console.error("Order submit failed:", error);
                showToast('त्रुटि', 'कुछ समस्या आई, कृपया पुनः प्रयास करें।', false);
            }).finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        });
    }

    const btnCallNow = document.getElementById('btnCallNow');
    if (btnCallNow) {
        btnCallNow.addEventListener('click', () => {
            window.location.href = "tel:+919714360416";
        });
    }

    // Toggle support / chat FAB bubble
    const fabButton = document.querySelector('button.bg-secondary');
    const welcomeBubble = document.querySelector('.group .bg-surface');

    if (fabButton && welcomeBubble) {
        fabButton.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeBubble.classList.toggle('opacity-0');
            welcomeBubble.classList.toggle('opacity-100');
            welcomeBubble.classList.toggle('translate-y-4');
            welcomeBubble.classList.toggle('translate-y-0');
        });

        // Hide bubble if clicking outside
        document.addEventListener('click', () => {
            welcomeBubble.classList.add('opacity-0');
            welcomeBubble.classList.remove('opacity-100');
            welcomeBubble.classList.add('translate-y-4');
            welcomeBubble.classList.remove('translate-y-0');
        });

        welcomeBubble.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Star Rating selection interactive logic
    const ratingContainer = document.getElementById('starRating');
    const ratingValueInput = document.getElementById('ratingValue');
    if (ratingContainer && ratingValueInput) {
        const starBtns = ratingContainer.querySelectorAll('.star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = parseInt(btn.getAttribute('data-value'));
                ratingValueInput.value = val;

                // Highlight up to selected star, dim rest
                starBtns.forEach((sBtn, idx) => {
                    if (idx < val) {
                        sBtn.classList.remove('text-surface-dim');
                        sBtn.classList.add('text-primary');
                    } else {
                        sBtn.classList.remove('text-primary');
                        sBtn.classList.add('text-surface-dim');
                    }
                });
            });
        });
    }

    // Feedback Form Submit Handler
    const feedbackForm = document.getElementById('feedbackForm');
    const reviewsContainer = document.getElementById('reviews-container');
    if (feedbackForm && reviewsContainer) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('feedName').value.trim();
            const city = document.getElementById('feedCity').value.trim();
            const rating = parseInt(ratingValueInput.value);
            const msg = document.getElementById('feedMsg').value.trim();

            const honeyTrap = document.getElementById('feedback_honey_trap');
            if (honeyTrap && honeyTrap.value !== '') {
                console.warn('Spam bot detected and blocked.');
                return;
            }

            if (!name || !city || !msg) {
                showToast('चेतावनी', 'कृपया सभी फ़ील्ड भरें।', false);
                return;
            }

            // Prevent double submission by disabling button
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'प्रक्रिया जारी है...';
            }

            // Transmit feedback details to Google Sheet
            sendDataToGoogleSheet({
                formType: "Feedback",
                name: name,
                phone: "",
                address: "",
                city: city,
                rating: rating,
                message: msg
            }).then(() => {
                showToast('सफलता', 'आपकी प्रतिक्रिया सबमिट करने के लिए धन्यवाद!', true);
                feedbackForm.reset();

                // Reset stars color back to default 5 star rating
                const starBtns = ratingContainer.querySelectorAll('.star-btn');
                starBtns.forEach(sBtn => {
                    sBtn.classList.remove('text-surface-dim');
                    sBtn.classList.add('text-primary');
                });
                ratingValueInput.value = 5;

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }).catch((err) => {
                console.error("Feedback submit failed:", err);
                showToast('त्रुटि', 'कुछ समस्या आई, कृपया पुनः प्रयास करें।', false);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        });
    }

    // Mobile navigation drawer toggle logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');

    if (mobileMenuBtn && mobileMenuCloseBtn && mobileMenuOverlay && mobileMenuDrawer) {
        const openMenu = () => {
            mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenuDrawer.classList.remove('translate-x-full');
        };

        const closeMenu = () => {
            mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuDrawer.classList.add('translate-x-full');
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        mobileMenuCloseBtn.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) closeMenu();
        });

        // Close drawer when a nav link is clicked
        const mobileLinks = mobileMenuDrawer.querySelectorAll('nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});
