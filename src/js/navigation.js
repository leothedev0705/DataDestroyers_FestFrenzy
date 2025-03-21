// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const signOutBtn = document.getElementById('signOutBtn');

// Navigation handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.dataset.section;
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(section => {
            if (section.id === targetSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
});

// Sign out handling
signOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear user data from both localStorage and sessionStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'login.html';
});

// Initialize usage chart
const usageChart = new Chart(document.getElementById('usageChart'), {
    type: 'bar',
    data: {
        labels: ['HIGH', 'AVG', 'ME'],
        datasets: [{
            data: [95, 75, 85],
            backgroundColor: [
                'rgba(139, 92, 246, 0.8)',  // Primary color
                'rgba(96, 165, 250, 0.8)',  // Secondary color
                'rgba(167, 139, 250, 0.8)'  // Primary light
            ],
            borderColor: [
                'rgba(139, 92, 246, 1)',
                'rgba(96, 165, 250, 1)',
                'rgba(167, 139, 250, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
}); 