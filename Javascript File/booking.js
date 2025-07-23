document.addEventListener('DOMContentLoaded', function() {
    // Initialize staff selection
    const staffCards = document.querySelectorAll('.staff-card');
    staffCards.forEach(card => {
        card.addEventListener('click', function() {
            staffCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            localStorage.setItem('selectedStaff', this.dataset.staff);
        });
    });

    // Initialize date picker
    initializeDatePicker();

    // Initialize time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            localStorage.setItem('selectedTime', this.textContent);
        });
    });

    // Check if there's saved data and pre-select
    if (localStorage.getItem('selectedStaff')) {
        document.querySelector(`.staff-card[data-staff="${localStorage.getItem('selectedStaff')}"]`).classList.add('selected');
    }
    if (localStorage.getItem('selectedDate')) {
        // This would be handled in the date picker initialization
    }
    if (localStorage.getItem('selectedTime')) {
        const time = localStorage.getItem('selectedTime');
        timeSlots.forEach(slot => {
            if (slot.textContent === time) {
                slot.classList.add('selected');
            }
        });
    }
});

function nextStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${currentStep + 1}`).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmBooking() {
    // Save all data to localStorage
    const selectedDate = document.querySelector('.day.selected');
    if (selectedDate) {
        const monthYear = document.querySelector('.current-month').textContent;
        localStorage.setItem('selectedDate', `${selectedDate.textContent} ${monthYear}`);
    }
    
    // Redirect to confirmation page
    window.location.href = 'booking-confirm.html';
}

function initializeDatePicker() {
    const currentMonthEl = document.querySelector('.current-month');
    const daysGrid = document.querySelector('.days-grid');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    let currentDate = new Date();
    if (localStorage.getItem('selectedDate')) {
        // Parse the stored date if available
        const storedDate = localStorage.getItem('selectedDate').split(' ');
        currentDate = new Date(`${storedDate[1]} ${storedDate[0]}, ${storedDate[2]}`);
        if (isNaN(currentDate.getTime())) {
            currentDate = new Date();
        }
    }
    
    function renderCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;
        
        currentMonthEl.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)} ${currentDate.getFullYear()}`;
        
        daysGrid.innerHTML = '';
        
        // Previous month days
        for (let i = firstDayIndex; i > 0; i--) {
            const day = document.createElement('div');
            day.classList.add('day', 'disabled');
            day.textContent = prevLastDay.getDate() - i + 1;
            daysGrid.appendChild(day);
        }
        
        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;
            
            // Check if this day is selected
            if (localStorage.getItem('selectedDate')) {
                const storedDate = localStorage.getItem('selectedDate').split(' ');
                if (parseInt(day.textContent) === parseInt(storedDate[0]) && 
                    currentMonthEl.textContent === `${storedDate[1]} ${storedDate[2]}`) {
                    day.classList.add('selected');
                }
            }
            
            day.addEventListener('click', function() {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
            });
            
            daysGrid.appendChild(day);
        }
        
        // Next month days
        for (let i = 1; i <= nextDays; i++) {
            const day = document.createElement('div');
            day.classList.add('day', 'disabled');
            day.textContent = i;
            daysGrid.appendChild(day);
        }
    }
    
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
}