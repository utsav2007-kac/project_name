// Environment Variables Config (Empty by default; loaded dynamically from .env at runtime)
let env = {
    FIREBASE_API_KEY: "",
    FIREBASE_AUTH_DOMAIN: "",
    FIREBASE_PROJECT_ID: "",
    FIREBASE_STORAGE_BUCKET: "",
    FIREBASE_MESSAGING_SENDER_ID: "",
    FIREBASE_APP_ID: "",
    FIREBASE_MEASUREMENT_ID: "",
    GOOGLE_SHEET_WEBAPP_URL: ""
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
    // ─── OTP State ───────────────────────────────────────────────────────────────
    let currentOtp = null;          // The 6-digit OTP string we generated (Demo Mode)
    let confirmationResult = null;  // Firebase SMS confirmation object (Production Mode)
    let otpTimerInterval = null;    // Countdown interval reference
    let pendingOrderData = null;    // Holds form data while OTP is pending

    // ─── OTP Modal Elements ───────────────────────────────────────────────────────
    const otpModalOverlay = document.getElementById('otpModalOverlay');
    const otpModalCard    = document.getElementById('otpModalCard');
    const otpInputGroup   = document.getElementById('otpInputGroup');
    const otpBoxes        = otpInputGroup ? Array.from(otpInputGroup.querySelectorAll('.otp-box')) : [];
    const otpError        = document.getElementById('otpError');
    const otpSentMsg      = document.getElementById('otpSentMsg');
    const otpTimerEl      = document.getElementById('otpTimer');
    const otpTimerText    = document.getElementById('otpTimerText');
    const resendOtpBtn    = document.getElementById('resendOtpBtn');
    const cancelOtpBtn    = document.getElementById('cancelOtpBtn');
    const verifyOtpBtn    = document.getElementById('verifyOtpBtn');

    /** Open OTP modal with animation */
    function openOtpModal() {
        otpModalOverlay.classList.remove('opacity-0', 'pointer-events-none');
        otpModalCard.classList.remove('scale-95');
        otpModalCard.classList.add('scale-100');
        // Focus first box after transition
        setTimeout(() => otpBoxes[0] && otpBoxes[0].focus(), 300);
    }

    /** Close OTP modal and reset state */
    function closeOtpModal() {
        otpModalOverlay.classList.add('opacity-0', 'pointer-events-none');
        otpModalCard.classList.remove('scale-100');
        otpModalCard.classList.add('scale-95');
        clearInterval(otpTimerInterval);
        resetOtpBoxes();
        if (otpError)  otpError.classList.add('hidden');
    }

    /** Reset OTP input boxes to empty */
    function resetOtpBoxes() {
        otpBoxes.forEach(box => { box.value = ''; box.classList.remove('border-error', 'border-secondary'); });
    }

    /** Generate a random 6-digit OTP string */
    function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /** Start 30-second countdown; shows Resend button when expired */
    function startOtpTimer(seconds = 30) {
        clearInterval(otpTimerInterval);
        let remaining = seconds;
        if (otpTimerEl)   otpTimerEl.textContent = remaining;
        if (otpTimerText) otpTimerText.classList.remove('hidden');
        if (resendOtpBtn) resendOtpBtn.classList.add('hidden');

        otpTimerInterval = setInterval(() => {
            remaining -= 1;
            if (otpTimerEl) otpTimerEl.textContent = remaining;
            if (remaining <= 0) {
                clearInterval(otpTimerInterval);
                if (otpTimerText) otpTimerText.classList.add('hidden');
                if (resendOtpBtn) resendOtpBtn.classList.remove('hidden');
            }
        }, 1000);
    }

    /**
     * Send OTP via SMS gateway.
     * Currently uses a demo simulation — replace the fetch() call inside
     * with your real SMS API (e.g. MSG91, Fast2SMS, Twilio) when ready.
     */
    async function sendOtpToPhone(phone, otp) {
        // ── DEMO MODE ──────────────────────────────────────────────────────────────
        // In production, remove the lines below and call your SMS API instead.
        console.log(`[OTP DEMO] Sending OTP ${otp} to +91${phone}`);
        alert(`[डेमो] आपका OTP है: ${otp}\n\n(उत्पादन में यह SMS द्वारा भेजा जाएगा)`);
        return true;
    }

    // ─── OTP Box — auto-advance & backspace navigation ────────────────────────────
    otpBoxes.forEach((box, idx) => {
        box.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            box.value = val.slice(-1);    // Keep only last digit typed
            if (val && idx < otpBoxes.length - 1) otpBoxes[idx + 1].focus();
            // Auto-verify when last digit is filled
            if (idx === otpBoxes.length - 1 && box.value) verifyOtp();
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && idx > 0) otpBoxes[idx - 1].focus();
        });
        // Handle paste: distribute digits across boxes
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            if (pasted.length >= otpBoxes.length) {
                otpBoxes.forEach((b, i) => { b.value = pasted[i] || ''; });
                otpBoxes[otpBoxes.length - 1].focus();
                verifyOtp();
            }
        });
    });

    /** Read entered OTP digits and return as a string */
    function getEnteredOtp() {
        return otpBoxes.map(b => b.value).join('');
    }

    /** Verify the entered OTP (Firebase vs. Demo fallback) */
    function verifyOtp() {
        const entered = getEnteredOtp();
        if (entered.length < 6) return; // Not fully filled yet

        if (verifyOtpBtn) {
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.textContent = 'सत्यापित किया जा रहा है...';
        }

        if (isFirebaseConfigured && confirmationResult) {
            confirmationResult.confirm(entered)
                .then((result) => {
                    // ✅ Correct OTP
                    otpBoxes.forEach(b => { b.classList.remove('border-error'); b.classList.add('border-secondary'); });
                    if (otpError) otpError.classList.add('hidden');
                    if (verifyOtpBtn) { verifyOtpBtn.disabled = true; verifyOtpBtn.textContent = 'सत्यापित ✓'; }
                    clearInterval(otpTimerInterval);

                    // Short delay for visual feedback, then complete the order
                    setTimeout(() => {
                        closeOtpModal();
                        completeOrder();
                    }, 600);
                })
                .catch((error) => {
                    console.error("Firebase OTP verification failed:", error);
                    // ❌ Wrong OTP
                    otpBoxes.forEach(b => b.classList.add('border-error'));
                    if (otpError) otpError.classList.remove('hidden');
                    if (verifyOtpBtn) { verifyOtpBtn.disabled = false; verifyOtpBtn.textContent = 'सत्यापित करें'; }
                    resetOtpBoxes();
                    otpBoxes[0].focus();
                });
        } else {
            // ─── DEMO MODE FALLBACK ───────────────────────────────────────────────
            if (entered === currentOtp) {
                // ✅ Correct OTP — mark boxes green, then complete the order
                otpBoxes.forEach(b => { b.classList.remove('border-error'); b.classList.add('border-secondary'); });
                if (otpError) otpError.classList.add('hidden');
                if (verifyOtpBtn) { verifyOtpBtn.disabled = true; verifyOtpBtn.textContent = 'सत्यापित ✓'; }
                clearInterval(otpTimerInterval);

                // Short delay for visual feedback, then complete the order
                setTimeout(() => {
                    closeOtpModal();
                    completeOrder();
                }, 600);
            } else {
                // ❌ Wrong OTP — shake boxes and show error
                otpBoxes.forEach(b => b.classList.add('border-error'));
                if (otpError) otpError.classList.remove('hidden');
                if (verifyOtpBtn) { verifyOtpBtn.disabled = false; verifyOtpBtn.textContent = 'सत्यापित करें'; }
                resetOtpBoxes();
                otpBoxes[0].focus();
            }
        }
    }

    /** After OTP verified, submit data to Google Sheet and open dialer */
    function completeOrder() {
        if (!pendingOrderData) return;
        const { name, cleanPhone, address, submitBtn, originalBtnText } = pendingOrderData;

        sendDataToGoogleSheet({
            formType: "Order",
            name,
            phone: cleanPhone,
            address,
            city: "",
            rating: "",
            message: ""
        }).then(() => {
            window.location.href = "tel:+916352975326";
            alert(`धन्यवाद, ${name}! आपका ऑर्डर दर्ज कर लिया गया है। हम आपसे शीघ्र ही संपर्क करेंगे।`);
            document.getElementById('orderForm').reset();
        }).catch(() => {
            alert("कुछ समस्या आई, कृपया पुनः प्रयास करें।");
        }).finally(() => {
            pendingOrderData = null;
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
        });
    }

    // ─── Verify button click ──────────────────────────────────────────────────────
    if (verifyOtpBtn) verifyOtpBtn.addEventListener('click', verifyOtp);

    // ─── Cancel / close modal ─────────────────────────────────────────────────────
    if (cancelOtpBtn) cancelOtpBtn.addEventListener('click', () => {
        closeOtpModal();
        pendingOrderData = null;
        // Re-enable submit button
        const submitBtn = document.getElementById('orderSubmitBtn');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = `<span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">call</span> कॉल करें`; }
    });

    // ─── Resend OTP ───────────────────────────────────────────────────────────────
    if (resendOtpBtn) resendOtpBtn.addEventListener('click', async () => {
        if (!pendingOrderData) return;
        resetOtpBoxes();
        if (otpError) otpError.classList.add('hidden');
        if (verifyOtpBtn) { verifyOtpBtn.disabled = false; verifyOtpBtn.textContent = 'सत्यापित करें'; }

        if (isFirebaseConfigured) {
            const phoneNumber = `+91${pendingOrderData.cleanPhone}`;
            firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
                .then((result) => {
                    confirmationResult = result;
                    startOtpTimer();
                    otpBoxes[0].focus();
                })
                .catch((error) => {
                    console.error("Error resending Firebase OTP:", error);
                    alert("OTP पुनः भेजने में असमर्थ। कृपया बाद में प्रयास करें।");
                });
        } else {
            currentOtp = generateOtp();
            await sendOtpToPhone(pendingOrderData.cleanPhone, currentOtp);
            startOtpTimer();
            otpBoxes[0].focus();
        }
    });

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
                alert('कृपया अपना नाम, मोबाइल नंबर और पता भरें।');
                return;
            }

            // Validate phone number format (exactly 10 digits)
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.length !== 10) {
                alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे: 9876543210)।');
                return;
            }

            // Disable button while processing
            const submitBtn = document.getElementById('orderSubmitBtn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-xl animate-spin">progress_activity</span> OTP भेजा जा रहा है...';
            }

            // Store pending data
            pendingOrderData = { name, cleanPhone, address, submitBtn, originalBtnText };

            if (isFirebaseConfigured) {
                const phoneNumber = `+91${cleanPhone}`;
                
                if (!window.recaptchaVerifier) {
                    try {
                        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                            'size': 'invisible'
                        });
                    } catch (error) {
                        console.error("Error initializing RecaptchaVerifier:", error);
                        alert("reCAPTCHA सत्यापन प्रारंभ करने में विफल। कृपया पृष्ठ को रीफ़्रेश करें।");
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
                        return;
                    }
                }

                firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
                    .then((result) => {
                        confirmationResult = result;
                        if (otpSentMsg) otpSentMsg.textContent = `+91 ${cleanPhone} पर OTP भेजा गया है।`;
                        openOtpModal();
                        startOtpTimer();
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
                    })
                    .catch((error) => {
                        console.error("Error signing in with phone number:", error);
                        alert("OTP भेजने में असमर्थ। कृपया सुनिश्चित करें कि नंबर सही है और Firebase कॉन्फ़िगरेशन सही है।");
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
                        pendingOrderData = null;
                    });
            } else {
                // Fallback / Demo Mode
                currentOtp = generateOtp();
                if (otpSentMsg) otpSentMsg.textContent = `+91 ${cleanPhone} पर OTP भेजा गया है (डेमो मोड)।`;

                const sent = await sendOtpToPhone(cleanPhone, currentOtp);
                if (!sent) {
                    alert('OTP भेजने में समस्या आई। कृपया पुनः प्रयास करें।');
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
                    pendingOrderData = null;
                    return;
                }

                // Open modal & start timer
                openOtpModal();
                startOtpTimer();

                // Re-enable the page submit button
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
            }
        });
    }

    const btnCallNow = document.getElementById('btnCallNow');
    if (btnCallNow) {
        btnCallNow.addEventListener('click', () => {
            window.location.href = "tel:+916352975326";
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
                alert('कृपया सभी फ़ील्ड भरें।');
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
                alert('आपकी प्रतिक्रिया सबमिट करने के लिए धन्यवाद!');
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
                alert("कुछ समस्या आई, कृपया पुनः प्रयास करें।");
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
