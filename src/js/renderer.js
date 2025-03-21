// DOM Elements
const dashboard = document.getElementById('dashboard');
const studySession = document.getElementById('studySession');
const sessionComplete = document.getElementById('sessionComplete');
const timeSlider = document.getElementById('timeSlider');
const timeValue = document.getElementById('timeValue');
const customTimeSetup = document.getElementById('customTimeSetup');
const sessionOptions = document.querySelectorAll('.session-option');
const startSessionBtn = document.getElementById('startSessionBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const returnToDashboardBtn = document.getElementById('returnToDashboardBtn');
const sessionNotes = document.getElementById('sessionNotes');
const notesDisplay = document.getElementById('notesDisplay');
const sessionTypeDisplay = document.getElementById('sessionTypeDisplay');
const sessionTypeIcon = document.getElementById('sessionTypeIcon');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const timerLabel = document.getElementById('timerLabel');
const totalTimeElement = document.getElementById('totalTime');
const pomodoroStatus = document.getElementById('pomodoroStatus');
const pomodoroCycles = document.getElementById('pomodoroCycles');

// New DOM Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const sessionTaskList = document.getElementById('sessionTaskList');
const completedTasksList = document.getElementById('completedTasksList');
const completedTasksContainer = document.getElementById('completedTasksContainer');
const soundOptions = document.querySelectorAll('.sound-option');
const volumeControl = document.querySelector('.volume-control');
const volumeSlider = document.getElementById('volumeSlider');
const studyModeSound = document.getElementById('studyModeSound');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const studyModeVolumeSlider = document.getElementById('studyModeVolumeSlider');
const totalStudyTimeElement = document.getElementById('totalStudyTime');
const sessionsCompletedElement = document.getElementById('sessionsCompleted');
const achievementsEarnedElement = document.getElementById('achievementsEarned');
const sessionHistory = document.getElementById('sessionHistory');
const achievementContainer = document.getElementById('achievementContainer');
const achievementIcon = document.getElementById('achievementIcon');
const achievementName = document.getElementById('achievementName');
const achievementsPanel = document.getElementById('achievementsPanel');
const achievementsList = document.getElementById('achievementsList');
const closeAchievementsBtn = document.getElementById('closeAchievementsBtn');

// Add new DOM elements for dashboard
const weeklyProgressChart = document.getElementById('weeklyProgressChart');
const subjectDistributionChart = document.getElementById('subjectDistributionChart');
const focusDistributionChart = document.getElementById('focusDistributionChart');
const weeklyStudyTime = document.getElementById('weeklyStudyTime');
const dailyAverage = document.getElementById('dailyAverage');
const bestDay = document.getElementById('bestDay');
const subjectList = document.getElementById('subjectList');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const subjectModal = document.getElementById('subjectModal');
const saveSubjectBtn = document.getElementById('saveSubjectBtn');
const cancelSubjectBtn = document.getElementById('cancelSubjectBtn');
const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalsList = document.getElementById('goalsList');
const activityTimeline = document.getElementById('activityTimeline');
const peakHours = document.getElementById('peakHours');
const bestTechnique = document.getElementById('bestTechnique');
const studyCalendar = document.getElementById('studyCalendar');
const upcomingSessionsList = document.getElementById('upcomingSessionsList');
const scheduleSessionBtn = document.getElementById('scheduleSessionBtn');
const scheduleModal = document.getElementById('scheduleModal');
const saveScheduleBtn = document.getElementById('saveScheduleBtn');
const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');
const tasksCompleted = document.getElementById('tasksCompleted');

// Session state
let sessionType = 'pomodoro';
let sessionDuration = 120; // in minutes (default for pomodoro)
let timer = null;
let startTime = null;
let elapsedTime = 0;
let totalSessionTime = 0;
let isPaused = false;
let isBreak = false;
let pomodoroWorkTime = 25 * 60; // 25 minutes in seconds
let pomodoroBreakTime = 5 * 60; // 5 minutes in seconds
let currentPhaseTime = 0;
let pomodoroCycleCount = 0;
let currentCycle = 1;
let tasks = [];
let selectedSound = 'none';
let soundVolume = 50;
let audioPlayer = null;
let isDarkTheme = false;
let isPlaying = false;
let statistics = {
    totalStudyTime: 0, // in minutes
    sessionsCompleted: 0,
    achievements: [],
    sessionHistory: []
};

// Add new state variables
let subjects = [];
let goals = [];
let scheduledSessions = [];
let weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [0, 0, 0, 0, 0, 0, 0]
};
let charts = {
    weeklyProgress: null,
    subjectDistribution: null,
    focusDistribution: null
};

// Audio files
const audioFiles = {
    rain: 'sounds/rain.mp3',
    cafe: 'sounds/cafe.mp3',
    nature: 'sounds/nature.mp3',
    whitenoise: 'sounds/whitenoise.mp3'
};

// Session type configurations
const sessionTypes = {
    pomodoro: {
        name: 'Pomodoro Technique',
        duration: 120, // 2 hours
        icon: 'fa-clock',
        description: '25 min work, 5 min break, repeat'
    },
    feynman: {
        name: 'Feynman Technique',
        duration: 90, // 1.5 hours
        icon: 'fa-chalkboard-teacher',
        description: 'Study, teach, identify gaps, simplify'
    },
    deep: {
        name: 'Deep Work',
        duration: 180, // 3 hours
        icon: 'fa-brain',
        description: 'Extended focused work without distractions'
    },
    custom: {
        name: 'Custom Session',
        duration: 60, // Default 1 hour, but user can change
        icon: 'fa-sliders-h',
        description: 'Create your own study schedule'
    }
};

// Achievement definitions
const achievementDefinitions = [
    {
        id: 'first_session',
        name: 'First Steps',
        description: 'Complete your first study session',
        icon: 'fa-shoe-prints',
        condition: (stats) => stats.sessionsCompleted >= 1
    },
    {
        id: 'five_sessions',
        name: 'Getting Serious',
        description: 'Complete 5 study sessions',
        icon: 'fa-user-graduate',
        condition: (stats) => stats.sessionsCompleted >= 5
    },
    {
        id: 'ten_hours',
        name: 'Dedicated Scholar',
        description: 'Study for more than 10 hours total',
        icon: 'fa-book',
        condition: (stats) => stats.totalStudyTime >= 600
    },
    {
        id: 'pomodoro_master',
        name: 'Pomodoro Master',
        description: 'Complete 3 Pomodoro sessions',
        icon: 'fa-clock',
        condition: (stats) => stats.sessionHistory.filter(s => s.type === 'pomodoro').length >= 3
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Study after 10 PM',
        icon: 'fa-moon',
        condition: (stats, session) => {
            const hour = new Date().getHours();
            return hour >= 22 || hour < 5;
        }
    },
    {
        id: 'task_master',
        name: 'Task Master',
        description: 'Complete 10 tasks during study sessions',
        icon: 'fa-tasks',
        condition: (stats) => {
            let totalTasks = 0;
            stats.sessionHistory.forEach(session => {
                totalTasks += session.completedTasks || 0;
            });
            return totalTasks >= 10;
        }
    }
];

// Initialize the application
function init() {
    loadUserPreferences();
    loadStatistics();
    setupEventListeners();
    initializeCharts();
    updateTimeDisplay();
    renderTasks();
    updateStatistics();
    renderAchievements();
    
    // Initialize new dashboard features
    updateWeeklyProgress();
    renderSubjects();
    updateSubjectChart();
    renderGoals();
    renderCalendar();
    renderScheduledSessions();
    updateFocusDistribution();
}

// Load user preferences from storage
async function loadUserPreferences() {
    try {
        const preferences = await window.api.getPreferences();
        
        // Load existing preferences
        if (preferences.isDarkTheme) {
            isDarkTheme = preferences.isDarkTheme;
            updateTheme();
        }
        
        if (preferences.sessionType) {
            sessionType = preferences.sessionType;
            selectSessionOption(sessionType);
        }
        
        if (preferences.sessionDuration && sessionType === 'custom') {
            sessionDuration = preferences.sessionDuration;
            timeSlider.value = sessionDuration;
            timeValue.textContent = sessionDuration;
        }
        
        if (preferences.notes) {
            sessionNotes.value = preferences.notes;
        }
        
        if (preferences.tasks) {
            tasks = preferences.tasks;
            renderTasks();
        }
        
        if (preferences.selectedSound) {
            selectedSound = preferences.selectedSound;
            updateSoundSelection();
        }
        
        if (preferences.soundVolume) {
            soundVolume = preferences.soundVolume;
            volumeSlider.value = soundVolume;
            studyModeVolumeSlider.value = soundVolume;
        }
        
        // Load new preferences
        if (preferences.subjects) {
            subjects = preferences.subjects;
        }
        
        if (preferences.goals) {
            goals = preferences.goals;
        }
        
        if (preferences.scheduledSessions) {
            scheduledSessions = preferences.scheduledSessions;
        }
        
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Load statistics from storage
async function loadStatistics() {
    try {
        const stats = await window.api.getStatistics();
        if (stats) {
            statistics = stats;
            updateStatistics();
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Save user preferences to storage
function saveUserPreferences() {
    const preferences = {
        sessionType,
        sessionDuration,
        notes: sessionNotes.value,
        tasks,
        isDarkTheme,
        selectedSound,
        soundVolume,
        subjects,
        goals,
        scheduledSessions
    };
    window.api.savePreferences(preferences);
}

// Save statistics to storage
function saveStatistics() {
    window.api.saveStatistics(statistics);
}

// Update the UI to reflect current statistics
function updateStatistics() {
    totalStudyTimeElement.textContent = (statistics.totalStudyTime / 60).toFixed(1);
    sessionsCompletedElement.textContent = statistics.sessionsCompleted;
    achievementsEarnedElement.textContent = statistics.achievements.length;
    
    // Calculate total completed tasks
    const totalTasks = statistics.sessionHistory.reduce((total, session) => 
        total + (session.completedTasks || 0), 0);
    tasksCompleted.textContent = totalTasks;
    
    // Update all dashboard components
    updateWeeklyProgress();
    updateSubjectChart();
    updateFocusDistribution();
    renderCalendar();
    
    // Add to activity timeline
    if (statistics.sessionHistory.length > 0) {
        const lastSession = statistics.sessionHistory[statistics.sessionHistory.length - 1];
        addActivity(`Completed a ${lastSession.duration} minute ${lastSession.type} session`);
    }
    
    // Update session history
    renderSessionHistory();
}

// Render session history
function renderSessionHistory() {
    // Clear history container except for the "no history" message
    const noHistory = sessionHistory.querySelector('.no-history');
    sessionHistory.innerHTML = '';
    
    if (statistics.sessionHistory.length === 0) {
        sessionHistory.appendChild(noHistory);
        return;
    }
    
    // Get last 5 sessions
    const recentSessions = statistics.sessionHistory.slice(-5).reverse();
    
    recentSessions.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        
        const sessionInfo = document.createElement('div');
        sessionInfo.className = 'session-info';
        
        const sessionTitle = document.createElement('div');
        sessionTitle.className = 'session-title';
        sessionTitle.textContent = session.type.charAt(0).toUpperCase() + session.type.slice(1);
        
        const sessionDuration = document.createElement('div');
        sessionDuration.className = 'session-duration';
        sessionDuration.textContent = `${session.duration} mins`;
        
        sessionInfo.appendChild(sessionTitle);
        sessionInfo.appendChild(sessionDuration);
        
        const sessionDate = document.createElement('div');
        sessionDate.className = 'session-date';
        sessionDate.textContent = new Date(session.date).toLocaleDateString();
        
        sessionItem.appendChild(sessionInfo);
        sessionItem.appendChild(sessionDate);
        
        sessionHistory.appendChild(sessionItem);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Task management
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Sound options
    soundOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedSound = option.dataset.sound;
            updateSoundSelection();
            
            // Show/hide volume control
            if (selectedSound === 'none') {
                volumeControl.classList.add('hidden');
                stopAudio();
            } else {
                volumeControl.classList.remove('hidden');
                playAudio(selectedSound);
            }
        });
    });
    
    // Volume sliders
    volumeSlider.addEventListener('input', () => {
        soundVolume = volumeSlider.value;
        if (audioPlayer) {
            audioPlayer.volume = soundVolume / 100;
        }
        studyModeVolumeSlider.value = soundVolume;
    });
    
    studyModeVolumeSlider.addEventListener('input', () => {
        soundVolume = studyModeVolumeSlider.value;
        if (audioPlayer) {
            audioPlayer.volume = soundVolume / 100;
        }
        volumeSlider.value = soundVolume;
    });
    
    // Sound toggle in study mode
    soundToggleBtn.addEventListener('click', toggleAudio);
    
    // Time slider
    timeSlider.addEventListener('input', () => {
        sessionDuration = parseInt(timeSlider.value);
        timeValue.textContent = sessionDuration;
    });

    // Session options
    sessionOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            const duration = parseInt(option.dataset.duration);
            
            sessionType = type;
            sessionDuration = duration;
            
            // Show/hide custom time setup
            if (type === 'custom') {
                customTimeSetup.classList.remove('hidden');
            } else {
                customTimeSetup.classList.add('hidden');
            }
            
            selectSessionOption(type);
        });
    });

    // Start session button
    startSessionBtn.addEventListener('click', startSession);

    // Pause button
    pauseBtn.addEventListener('click', pauseSession);

    // Resume button
    resumeBtn.addEventListener('click', resumeSession);

    // End session button
    endSessionBtn.addEventListener('click', endSession);

    // Return to dashboard button
    returnToDashboardBtn.addEventListener('click', returnToDashboard);
    
    // Close achievements panel
    closeAchievementsBtn.addEventListener('click', () => {
        achievementsPanel.classList.remove('visible');
    });
    
    // Open achievements panel when clicking on achievements count
    achievementsEarnedElement.parentElement.addEventListener('click', () => {
        achievementsPanel.classList.add('visible');
    });

    // IPC events
    window.api.onSessionStarted((success) => {
        if (success) {
            console.log('Session started in kiosk mode');
        }
    });

    window.api.onSessionEnded((success) => {
        if (success) {
            console.log('Session ended, exited kiosk mode');
        }
    });
}

// Toggle between light and dark theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    updateTheme();
    saveUserPreferences();
}

// Update the theme based on current state
function updateTheme() {
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        saveUserPreferences();
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveUserPreferences();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
    saveUserPreferences();
}

// Render tasks in both dashboard and study mode
function renderTasks() {
    // Clear task lists
    taskList.innerHTML = '';
    sessionTaskList.innerHTML = '';
    
    // Render tasks in dashboard
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        
        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
    
    // Render tasks in study mode
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `session-task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));
        
        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;
        
        li.appendChild(checkbox);
        li.appendChild(text);
        
        sessionTaskList.appendChild(li);
    });
}

// Update sound selection UI
function updateSoundSelection() {
    soundOptions.forEach(option => {
        if (option.dataset.sound === selectedSound) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Play audio
function playAudio(sound) {
    if (sound === 'none') return;
    
    // Stop current audio if playing
    stopAudio();
    
    // Create new audio player
    audioPlayer = new Audio(audioFiles[sound]);
    audioPlayer.loop = true;
    audioPlayer.volume = soundVolume / 100;
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
    });
    
    isPlaying = true;
    updateAudioUI();
}

// Stop audio
function stopAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer = null;
    }
    isPlaying = false;
    updateAudioUI();
}

// Toggle audio
function toggleAudio() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        if (audioPlayer) {
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            isPlaying = true;
        } else if (selectedSound !== 'none') {
            playAudio(selectedSound);
        }
    }
    updateAudioUI();
}

// Update audio UI
function updateAudioUI() {
    if (isPlaying) {
        soundToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        soundToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Select a session option
function selectSessionOption(type) {
    sessionOptions.forEach(option => {
        if (option.dataset.type === type) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Update session type display
    sessionTypeDisplay.textContent = sessionTypes[type].name;
    sessionTypeIcon.className = `fas ${sessionTypes[type].icon}`;
    
    // Update duration if not custom
    if (type !== 'custom') {
        sessionDuration = sessionTypes[type].duration;
    }
}

// Start the study session
function startSession() {
    // Save user preferences
    saveUserPreferences();

    // Display notes
    notesDisplay.textContent = sessionNotes.value || 'No goals set for this session.';

    // Hide dashboard and show study session
    dashboard.classList.add('hidden');
    studySession.classList.remove('hidden');

    // Set up timer based on session type
    setupTimer();

    // Start the timer
    startTimer();

    // Show/hide pomodoro status
    if (sessionType === 'pomodoro') {
        setupPomodoroUI();
        pomodoroStatus.classList.remove('hidden');
    } else {
        pomodoroStatus.classList.add('hidden');
    }
    
    // Show/hide sound controls
    if (selectedSound !== 'none') {
        studyModeSound.classList.remove('hidden');
        playAudio(selectedSound);
    }

    // Re-render tasks for study mode
    renderTasks();

    // Enter kiosk mode
    window.api.startSession({
        type: sessionType,
        duration: sessionDuration,
        notes: sessionNotes.value
    });
}

// Set up the timer based on session type
function setupTimer() {
    totalSessionTime = sessionDuration * 60; // Convert minutes to seconds
    
    if (sessionType === 'pomodoro') {
        currentPhaseTime = pomodoroWorkTime;
        isBreak = false;
        timerLabel.textContent = 'Work Time';
        
        // Calculate number of full pomodoro cycles
        pomodoroCycleCount = Math.floor(totalSessionTime / (pomodoroWorkTime + pomodoroBreakTime));
        currentCycle = 1;
    } else {
        currentPhaseTime = totalSessionTime;
        timerLabel.textContent = 'Study Time';
    }
    
    updateTimerDisplay(currentPhaseTime);
}

// Set up the Pomodoro UI
function setupPomodoroUI() {
    // Clear existing cycles
    pomodoroCycles.innerHTML = '';
    
    // Create cycle indicators
    for (let i = 1; i <= pomodoroCycleCount; i++) {
        // Work cycle
        const workCycle = document.createElement('div');
        workCycle.className = 'pomodoro-cycle work';
        workCycle.textContent = i;
        if (i === 1) workCycle.classList.add('current');
        pomodoroCycles.appendChild(workCycle);
        
        // Break cycle (except after the last work cycle)
        if (i < pomodoroCycleCount) {
            const breakCycle = document.createElement('div');
            breakCycle.className = 'pomodoro-cycle break';
            breakCycle.textContent = 'B';
            pomodoroCycles.appendChild(breakCycle);
        }
    }
}

// Update the Pomodoro UI
function updatePomodoroUI() {
    const cycles = pomodoroCycles.querySelectorAll('.pomodoro-cycle');
    cycles.forEach(cycle => cycle.classList.remove('current'));
    
    // Calculate current cycle index
    let currentIndex = (currentCycle - 1) * 2;
    if (isBreak) currentIndex += 1;
    
    // Make sure we don't go out of bounds
    if (currentIndex < cycles.length) {
        cycles[currentIndex].classList.add('current');
    }
}

// Start the timer
function startTimer() {
    startTime = Date.now();
    elapsedTime = 0;
    
    timer = setInterval(() => {
        if (!isPaused) {
            const now = Date.now();
            elapsedTime = Math.floor((now - startTime) / 1000);
            
            if (sessionType === 'pomodoro') {
                handlePomodoroTimer();
            } else {
                handleRegularTimer();
            }
        }
    }, 1000);
}

// Handle the Pomodoro timer
function handlePomodoroTimer() {
    const timeRemaining = currentPhaseTime - elapsedTime;
    
    if (timeRemaining <= 0) {
        // Switch between work and break
        isBreak = !isBreak;
        startTime = Date.now();
        elapsedTime = 0;
        
        if (isBreak) {
            currentPhaseTime = pomodoroBreakTime;
            timerLabel.textContent = 'Break Time';
            
            // Play notification sound or show alert
            playNotificationSound('break');
        } else {
            currentPhaseTime = pomodoroWorkTime;
            timerLabel.textContent = 'Work Time';
            currentCycle++;
            
            // Play notification sound or show alert
            playNotificationSound('work');
        }
        
        // Update Pomodoro UI
        updatePomodoroUI();
    }
    
    updateTimerDisplay(timeRemaining > 0 ? timeRemaining : 0);
    
    // Update progress based on total session time
    const totalElapsed = calculateTotalElapsedTime();
    updateProgress(totalElapsed, totalSessionTime);
    
    // Check if the entire session is complete
    if (totalElapsed >= totalSessionTime) {
        completeSession();
    }
}

// Play notification sound
function playNotificationSound(type) {
    // In a real app, you would play a sound here
    // For now, we'll just show an alert
    if (type === 'break') {
        alert('Time for a break!');
    } else {
        alert('Break over! Back to work!');
    }
}

// Handle regular timer
function handleRegularTimer() {
    const timeRemaining = totalSessionTime - elapsedTime;
    
    updateTimerDisplay(timeRemaining > 0 ? timeRemaining : 0);
    updateProgress(elapsedTime, totalSessionTime);
    
    if (timeRemaining <= 0) {
        completeSession();
    }
}

// Calculate total elapsed time for Pomodoro sessions
function calculateTotalElapsedTime() {
    // For simplicity, we'll just use the elapsed time
    // In a real app, you would need to track the total time across all pomodoro cycles
    return elapsedTime;
}

// Update the timer display
function updateTimerDisplay(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Update the progress bar
function updateProgress(current, total) {
    const percentage = Math.min(Math.floor((current / total) * 100), 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

// Pause the session
function pauseSession() {
    isPaused = true;
    pauseBtn.classList.add('hidden');
    resumeBtn.classList.remove('hidden');
    
    // Pause audio if playing
    if (audioPlayer && isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        updateAudioUI();
    }
}

// Resume the session
function resumeSession() {
    isPaused = false;
    startTime = Date.now() - (elapsedTime * 1000);
    pauseBtn.classList.remove('hidden');
    resumeBtn.classList.add('hidden');
    
    // Resume audio if it was playing
    if (audioPlayer && !isPlaying && selectedSound !== 'none') {
        audioPlayer.play();
        isPlaying = true;
        updateAudioUI();
    }
}

// End the session early
function endSession() {
    if (confirm('Are you sure you want to end this session early?')) {
        clearInterval(timer);
        completeSession();
    }
}

// Complete the session
function completeSession() {
    clearInterval(timer);
    
    // Calculate total study time in minutes
    const totalMinutes = Math.floor(elapsedTime / 60);
    totalTimeElement.textContent = totalMinutes;
    
    // Stop audio
    stopAudio();
    
    // Update statistics
    updateSessionStats(totalMinutes);
    
    // Check for achievements
    checkAchievements();
    
    // Show completed tasks
    showCompletedTasks();
    
    // Hide study session and show completion screen
    studySession.classList.add('hidden');
    sessionComplete.classList.remove('hidden');
    
    // Exit kiosk mode
    window.api.endSession();
}

// Show completed tasks
function showCompletedTasks() {
    // Clear completed tasks list
    completedTasksList.innerHTML = '';
    
    // Get completed tasks
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) {
        completedTasksContainer.classList.add('hidden');
        return;
    }
    
    completedTasksContainer.classList.remove('hidden');
    
    // Add each task to the list
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        completedTasksList.appendChild(li);
    });
}

// Update session statistics
function updateSessionStats(duration) {
    // Update total study time
    statistics.totalStudyTime += duration;
    
    // Increment sessions completed
    statistics.sessionsCompleted++;
    
    // Add to session history
    const sessionData = {
        type: sessionType,
        duration: duration,
        date: Date.now(),
        completedTasks: tasks.filter(task => task.completed).length
    };
    
    statistics.sessionHistory.push(sessionData);
    
    // Limit history to last 20 sessions
    if (statistics.sessionHistory.length > 20) {
        statistics.sessionHistory = statistics.sessionHistory.slice(-20);
    }
    
    // Save statistics
    saveStatistics();
    
    // Update UI
    updateStatistics();
}

// Check for achievements
function checkAchievements() {
    achievementDefinitions.forEach(achievement => {
        // Skip if already earned
        if (statistics.achievements.includes(achievement.id)) return;
        
        // Check if condition is met
        if (achievement.condition(statistics)) {
            // Add achievement
            statistics.achievements.push(achievement.id);
            
            // Show achievement notification
            showAchievementNotification(achievement);
            
            // Save statistics
            saveStatistics();
            
            // Render achievements
            renderAchievements();
        }
    });
}

// Show achievement notification
function showAchievementNotification(achievement) {
    achievementIcon.className = `fas ${achievement.icon}`;
    achievementName.textContent = achievement.name;
    achievementContainer.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        achievementContainer.classList.add('hidden');
    }, 5000);
}

// Render achievements
function renderAchievements() {
    // Clear achievements list
    achievementsList.innerHTML = '';
    
    // Update count
    achievementsEarnedElement.textContent = statistics.achievements.length;
    
    // Add each achievement
    achievementDefinitions.forEach(achievement => {
        const isUnlocked = statistics.achievements.includes(achievement.id);
        
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        const achievementIcon = document.createElement('div');
        achievementIcon.className = 'achievement-item-icon';
        achievementIcon.innerHTML = `<i class="fas ${achievement.icon}"></i>`;
        
        const achievementInfo = document.createElement('div');
        achievementInfo.className = 'achievement-item-info';
        
        const achievementTitle = document.createElement('h3');
        achievementTitle.textContent = achievement.name;
        
        const achievementDesc = document.createElement('p');
        achievementDesc.textContent = achievement.description;
        
        achievementInfo.appendChild(achievementTitle);
        achievementInfo.appendChild(achievementDesc);
        
        achievementItem.appendChild(achievementIcon);
        achievementItem.appendChild(achievementInfo);
        
        achievementsList.appendChild(achievementItem);
    });
}

// Return to the dashboard
function returnToDashboard() {
    sessionComplete.classList.add('hidden');
    dashboard.classList.remove('hidden');
    updateTimeDisplay();
    
    // Reset tasks completion status
    tasks = tasks.map(task => ({ ...task, completed: false }));
    renderTasks();
    saveUserPreferences();
}

// Update the time display on the dashboard
function updateTimeDisplay() {
    timeValue.textContent = sessionDuration;
}

// Initialize charts
function initializeCharts() {
    // Weekly Progress Chart
    charts.weeklyProgress = new Chart(weeklyProgressChart, {
        type: 'bar',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Study Hours',
                data: weeklyData.data,
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Subject Distribution Chart
    charts.subjectDistribution = new Chart(subjectDistributionChart, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Focus Distribution Chart
    charts.focusDistribution = new Chart(focusDistributionChart, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Focus Level',
                data: Array(24).fill(0),
                borderColor: 'rgba(46, 204, 113, 1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Update weekly progress
function updateWeeklyProgress() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    let weeklyTotal = 0;
    let bestStudyDay = { day: '-', hours: 0 };
    
    weeklyData.data = weeklyData.labels.map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + index);
        
        // Calculate total study time for this day
        const dayTotal = statistics.sessionHistory
            .filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate.toDateString() === date.toDateString();
            })
            .reduce((total, session) => total + session.duration, 0);
        
        const hours = dayTotal / 60;
        weeklyTotal += hours;
        
        if (hours > bestStudyDay.hours) {
            bestStudyDay = {
                day: weeklyData.labels[index],
                hours: hours
            };
        }
        
        return hours;
    });
    
    // Update weekly stats
    weeklyStudyTime.textContent = `${weeklyTotal.toFixed(1)}h`;
    dailyAverage.textContent = `${(weeklyTotal / 7).toFixed(1)}h`;
    bestDay.textContent = `${bestStudyDay.day} (${bestStudyDay.hours.toFixed(1)}h)`;
    
    // Update chart
    charts.weeklyProgress.data.datasets[0].data = weeklyData.data;
    charts.weeklyProgress.update();
}

// Subject management
function addSubject(name, color, weeklyGoal) {
    const subject = {
        id: Date.now(),
        name,
        color,
        weeklyGoal,
        totalTime: 0
    };
    
    subjects.push(subject);
    renderSubjects();
    updateSubjectChart();
    saveUserPreferences();
}

function renderSubjects() {
    subjectList.innerHTML = '';
    
    subjects.forEach(subject => {
        const subjectItem = document.createElement('div');
        subjectItem.className = 'subject-item';
        
        const colorDot = document.createElement('div');
        colorDot.className = 'subject-color';
        colorDot.style.backgroundColor = subject.color;
        
        const info = document.createElement('div');
        info.className = 'subject-info';
        
        const name = document.createElement('div');
        name.className = 'subject-name';
        name.textContent = subject.name;
        
        const progress = document.createElement('div');
        progress.className = 'subject-progress';
        const weeklyHours = subject.totalTime / 60;
        progress.textContent = `${weeklyHours.toFixed(1)}h / ${subject.weeklyGoal}h this week`;
        
        info.appendChild(name);
        info.appendChild(progress);
        
        subjectItem.appendChild(colorDot);
        subjectItem.appendChild(info);
        
        subjectList.appendChild(subjectItem);
    });
}

function updateSubjectChart() {
    const data = {
        labels: subjects.map(s => s.name),
        datasets: [{
            data: subjects.map(s => s.totalTime / 60),
            backgroundColor: subjects.map(s => s.color)
        }]
    };
    
    charts.subjectDistribution.data = data;
    charts.subjectDistribution.update();
}

// Goals management
function addGoal(text) {
    const goal = {
        id: Date.now(),
        text,
        completed: false
    };
    
    goals.push(goal);
    renderGoals();
    saveUserPreferences();
}

function toggleGoal(id) {
    goals = goals.map(goal => {
        if (goal.id === id) {
            return { ...goal, completed: !goal.completed };
        }
        return goal;
    });
    
    renderGoals();
    saveUserPreferences();
}

function renderGoals() {
    goalsList.innerHTML = '';
    
    goals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('div');
        checkbox.className = 'goal-checkbox';
        checkbox.addEventListener('click', () => toggleGoal(goal.id));
        
        const text = document.createElement('div');
        text.className = 'goal-text';
        text.textContent = goal.text;
        
        goalItem.appendChild(checkbox);
        goalItem.appendChild(text);
        
        goalsList.appendChild(goalItem);
    });
}

// Activity timeline
function addActivity(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const content = document.createElement('div');
    content.className = 'activity-content';
    
    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = new Date().toLocaleTimeString();
    
    const description = document.createElement('div');
    description.className = 'activity-description';
    description.textContent = activity;
    
    content.appendChild(time);
    content.appendChild(description);
    activityItem.appendChild(content);
    
    activityTimeline.insertBefore(activityItem, activityTimeline.firstChild);
}

// Calendar management
function renderCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const calendar = document.createElement('div');
    calendar.className = 'calendar-grid';
    
    // Add day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if there are any sessions scheduled for this day
        const hasSession = scheduledSessions.some(session => {
            const sessionDate = new Date(session.date);
            return sessionDate.toDateString() === date.toDateString();
        });
        
        if (hasSession) {
            dayElement.classList.add('has-session');
        }
        
        calendar.appendChild(dayElement);
    }
    
    studyCalendar.innerHTML = '';
    studyCalendar.appendChild(calendar);
}

// Session scheduling
function scheduleSession(date, time, subject, technique, duration) {
    const session = {
        id: Date.now(),
        date: new Date(`${date}T${time}`),
        subject,
        technique,
        duration
    };
    
    scheduledSessions.push(session);
    renderScheduledSessions();
    renderCalendar();
    saveUserPreferences();
}

function renderScheduledSessions() {
    upcomingSessionsList.innerHTML = '';
    
    const now = new Date();
    const upcomingSessions = scheduledSessions
        .filter(session => session.date > now)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);
    
    upcomingSessions.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        
        const time = document.createElement('div');
        time.className = 'session-time';
        time.textContent = session.date.toLocaleString();
        
        const subject = document.createElement('div');
        subject.className = 'session-subject';
        subject.textContent = session.subject;
        
        const technique = document.createElement('div');
        technique.className = 'session-technique';
        technique.textContent = `${session.technique} - ${session.duration} minutes`;
        
        sessionItem.appendChild(time);
        sessionItem.appendChild(subject);
        sessionItem.appendChild(technique);
        
        upcomingSessionsList.appendChild(sessionItem);
    });
}

// Update focus distribution
function updateFocusDistribution() {
    const hourlyData = Array(24).fill(0);
    let totalSessions = Array(24).fill(0);
    
    statistics.sessionHistory.forEach(session => {
        const date = new Date(session.date);
        const hour = date.getHours();
        
        // Calculate focus score based on completed tasks and session duration
        const focusScore = (session.completedTasks / (session.duration / 30)) * 100;
        hourlyData[hour] += focusScore;
        totalSessions[hour]++;
    });
    
    // Calculate average focus score for each hour
    const averageData = hourlyData.map((total, index) => 
        totalSessions[index] ? total / totalSessions[index] : 0
    );
    
    // Find peak hours
    let maxFocus = Math.max(...averageData);
    let peakHourIndex = averageData.indexOf(maxFocus);
    peakHours.textContent = `${peakHourIndex}:00 - ${(peakHourIndex + 1) % 24}:00`;
    
    // Update chart
    charts.focusDistribution.data.datasets[0].data = averageData;
    charts.focusDistribution.update();
}

// Event listeners for new dashboard features
addSubjectBtn.addEventListener('click', () => {
    subjectModal.classList.remove('hidden');
});

saveSubjectBtn.addEventListener('click', () => {
    const name = document.getElementById('subjectName').value;
    const color = document.getElementById('subjectColor').value;
    const weeklyGoal = parseInt(document.getElementById('subjectGoal').value);
    
    if (name && weeklyGoal) {
        addSubject(name, color, weeklyGoal);
        subjectModal.classList.add('hidden');
        document.getElementById('subjectName').value = '';
    }
});

cancelSubjectBtn.addEventListener('click', () => {
    subjectModal.classList.add('hidden');
});

addGoalBtn.addEventListener('click', () => {
    const text = goalInput.value.trim();
    if (text) {
        addGoal(text);
        goalInput.value = '';
    }
});

goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = goalInput.value.trim();
        if (text) {
            addGoal(text);
            goalInput.value = '';
        }
    }
});

scheduleSessionBtn.addEventListener('click', () => {
    scheduleModal.classList.remove('hidden');
});

saveScheduleBtn.addEventListener('click', () => {
    const date = document.getElementById('sessionDate').value;
    const time = document.getElementById('sessionTime').value;
    const subject = document.getElementById('sessionSubject').value;
    const technique = document.getElementById('sessionTechnique').value;
    const duration = parseInt(document.getElementById('sessionDuration').value);
    
    if (date && time && subject && technique && duration) {
        scheduleSession(date, time, subject, technique, duration);
        scheduleModal.classList.add('hidden');
    }
});

cancelScheduleBtn.addEventListener('click', () => {
    scheduleModal.classList.add('hidden');
});

// Document creation handlers
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', async function() {
        let type = '';
        if (this.querySelector('i.fa-file-powerpoint')) {
            type = 'powerpoint';
        } else if (this.querySelector('i.fa-file-word')) {
            type = 'word';
        } else if (this.querySelector('i.fa-file-excel')) {
            type = 'excel';
        }

        if (type) {
            try {
                const result = await window.api.createDocument(type);
                if (result.success) {
                    showNotification(`New ${type} file created successfully!`, 'success');
                } else {
                    showNotification(result.error || 'Failed to create file', 'error');
                }
            } catch (error) {
                console.error('Error creating document:', error);
                showNotification('An error occurred while creating the file', 'error');
            }
        }
    });
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the application
init(); 