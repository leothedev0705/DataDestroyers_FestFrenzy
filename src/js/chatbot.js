document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const toggleChatButton = document.querySelector('.chat-btn');
    const closeButton = document.getElementById('closeChat');
    const chatWidget = document.getElementById('chatWidget');
    const chatBody = document.getElementById('chatBody');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const timerContainer = document.getElementById('timerContainer');
    const timerElement = document.getElementById('timer');
    const chatFooter = document.querySelector('.chat-footer');

    // Chat state
    let warningCount = 0;
    let isChatDisabled = false;
    let timeoutId = null;
    let isUsingAPI = false;
    
    // API configuration
    let apiKey = 'AIzaSyBWQQwVzZeR49T3l48WSxgjw3LDEkosHDQ';
    const apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // Try to load API key from environment or localStorage
    function loadApiKey() {
        // First try to check if there's a variable from the environment (set in main.js from .env)
        if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
            apiKey = process.env.GEMINI_API_KEY;
            console.log('API key loaded from environment variables');
        } else {
            // Fallback to localStorage if available
            apiKey = localStorage.getItem('chatbot_api_key') || '';
            console.log('API key loaded from localStorage');
        }
        
        checkApiStatus();
    }
    
    // Load API key when the page loads
    loadApiKey();
    
    // List of educational topics (can be expanded)
    const educationalTopics = [
        "computer", "engineering", "science", "math", "history", 
        "geography", "biology", "physics", "chemistry", "literature",
        "programming", "coding", "algorithm", "data", "network",
        "software", "hardware", "education", "learning", "study",
        "school", "college", "university", "course", "degree",
        "exam", "test", "assignment", "homework", "research",
        "project", "technology", "computation", "architecture", "database",
        "web development", "cloud", "security", "artificial intelligence", "machine learning"
    ];
    
    // Non-educational query indicators
    const nonEducationalIndicators = [
        "joke", "funny", "laugh", "entertain", "sing", "dance", "song", 
        "poem", "poetry", "story", "game", "play", "fun", "prank",
        "hello", "hi", "hey", "how are you", "your name", "who are you",
        "hungry", "food", "eat", "drink", "personal", "yourself", "feeling",
        "weather", "movie", "music", "sport", "date", "time", "day"
    ];

    // Computer engineering specific knowledge
    const computerEngineeringInfo = {
        "computer engineering": "Computer Engineering is a discipline that integrates electrical engineering and computer science to develop computer hardware and software. It involves the design of computer systems (hardware and software) and the development of principles for the creation of integrated computing systems.",
        "programming languages": "Programming languages are formal languages used to implement algorithms and create software. Popular languages include Python, Java, C++, JavaScript, and many more.",
        "data structures": "Data structures are specialized formats for organizing and storing data. Examples include arrays, linked lists, stacks, queues, trees, and graphs.",
        "algorithms": "Algorithms are step-by-step procedures for calculations, data processing, and automated reasoning. They are fundamental to computer programming and problem-solving.",
        "operating systems": "Operating systems are software that manage computer hardware and software resources and provide common services for computer programs. Examples include Windows, macOS, Linux, and Android.",
        "computer architecture": "Computer architecture is the conceptual design and operational structure of a computer system. It includes the CPU design, memory organization, and I/O mechanisms.",
        "networking": "Computer networking refers to interconnected computing devices that can exchange data. Topics include protocols, network topology, routing, switching, and internet architecture.",
        "database systems": "Database systems are organized collections of data. Topics include database design, SQL, NoSQL, data modeling, and database management systems.",
        "software engineering": "Software engineering is the application of engineering principles to software development. It includes requirements analysis, design, implementation, testing, and maintenance.",
        "artificial intelligence": "AI is the simulation of human intelligence in machines. It includes machine learning, natural language processing, computer vision, and expert systems.",
        "cybersecurity": "Cybersecurity involves protecting systems, networks, and programs from digital attacks. Topics include encryption, authentication, access control, and vulnerability assessment."
    };

    // Check API status and update UI
    function checkApiStatus() {
        if (apiKey && apiKey.length > 10 && apiKey !== 'your_gemini_api_key_here') {
            isUsingAPI = true;
            addMessageToChat("Gemini API connection active. You can ask more advanced educational questions.", 'assistant');
        } else {
            isUsingAPI = false;
        }
    }

    // Toggle chat widget visibility
    toggleChatButton.addEventListener('click', () => {
        chatWidget.style.display = chatWidget.style.display === 'none' || chatWidget.style.display === '' ? 'flex' : 'none';
    });

    // Close chat widget
    closeButton.addEventListener('click', () => {
        chatWidget.style.display = 'none';
    });

    // Add API key configuration option
    addApiKeyOption();

    // Add API key configuration to chat interface
    function addApiKeyOption() {
        // Create settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        settingsBtn.className = 'settings-btn';
        settingsBtn.title = 'Configure API';
        
        // Add it to chat header
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.insertBefore(settingsBtn, closeButton);
        
        // Add event listener
        settingsBtn.addEventListener('click', () => {
            // Create modal for API key input
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Configure AI API</h3>
                    <div class="modal-form">
                        <div class="form-group">
                            <label for="apiKeyInput">API Key (Gemini)</label>
                            <input type="password" id="apiKeyInput" value="${apiKey}" placeholder="Enter your Gemini API key">
                        </div>
                        <p class="api-note">Using an API key enables advanced AI responses for educational queries.</p>
                        <p class="api-note">Your API key is currently ${isUsingAPI ? '<span style="color: green">active</span>' : '<span style="color: red">not set or invalid</span>'}.</p>
                        <p class="api-note">For better security, you can also set the API key in the .env file.</p>
                    </div>
                    <div class="modal-actions">
                        <button id="cancelApiBtn" class="secondary-btn">Cancel</button>
                        <button id="saveApiBtn" class="primary-btn">Save API Key</button>
                    </div>
                </div>
            `;
            
            // Add to document
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('visible');
            }, 10);
            
            // Event listeners for modal buttons
            document.getElementById('cancelApiBtn').addEventListener('click', () => {
                modal.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
            
            document.getElementById('saveApiBtn').addEventListener('click', () => {
                const newApiKey = document.getElementById('apiKeyInput').value.trim();
                
                // Save API key
                apiKey = newApiKey;
                localStorage.setItem('chatbot_api_key', apiKey);
                
                // Check API status
                checkApiStatus();
                
                // Close modal
                modal.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
        });
    }

    // Send message function (triggered by button or Enter key)
    function sendMessage() {
        if (isChatDisabled) return;
        
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        userInput.value = '';
        
        // Process the message and respond
        processMessage(message);
    }

    // Add message to chat UI
    function addMessageToChat(message, sender, isWarning = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}${isWarning ? ' warning' : ''}`;
        
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        messageElement.appendChild(paragraph);
        
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Process user message
    function processMessage(message) {
        const lowercaseMessage = message.toLowerCase();
        
        // If using API and message is educational, use API for response
        if (isUsingAPI && isEducational(lowercaseMessage)) {
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message assistant typing';
            typingIndicator.innerHTML = '<p>Typing...</p>';
            chatBody.appendChild(typingIndicator);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Use API for response
            fetchApiResponse(message)
                .then(response => {
                    // Remove typing indicator
                    chatBody.removeChild(typingIndicator);
                    
                    // Add API response
                    addMessageToChat(response, 'assistant');
                })
                .catch(error => {
                    // Remove typing indicator
                    chatBody.removeChild(typingIndicator);
                    
                    // Add error message
                    addMessageToChat("Sorry, I couldn't connect to the Gemini AI service. Using built-in responses instead.", 'assistant', true);
                    
                    // Fallback to rule-based response
                    setTimeout(() => {
                        const response = generateEducationalResponse(lowercaseMessage);
                        addMessageToChat(response, 'assistant');
                    }, 500);
                });
        } 
        // Check if message is educational
        else if (isEducational(lowercaseMessage)) {
            // Provide educational response using built-in system
            setTimeout(() => {
                const response = generateEducationalResponse(lowercaseMessage);
                addMessageToChat(response, 'assistant');
            }, 500);
        } else {
            // Non-educational message - give warning
            warningCount++;
            
            if (warningCount <= 2) {
                setTimeout(() => {
                    addMessageToChat(`Warning ${warningCount}/2: Please ask educational questions only. Further non-educational queries will result in a timeout.`, 'assistant', true);
                }, 500);
            }
            
            // If warnings exceeded, disable chat
            if (warningCount > 2) {
                disableChat();
            }
        }
    }

    // Fetch response from API
    async function fetchApiResponse(message) {
        try {
            // Build URL with API key
            const url = `${apiEndpoint}?key=${apiKey}`;
            
            // Make request to Gemini API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: "You are an educational assistant focused on providing accurate, helpful information about academic topics. Only answer educational questions, and keep responses concise and informative."
                                }
                            ]
                        },
                        {
                            role: "user", 
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Extract text from Gemini API response
            if (data.candidates && data.candidates.length > 0 && 
                data.candidates[0].content && data.candidates[0].content.parts && 
                data.candidates[0].content.parts.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Check if message is educational
    function isEducational(message) {
        // Check for non-educational indicators
        for (const indicator of nonEducationalIndicators) {
            if (message.includes(indicator)) {
                return false;
            }
        }
        
        // Check for educational topics
        for (const topic of educationalTopics) {
            if (message.includes(topic)) {
                return true;
            }
        }
        
        // If using API, give benefit of doubt for queries that don't match patterns
        if (isUsingAPI) {
            return true;
        }
        
        // Default to treating as non-educational if no educational topics found
        return false;
    }

    // Generate response based on user query
    function generateEducationalResponse(message) {
        // Check for computer engineering specific knowledge
        for (const [topic, info] of Object.entries(computerEngineeringInfo)) {
            if (message.includes(topic)) {
                return info;
            }
        }
        
        // Generic educational responses
        if (message.includes("computer engineering")) {
            return "Computer Engineering combines electrical engineering and computer science to create hardware and software systems. It's a diverse field covering hardware design, software development, and systems integration.";
        } else if (message.includes("programming")) {
            return "Programming is the process of creating instructions for computers to follow. It involves using programming languages to write code that performs specific tasks.";
        } else if (message.includes("data structure")) {
            return "Data structures are specialized formats for organizing, processing, and storing data. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs.";
        } else if (message.includes("algorithm")) {
            return "Algorithms are step-by-step procedures for solving problems or performing tasks. They are the foundation of computer programming and problem-solving in computer science.";
        } else {
            return "That's an interesting educational question. Could you provide more details so I can give you a more specific answer?";
        }
    }

    // Disable chat for timeout period
    function disableChat() {
        isChatDisabled = true;
        chatFooter.classList.add('disabled');
        timerContainer.style.display = 'block';
        
        let timeLeft = 5 * 60; // 5 minutes in seconds
        
        function updateTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (timeLeft <= 0) {
                enableChat();
            } else {
                timeLeft--;
                timeoutId = setTimeout(updateTimer, 1000);
            }
        }
        
        updateTimer();
        
        addMessageToChat("You've exceeded the warning limit. Chat is disabled for 5 minutes.", 'assistant', true);
    }

    // Re-enable chat after timeout
    function enableChat() {
        isChatDisabled = false;
        warningCount = 0;
        chatFooter.classList.remove('disabled');
        timerContainer.style.display = 'none';
        clearTimeout(timeoutId);
        
        addMessageToChat("Chat has been re-enabled. Remember to ask educational questions only.", 'assistant');
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 