/**
 * booking-confirm.js - Enhanced Booking Confirmation System
 * 
 * Features:
 * 1. Real-time booking expiration countdown
 * 2. Dynamic booking summary from URL params
 * 3. Form validation with instant feedback
 * 4. Terms modal with scrollable content
 * 5. Session timeout handling
 * 6. Responsive UI interactions
 * 7. Booking confirmation with reference number
 */

class BookingConfirmation {
    constructor() {
        // Configuration
        this.config = {
            bookingExpiryMinutes: 15,
            warningMinutes: 2,
            autoRedirectDelay: 5000 // 5 seconds after success
        };
        
        // DOM Elements
        this.elements = {
            countdown: document.getElementById('countdown'),
            contactForm: document.querySelector('.contact-form form'),
            confirmBtn: document.querySelector('.btn-primary'),
            cancelBtn: document.querySelector('.btn-outline'),
            termsCheckbox: document.getElementById('accept-terms'),
            termsModal: document.getElementById('terms-modal')
        };
        
        // State
        this.state = {
            expiryTime: new Date(),
            countdownInterval: null,
            isFormSubmitting: false
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set expiry time
        this.state.expiryTime.setMinutes(
            this.state.expiryTime.getMinutes() + this.config.bookingExpiryMinutes
        );
        
        // Initialize modules
        this.initCountdown();
        this.initFormValidation();
        this.initBookingSummary();
        this.initEventListeners();
    }
    
    // ======================
    // 1. Countdown Timer
    // ======================
    initCountdown() {
        this.updateCountdown(); // Immediate update
        this.state.countdownInterval = setInterval(
            () => this.updateCountdown(), 
            1000
        );
    }
    
    updateCountdown() {
        const now = new Date();
        const diff = this.state.expiryTime - now;
        
        if (diff <= 0) {
            this.handleBookingExpired();
            return;
        }
        
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (this.elements.countdown) {
            this.elements.countdown.innerHTML = `
                <i class="far fa-clock"></i> 
                ${mins}m ${secs}s remaining
                ${mins <= this.config.warningMinutes ? 
                    '<span class="warning-text">(Hurry!)</span>' : ''}
            `;
        }
        
        if (mins === this.config.warningMinutes && secs === 0) {
            this.showSessionWarning();
        }
    }
    
    handleBookingExpired() {
        clearInterval(this.state.countdownInterval);
        if (this.elements.countdown) {
            this.elements.countdown.innerHTML = 
                '<span class="error-text">Booking expired!</span>';
        }
        this.disableForm();
    }
    
    showSessionWarning() {
        const warning = document.createElement('div');
        warning.className = 'session-warning-overlay';
        warning.innerHTML = `
            <div class="session-warning">
                <h3><i class="fas fa-exclamation-triangle"></i> Time Almost Up!</h3>
                <p>Your booking will expire in ${this.config.warningMinutes} minutes.</p>
                <button class="btn-primary warning-confirm">
                    Continue Booking
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        warning.querySelector('.warning-confirm').addEventListener('click', () => {
            warning.remove();
        });
    }
    
    // ======================
    // 2. Form Handling
    // ======================
    initFormValidation() {
        if (!this.elements.contactForm) return;
        
        // Real-time validation
        this.elements.contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
        });
        
        // Form submission
        this.elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }
    
    validateField(field) {
        const errorElement = field.nextElementSibling;
        
        // Clear previous errors
        field.classList.remove('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
        }
        
        // Validate based on field type
        if (field.required && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
            this.showFieldError(field, 'Please enter a valid email');
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
        }
    }
    
    async handleFormSubmit() {
        if (this.state.isFormSubmitting) return;
        
        // Validate all fields
        let isValid = true;
        this.elements.contactForm.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        
        // Validate terms
        if (this.elements.termsCheckbox && !this.elements.termsCheckbox.checked) {
            document.querySelector('.terms-error').style.display = 'block';
            isValid = false;
        } else {
            document.querySelector('.terms-error').style.display = 'none';
        }
        
        if (!isValid) return;
        
        // Submit form
        this.state.isFormSubmitting = true;
        this.showLoadingState();
        
        try {
            const bookingRef = await this.submitBookingData();
            this.showSuccessState(bookingRef);
            this.redirectToConfirmation(bookingRef);
        } catch (error) {
            this.showErrorState(error);
        } finally {
            this.state.isFormSubmitting = false;
        }
    }
    
    async submitBookingData() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.generateBookingRef());
            }, 1500);
        });
    }
    
    showLoadingState() {
        if (this.elements.confirmBtn) {
            this.elements.confirmBtn.innerHTML = 
                '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.elements.confirmBtn.disabled = true;
        }
    }
    
    showSuccessState(bookingRef) {
        if (this.elements.confirmBtn) {
            this.elements.confirmBtn.innerHTML = 
                '<i class="fas fa-check"></i> Booking Confirmed!';
        }
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'booking-success';
        successMsg.innerHTML = `
            <p>Your booking reference: <strong>${bookingRef}</strong></p>
            <p>Redirecting to confirmation page...</p>
        `;
        this.elements.contactForm.appendChild(successMsg);
    }
    
    showErrorState(error) {
        if (this.elements.confirmBtn) {
            this.elements.confirmBtn.innerHTML = 
                '<i class="fas fa-exclamation-circle"></i> Try Again';
            this.elements.confirmBtn.disabled = false;
        }
        
        alert(`Error: ${error.message || 'Failed to process booking'}`);
    }
    
    redirectToConfirmation(bookingRef) {
        setTimeout(() => {
            window.location.href = `confirmation-success.html?ref=${bookingRef}`;
        }, this.config.autoRedirectDelay);
    }
    
    // ======================
    // 3. Booking Summary
    // ======================
    initBookingSummary() {
        const bookingData = this.getBookingData();
        this.updateBookingSummary(bookingData);
        this.setStaffImage();
    }
    
    getBookingData() {
        const params = new URLSearchParams(window.location.search);
        
        return {
            service: params.get('service') || 'Haircut & Styling',
            date: this.formatDate(params.get('date')) || this.formatDate(new Date()),
            time: params.get('time') || '10:00 AM',
            duration: params.get('duration') || '1 hour',
            price: params.get('price') || '$75',
            staff: params.get('staff') || 'Alex Johnson',
            location: params.get('location') || '123 Salon St, New York'
        };
    }
    
    updateBookingSummary(data) {
        Object.entries(data).forEach(([key, value]) => {
            document.querySelectorAll(`[data-booking="${key}"]`).forEach(el => {
                el.textContent = value;
            });
        });
    }
    
    setStaffImage() {
        const staffImage = document.querySelector('.staff-image');
        if (staffImage) {
            const gender = Math.random() > 0.5 ? 'men' : 'women';
            staffImage.style.backgroundImage = 
                `url('https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 100)}.jpg')`;
        }
    }
    
    // ======================
    // 4. Utility Functions
    // ======================
    generateBookingRef() {
        return 'BK-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
    
    formatDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    disableForm() {
        document.querySelectorAll('input, textarea, button').forEach(el => {
            el.disabled = true;
        });
    }
    
    // ======================
    // 5. Event Listeners
    // ======================
    initEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.nav-links').classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
        
        // Terms modal
        if (this.elements.termsModal) {
            document.querySelector('.terms-link')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.termsModal.style.display = 'block';
            });
            
            document.querySelector('.close-modal')?.addEventListener('click', () => {
                this.elements.termsModal.style.display = 'none';
            });
        }
        
        // Cancel button
        if (this.elements.cancelBtn) {
            this.elements.cancelBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel this booking?')) {
                    window.location.href = 'services.html';
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookingConfirmation();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize phone input
    const phoneInput = document.querySelector("#phone");
    if (phoneInput) {
        window.intlTelInput(phoneInput, {
            initialCountry: "lk", // Sri Lanka
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
        });
    }

    // Form submission handler
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const termsChecked = document.querySelectorAll('.terms-section input[type="checkbox"]:checked').length === 4;
            
            if (!name || !phone) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (!termsChecked) {
                alert('Please accept all terms and conditions');
                return;
            }
            
            // If validation passes
            submitBooking();
        });
    }

    function submitBooking() {
        const btn = document.getElementById('request-appointment');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate API call (replace with actual fetch/AJAX)
        setTimeout(() => {
            // Update confirmation message with actual details
            document.getElementById('final-date').textContent = 
                document.getElementById('confirm-date').textContent;
            document.getElementById('final-time').textContent = 
                document.getElementById('confirm-time').textContent;
            
            // Show confirmation
            document.querySelector('.confirmation-message').style.display = 'flex';
            
            // Scroll to confirmation
            document.querySelector('.confirmation-message').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Reset button
            btn.disabled = false;
            btn.innerHTML = '<span class="btn-text">Booking Confirmed!</span> <span class="btn-icon"><i class="fas fa-check"></i></span>';
            
            // You would typically submit to server here
            console.log('Form data:', {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                date: document.getElementById('confirm-date').textContent,
                time: document.getElementById('confirm-time').textContent,
                stylist: document.querySelector('#confirm-staff h4').textContent
            });
            
        }, 1500);
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
            this.classList.toggle('active');
        });
    }
});

// Add this function to your booking-confirm.js file
function sendWhatsAppMessages() {
    // Collect all booking information
    const bookingDetails = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        date: document.getElementById('confirm-date').textContent,
        time: document.getElementById('confirm-time').textContent,
        stylist: document.querySelector('#confirm-staff h4').textContent,
        salonPhone: document.getElementById('salon-phone').value.trim()
    };

    // Format the message
    const whatsappMessage = `*New Booking Confirmation - Salon Hadakari*%0A%0A` +
        `*Customer Name:* ${bookingDetails.name}%0A` +
        `*Appointment Date:* ${bookingDetails.date}%0A` +
        `*Appointment Time:* ${bookingDetails.time}%0A` +
        `*Stylist:* ${bookingDetails.stylist}%0A` +
        `*Contact Number:* ${bookingDetails.phone}%0A` +
        `*Email:* ${bookingDetails.email || 'Not provided'}%0A` +
        `*Special Requests:* ${bookingDetails.message || 'None'}%0A%0A` +
        `Thank you for booking with Salon Hadakari!`;

    // Clean phone numbers (remove all non-digit characters except +)
    const cleanPhone = (phone) => phone.replace(/[^\d+]/g, '');
    const customerPhone = cleanPhone(bookingDetails.phone);
    const salonPhone = cleanPhone(bookingDetails.salonPhone);

    // Function to open WhatsApp with delay
    const openWhatsApp = (phone, message, delay = 0) => {
        setTimeout(() => {
            const url = `https://wa.me/${phone}?text=${message}`;
            window.open(url, '_blank');
        }, delay);
    };

    // First send to salon (immediately)
    openWhatsApp(salonPhone, whatsappMessage);
    
    // Then send to customer (after 1 second delay)
    openWhatsApp(customerPhone, whatsappMessage, 1000);
}

// Modify the existing submitBooking function
function submitBooking() {
    const btn = document.getElementById('request-appointment');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Validate all required fields
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const termsChecked = document.querySelectorAll('.terms-section input[type="checkbox"]:checked').length === 4;
    
    if (!name || !phone) {
        alert('Please fill in all required fields');
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Confirm Appointment</span> <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
        return;
    }
    
    if (!termsChecked) {
        alert('Please accept all terms and conditions');
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Confirm Appointment</span> <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
        return;
    }

    // Simulate processing delay
    setTimeout(() => {
        // Update confirmation message with actual details
        document.getElementById('final-date').textContent = 
            document.getElementById('confirm-date').textContent;
        document.getElementById('final-time').textContent = 
            document.getElementById('confirm-time').textContent;
        
        // Show confirmation
        document.querySelector('.confirmation-message').style.display = 'flex';
        
        // Scroll to confirmation
        document.querySelector('.confirmation-message').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Booking Confirmed!</span> <span class="btn-icon"><i class="fas fa-check"></i></span>';
        
        // Send WhatsApp messages
        sendWhatsAppMessages();
        
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize phone input
    const phoneInput = document.querySelector("#phone");
    if (phoneInput) {
        window.intlTelInput(phoneInput, {
            initialCountry: "lk", // Sri Lanka
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
        });
    }

    // Form submission handler
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBooking();
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
            this.classList.toggle('active');
        });
    }
});

function submitBooking() {
    const btn = document.getElementById('request-appointment');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Validate all required fields
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const termsChecked = document.querySelectorAll('.terms-section input[type="checkbox"]:checked').length === 4;
    
    if (!name || !phone) {
        alert('Please fill in all required fields');
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Confirm Appointment</span> <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
        return;
    }
    
    if (!termsChecked) {
        alert('Please accept all terms and conditions');
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Confirm Appointment</span> <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
        return;
    }

    // Simulate processing delay
    setTimeout(() => {
        // Update confirmation message with actual details
        document.getElementById('final-date').textContent = 
            document.getElementById('confirm-date').textContent;
        document.getElementById('final-time').textContent = 
            document.getElementById('confirm-time').textContent;
        
        // Show confirmation
        document.querySelector('.confirmation-message').style.display = 'flex';
        
        // Scroll to confirmation
        document.querySelector('.confirmation-message').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Booking Confirmed!</span> <span class="btn-icon"><i class="fas fa-check"></i></span>';
        
        // Send WhatsApp messages
        sendWhatsAppMessages();
        
    }, 1500);
}

function sendWhatsAppMessages() {
    // Collect all booking information
    const bookingDetails = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        date: document.getElementById('confirm-date').textContent,
        time: document.getElementById('confirm-time').textContent,
        stylist: document.querySelector('#confirm-staff h4').textContent,
        salonPhone: document.getElementById('salon-phone').value.trim()
    };

    // Format the message
    const whatsappMessage = `*New Booking Confirmation - Salon Hadakari*%0A%0A` +
        `*Customer Name:* ${bookingDetails.name}%0A` +
        `*Appointment Date:* ${bookingDetails.date}%0A` +
        `*Appointment Time:* ${bookingDetails.time}%0A` +
        `*Stylist:* ${bookingDetails.stylist}%0A` +
        `*Contact Number:* ${bookingDetails.phone}%0A` +
        `*Email:* ${bookingDetails.email || 'Not provided'}%0A` +
        `*Special Requests:* ${bookingDetails.message || 'None'}%0A%0A` +
        `Thank you for booking with Salon Hadakari!`;

    // Clean phone numbers (remove all non-digit characters except +)
    const cleanPhone = (phone) => phone.replace(/[^\d+]/g, '');
    const customerPhone = cleanPhone(bookingDetails.phone);
    const salonPhone = cleanPhone(bookingDetails.salonPhone);

    // First send to salon
    window.open(`https://wa.me/${salonPhone}?text=${whatsappMessage}`, '_blank');
    
    // Then send to customer (with slight delay to avoid popup blocking)
    setTimeout(() => {
        window.open(`https://wa.me/${customerPhone}?text=${whatsappMessage}`, '_blank');
    }, 500);
}