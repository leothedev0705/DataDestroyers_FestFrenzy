// Calendar Component with Google Calendar Integration
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.holidays = [];
        this.examDates = [];
        this.initialize();
    }

    async initialize() {
        try {
            await this.initGoogleCalendar();
            await this.fetchHolidays();
            this.render();
            this.initEventListeners();
        } catch (error) {
            console.error('Failed to initialize calendar:', error);
        }
    }

    async initGoogleCalendar() {
        // Initialize Google Calendar API
        await this.loadGoogleCalendarAPI();
    }

    async loadGoogleCalendarAPI() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client:auth2', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: process.env.GOOGLE_CALENDAR_API_KEY,
                            clientId: process.env.GOOGLE_CLIENT_ID,
                            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                            scope: 'https://www.googleapis.com/auth/calendar.readonly'
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async fetchHolidays() {
        try {
            if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                await gapi.auth2.getAuthInstance().signIn();
            }

            const response = await gapi.client.calendar.events.list({
                calendarId: 'en.usa#holiday@group.v.calendar.google.com', // US Holiday Calendar
                timeMin: new Date(this.currentDate.getFullYear(), 0, 1).toISOString(),
                timeMax: new Date(this.currentDate.getFullYear(), 11, 31).toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            this.holidays = response.result.items.map(event => ({
                date: new Date(event.start.date || event.start.dateTime),
                title: event.summary,
                type: 'holiday'
            }));
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    }

    render() {
        const calendarContainer = document.querySelector('.calendar-container');
        if (!calendarContainer) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

        calendarContainer.innerHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                    <h2>${monthNames[month]} ${year}</h2>
                    <button class="next-month"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-body">
                    <div class="weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div class="days"></div>
                </div>
            </div>
        `;

        const daysContainer = calendarContainer.querySelector('.days');
        let dayCount = 1;

        // Create 6 rows for the calendar grid
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'calendar-row';

            // Create 7 cells for each day of the week
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';

                if (i === 0 && j < startingDay) {
                    // Empty cells before the first day
                    cell.classList.add('empty');
                } else if (dayCount > daysInMonth) {
                    // Empty cells after the last day
                    cell.classList.add('empty');
                } else {
                    const currentDate = new Date(year, month, dayCount);
                    cell.textContent = dayCount;

                    // Check for holidays
                    const holiday = this.holidays.find(h => 
                        h.date.getDate() === dayCount && 
                        h.date.getMonth() === month
                    );

                    // Check for exam dates
                    const exam = this.examDates.find(e => 
                        e.date.getDate() === dayCount && 
                        e.date.getMonth() === month
                    );

                    if (holiday) {
                        cell.classList.add('holiday');
                        cell.setAttribute('title', holiday.title);
                    }

                    if (exam) {
                        cell.classList.add('exam');
                        cell.setAttribute('title', exam.title);
                    }

                    // Highlight current day
                    if (this.isToday(currentDate)) {
                        cell.classList.add('today');
                    }

                    // Highlight selected day
                    if (this.isSameDay(currentDate, this.selectedDate)) {
                        cell.classList.add('selected');
                    }

                    cell.addEventListener('click', () => this.selectDate(currentDate));
                    dayCount++;
                }

                row.appendChild(cell);
            }

            daysContainer.appendChild(row);
        }

        // Add event listeners for navigation
        calendarContainer.querySelector('.prev-month').addEventListener('click', () => this.previousMonth());
        calendarContainer.querySelector('.next-month').addEventListener('click', () => this.nextMonth());
    }

    selectDate(date) {
        this.selectedDate = date;
        this.render();
        this.showDateDetails(date);
    }

    showDateDetails(date) {
        const holiday = this.holidays.find(h => this.isSameDay(h.date, date));
        const exam = this.examDates.find(e => this.isSameDay(e.date, date));

        const details = [];
        if (holiday) details.push({ type: 'holiday', title: holiday.title });
        if (exam) details.push({ type: 'exam', title: exam.title });

        // Show details in a modal or sidebar
        if (details.length > 0) {
            this.showDetailsModal(date, details);
        }
    }

    showDetailsModal(date, details) {
        const modal = document.createElement('div');
        modal.className = 'calendar-details-modal';
        
        const content = document.createElement('div');
        content.className = 'calendar-details-content';
        
        const header = document.createElement('div');
        header.className = 'calendar-details-header';
        header.innerHTML = `
            <h3>${date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</h3>
            <button class="close-details">&times;</button>
        `;

        const detailsList = document.createElement('div');
        detailsList.className = 'calendar-details-list';
        
        details.forEach(detail => {
            const item = document.createElement('div');
            item.className = `calendar-detail-item ${detail.type}`;
            item.innerHTML = `
                <span class="detail-type">${detail.type.toUpperCase()}</span>
                <span class="detail-title">${detail.title}</span>
            `;
            detailsList.appendChild(item);
        });

        content.appendChild(header);
        content.appendChild(detailsList);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // Close button event
        modal.querySelector('.close-details').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    previousMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
        this.render();
    }

    isToday(date) {
        const today = new Date();
        return this.isSameDay(date, today);
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    addExamDate(date, title) {
        this.examDates.push({ date, title });
        this.render();
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
}); 