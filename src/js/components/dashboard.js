// Digital Clock
function updateClock() {
    const now = new Date();
    const clockElements = document.querySelectorAll('#clock');
    const dateElements = document.querySelectorAll('#date');

    // Update time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Update all clock elements on the page
    clockElements.forEach(element => {
        element.textContent = `${hours}:${minutes}:${seconds}`;
    });

    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    
    // Update all date elements on the page
    dateElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Calendar
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.setupCalendar();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const prevButtons = document.querySelectorAll('#prevMonth');
        const nextButtons = document.querySelectorAll('#nextMonth');
        
        prevButtons.forEach(button => {
            button.addEventListener('click', () => this.previousMonth());
        });
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextMonth());
        });
    }

    updateCalendarHeader() {
        const headerElements = document.querySelectorAll('#currentMonth');
        headerElements.forEach(element => {
            element.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        });
    }

    getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    getFirstDayOfMonth(month, year) {
        return new Date(year, month, 1).getDay();
    }

    generateCalendarDays() {
        const calendarContainers = document.querySelectorAll('#calendarDays');
        if (calendarContainers.length === 0) return;
        
        const daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
        const firstDay = this.getFirstDayOfMonth(this.currentMonth, this.currentYear);
        
        // Previous month's days
        const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        const daysInPrevMonth = this.getDaysInMonth(prevMonth, prevYear);
        
        // Today's date for highlighting
        const today = new Date();

        calendarContainers.forEach(calendarDays => {
            calendarDays.innerHTML = '';

            // Previous month's days
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = daysInPrevMonth - i;
                calendarDays.appendChild(dayElement);
            }

            // Current month's days
            for (let i = 1; i <= daysInMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                if (i === today.getDate() && 
                    this.currentMonth === today.getMonth() && 
                    this.currentYear === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                dayElement.textContent = i;
                calendarDays.appendChild(dayElement);
            }

            // Next month's days
            const totalDays = firstDay + daysInMonth;
            const remainingDays = 42 - totalDays; // 6 rows × 7 days = 42

            for (let i = 1; i <= remainingDays; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = i;
                calendarDays.appendChild(dayElement);
            }
        });
    }

    setupCalendar() {
        this.updateCalendarHeader();
        this.generateCalendarDays();
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.setupCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.setupCalendar();
    }
}

// Initialize dashboard components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize clock (already called above)
    
    // Initialize calendar if calendar containers exist
    if (document.querySelector('#calendarDays')) {
        new Calendar();
    }
}); 