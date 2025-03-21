// YouTube API Integration with Content Filtering


// Initialize API key
async function initializeApiKey() {
    try {
        YOUTUBE_API_KEY = await window.api.getYouTubeApiKey();
        if (!YOUTUBE_API_KEY) {
            console.error('YouTube API key not found');
            throw new Error('YouTube API key not configured');
        }
    } catch (error) {
        console.error('Failed to initialize YouTube API key:', error);
        throw error;
    }
}

// Profanity and distraction lists
const profanityList = [
    'hell', 'dumb', 'stupid', 'foolish', 'noob', 'dummy',
    'idiot', 'moron', 'retard', 'crap', 'suck', 'sucker',
    'loser', 'dumbass', 'jackass', 'wtf', 'fck', 'fuk',
    'damn', 'damnit', 'piss', 'pissed', 'nigga', 'nigger',
    'dick', 'asshole', 'faggot', 'vagina', 'fuck', 'chutiya',
    'behenchod'
];

const distractionsList = [
    // Entertainment & Pop Culture
    'best moments', 'top 10', 'you won\'t believe', 'must watch', 'gone wrong',
    'epic fail', 'watch till the end', 'insane reaction', 'shocking truth',
    'breaking news', 'drama alert', 'exposed', 'caught on camera', 'leaked footage',
    'behind the scenes', 'celebrity gossip', 'what really happened', 'tea spill',
    'storytime', 'the truth about', 'cancelled', 'controversy', 'scandal',
    'relationship drama', 'breakup', 'dating', 'relationship goals',

    // Gaming & Streaming
    'game', 'gaming', 'gameplay', 'gamer', 'playthrough', 'walkthrough', 'stream',
    'minecraft', 'fortnite', 'roblox', 'pokemon', 'xbox', 'playstation', 'nintendo',
    'steam', 'discord', 'twitch', 'ps4', 'ps5', 'xbox series x', 'gaming setup',
    'stream setup', 'gaming chair', 'gaming pc', 'esports', 'speedrun', 'lets play',
    'among us', 'call of duty', 'cod', 'pubg', 'apex legends', 'valorant',
    'league of legends', 'dota', 'gta', 'grand theft auto', 'rainbow six',
    'overwatch', 'world of warcraft', 'wow', 'minecraft mod', 'gaming highlights',
    'pro gamer', 'gaming montage', 'epic gaming moments', 'rage quit', 'clutch plays',
    'gaming fails', 'stream highlights', 'streamer', 'gaming challenge',

    // Sports & Athletics
    'football highlights', 'basketball highlights', 'soccer skills', 'best plays',
    'sports fails', 'trick shots', 'extreme sports', 'skateboarding tricks',
    'parkour', 'freestyle', 'workout routine', 'gym motivation', 'fitness challenge',
    'sports betting', 'fantasy sports', 'sports predictions', 'match highlights',
    'game recap', 'sports commentary', 'sports debate', 'nba', 'nfl', 'mlb', 'nhl',
    'ufc', 'mma', 'boxing', 'wrestling', 'wwe', 'cricket', 'tennis', 'golf',
    'formula 1', 'nascar', 'racing', 'olympics', 'world cup', 'champions league',
    'premier league', 'la liga', 'bundesliga', 'serie a', 'sports news',

    // Social Media & Internet Culture
    'tiktok', 'instagram', 'reels', 'shorts', 'viral', 'trending', 'challenge',
    'reaction', 'react', 'unboxing', 'haul', 'snapchat', 'facebook', 'twitter',
    'social media', 'influencer', 'youtuber', 'follow me', 'like and subscribe',
    'hit the bell', 'notification squad', 'road to', 'subscribers', 'followers',
    'viral trend', 'internet famous', 'collab', 'collaboration', 'social experiment',
    'prank', 'pranked', 'trolling', 'clickbait', 'life hack', 'diy fail',
    'satisfying', 'asmr', 'mukbang', 'eating show', 'q&a', 'room tour',
    'morning routine', 'night routine', 'transformation', 'glow up',

    // Movies & TV Shows
    'movie trailer', 'tv show', 'series', 'netflix', 'amazon prime', 'disney plus',
    'hbo max', 'hulu', 'spoiler', 'review', 'reaction', 'breakdown', 'explained',
    'theory', 'ending explained', 'post credit scene', 'easter eggs', 'movie recap',
    'binge watch', 'new episode', 'season finale', 'premiere', 'behind the scenes',
    'bloopers', 'deleted scenes', 'cast interview', 'movie mistakes', 'fan theory',
    'movie facts', 'top movies', 'best shows', 'worst movies', 'movie ranking',

    // Music & Entertainment
    'music video', 'lyrics', 'song cover', 'dance cover', 'choreography',
    'concert footage', 'live performance', 'band practice', 'rapper', 'singer',
    'pop music', 'hip hop', 'rap', 'rock', 'metal', 'jazz', 'playlist',
    'music mix', 'dj set', 'remix', 'mashup', 'karaoke', 'music reaction',
    'album review', 'song reaction', 'first time hearing', 'top hits', 'new release',
    'music news', 'billboard hot', 'charts', 'grammy', 'awards', 'festival',

    // Comedy & Humor
    'funny', 'comedy', 'joke', 'meme', 'parody', 'spoof', 'stand up',
    'prank call', 'blooper', 'fail compilation', 'try not to laugh',
    'funny moments', 'comedy sketch', 'roast', 'satire', 'improv',
    'comedian', 'humor', 'skit', 'vine compilation', 'funny animals',
    'comedy show', 'sitcom', 'bloopers', 'outtakes', 'gag reel',

    // Lifestyle & Vlogging
    'vlog', 'daily vlog', 'lifestyle', 'day in my life', 'follow me around',
    'what i eat', 'food diary', 'shopping spree', 'haul video', 'outfit of the day',
    'ootd', 'get ready with me', 'grwm', 'makeup tutorial', 'skincare routine',
    'fashion haul', 'try on haul', 'room makeover', 'house tour', 'apartment tour',
    'cleaning routine', 'productivity vlog', 'weekend vlog', 'travel vlog',
    'vacation vlog', 'moving vlog', 'transformation video', 'morning routine',
    'night routine', 'what i eat in a day', 'cooking vlog', 'baking video',

    // Reality TV & Drama
    'reality show', 'reality tv', 'drama', 'reality star', 'celebrity news',
    'gossip', 'tea', 'exposed', 'receipts', 'clap back', 'shade', 'beef',
    'feud', 'drama update', 'reality recap', 'reality highlights', 'reunion',
    'confrontation', 'fight', 'argument', 'reality moment', 'reality star drama',
    'celebrity drama', 'reality tv news', 'reality show recap'
];

const educationalContexts = [
    // General Academic Terms
    'what is', 'how does', 'explain', 'definition', 'concept', 'introduction to',
    'basics of', 'fundamentals of', 'principles of', 'guide to', 'tutorial',
    // ... (keeping the existing educational contexts)
];

class YouTubeManager {
    constructor() {
        this.playlists = JSON.parse(localStorage.getItem('youtube_playlists')) || [];
        this.savedVideos = JSON.parse(localStorage.getItem('saved_videos')) || [];
        this.currentCategory = 'All';
        this.nextPageToken = '';
        this.defaultSearchTerms = [
            'introduction to mathematics',
            'basic physics concepts',
            'learn programming basics',
            'chemistry fundamentals',
            'biology for beginners',
            'history explained',
            'study skills and techniques',
            'scientific method introduction'
        ];
        
        this.initialize();
    }

    async initialize() {
        try {
            await initializeApiKey();
            this.initEventListeners();
            await this.loadRecommendedVideos();
        } catch (error) {
            console.error('Failed to initialize YouTube manager:', error);
            this.showNotification('Failed to initialize YouTube features. Please check your API key.', 'error');
        }
    }

    initEventListeners() {
        const searchInput = document.querySelector('.video-search input');
        const searchButton = document.querySelector('.search-button');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
        }

        // Initialize other event listeners
        this.initFilterChips();
        this.initPlaylistControls();
        this.initScrollListener();
    }

    initFilterChips() {
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentCategory = chip.textContent;
                this.loadRecommendedVideos();
            });
        });
    }

    initPlaylistControls() {
        const newPlaylistBtn = document.querySelector('.new-playlist-btn');
        if (newPlaylistBtn) {
            newPlaylistBtn.addEventListener('click', () => {
                this.createNewPlaylist();
            });
        }

        // Initialize playlist item controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-playlist')) {
                const playlistId = e.target.closest('.playlist-item').dataset.id;
                this.deletePlaylist(playlistId);
            } else if (e.target.classList.contains('view-playlist')) {
                const playlistId = e.target.closest('.playlist-item').dataset.id;
                this.viewPlaylist(playlistId);
            }
        });
    }

    initScrollListener() {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;

        let isLoading = false;
        window.addEventListener('scroll', () => {
            if (isLoading) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                isLoading = true;
                this.loadMoreVideos().finally(() => {
                    isLoading = false;
                });
            }
        });
    }

    containsProfanity(text) {
        const normalizedText = text.toLowerCase()
            .replace(/[*@$#!]/g, '')
            .replace(/[0-9]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const words = normalizedText.split(' ');
        
        for (const word of words) {
            if (profanityList.includes(word)) return true;
            
            for (const badWord of profanityList) {
                if (word.includes(badWord)) return true;
                
                const decodedBadWord = badWord
                    .replace(/[*@$#!]/g, '')
                    .replace(/[0-9]/g, '');
                
                if (word.includes(decodedBadWord)) return true;
            }
        }
        return false;
    }

    containsDistractions(text) {
        const normalizedText = text.toLowerCase().trim();
        const words = normalizedText.split(' ');
        
        const hasEducationalContext = educationalContexts.some(context => 
            normalizedText.includes(context)
        );

        if (hasEducationalContext) return false;

        const hasDistractions = distractionsList.some(distraction => 
            words.includes(distraction) || 
            normalizedText.includes(distraction)
        );

        return hasDistractions;
    }

    async handleSearch(query) {
        if (!query.trim()) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }

        if (this.containsProfanity(query)) {
            this.showSearchWarning('inappropriate');
            return;
        }

        if (this.containsDistractions(query)) {
            this.showSearchWarning('distraction');
            return;
        }

        await this.searchVideos(query);
    }

    showSearchWarning(type) {
        const resultsContainer = document.querySelector('.video-grid');
        if (!resultsContainer) return;

        if (type === 'inappropriate') {
            resultsContainer.innerHTML = `
                <div class="inappropriate-warning">
                    <h3>⚠️ Inappropriate Language Detected</h3>
                    <p>Your search contains inappropriate language that is not allowed.</p>
                    <p>Please keep searches educational and professional.</p>
                    <p>Try rephrasing your search using appropriate terms.</p>
                </div>`;
        } else if (type === 'distraction') {
            resultsContainer.innerHTML = `
                <div class="distraction-warning">
                    <h3>📚 Focus on Learning</h3>
                    <p>It seems you're looking for entertainment content.</p>
                    <p>Remember: This platform is designed for educational purposes.</p>
                    <p>Why not try searching for:</p>
                    <ul>
                        <li>Academic subjects (Math, Science, History)</li>
                        <li>Tutorial videos for skills development</li>
                        <li>Educational documentaries</li>
                        <li>Study techniques and learning resources</li>
                    </ul>
                    <p class="motivation-text">Make the most of your time by focusing on educational content! 📖✨</p>
                </div>`;
        }
    }

    async searchVideos(query) {
        if (!YOUTUBE_API_KEY) {
            await initializeApiKey();
        }
        
        try {
            const data = await window.api.searchYouTube(query);
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            if (data.items) {
                this.displaySearchResults(data.items);
                this.nextPageToken = data.nextPageToken || '';
            }
        } catch (error) {
            console.error('Error searching videos:', error);
            this.showNotification('Error searching videos: ' + error.message, 'error');
        }
    }

    async loadRecommendedVideos() {
        if (!YOUTUBE_API_KEY) {
            await initializeApiKey();
        }
        
        const searchQuery = this.currentCategory === 'All' ? 'educational tutorials' : this.currentCategory + ' educational tutorials';
        
        try {
            const data = await window.api.searchYouTube(searchQuery);
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            if (data.items) {
                this.displaySearchResults(data.items);
                this.nextPageToken = data.nextPageToken || '';
            }
        } catch (error) {
            console.error('Error loading recommended videos:', error);
            this.showNotification('Error loading recommended videos: ' + error.message, 'error');
        }
    }

    async loadMoreVideos() {
        if (!this.nextPageToken || !YOUTUBE_API_KEY) return;
        
        const searchQuery = this.currentCategory === 'All' ? 'educational tutorials' : this.currentCategory + ' educational tutorials';
        
        try {
            const data = await window.api.searchYouTube(searchQuery + '&pageToken=' + this.nextPageToken);
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            if (data.items) {
                this.appendSearchResults(data.items);
                this.nextPageToken = data.nextPageToken || '';
            }
        } catch (error) {
            console.error('Error loading more videos:', error);
            this.showNotification('Error loading more videos: ' + error.message, 'error');
        }
    }

    displaySearchResults(videos) {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;
        
        videoGrid.innerHTML = '';
        this.appendSearchResults(videos);
    }

    appendSearchResults(videos) {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;
        
        videos.forEach(video => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const thumbnail = video.snippet.thumbnails.high.url;
            const channelTitle = video.snippet.channelTitle;
            
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${thumbnail}" alt="${title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h4>${title}</h4>
                    <p>${channelTitle}</p>
                    <div class="video-actions">
                        <button class="save-to-playlist" data-video-id="${videoId}" data-title="${title}" data-thumbnail="${thumbnail}" data-channel="${channelTitle}">
                            <i class="fas fa-plus"></i> Add to Playlist
                        </button>
                    </div>
                </div>
            `;
            
            videoGrid.appendChild(videoCard);
            
            // Add event listener to play button
            const playButton = videoCard.querySelector('.video-thumbnail');
            playButton.addEventListener('click', () => {
                this.openVideoPlayer(videoId, title);
            });
            
            // Add event listener to save button
            const saveButton = videoCard.querySelector('.save-to-playlist');
            saveButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPlaylistSelector(videoId, title, thumbnail, channelTitle);
            });
        });
        
        // Add 'Load More' button if necessary
        if (this.nextPageToken) {
            const loadMoreBtn = document.createElement('div');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.innerHTML = `<button>Load More</button>`;
            videoGrid.appendChild(loadMoreBtn);
            
            loadMoreBtn.querySelector('button').addEventListener('click', () => {
                this.loadMoreVideos();
            });
        }
    }

    openVideoPlayer(videoId, title) {
        const videoModal = document.createElement('div');
        videoModal.className = 'video-player-modal';
        videoModal.innerHTML = `
            <div class="video-player-container">
                <div class="video-player-header">
                    <h3>${title}</h3>
                    <button class="close-video-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="video-player">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" 
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(videoModal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        const closeBtn = videoModal.querySelector('.close-video-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(videoModal);
            document.body.style.overflow = '';
        });
    }

    showPlaylistSelector(videoId, title, thumbnail, channelTitle) {
        if (this.playlists.length === 0) {
            this.createNewPlaylist(videoId, title, thumbnail, channelTitle);
            return;
        }
        
        const playlistModal = document.createElement('div');
        playlistModal.className = 'playlist-selector-modal';
        
        let playlistOptions = '';
        this.playlists.forEach(playlist => {
            playlistOptions += `<div class="playlist-option" data-id="${playlist.id}">${playlist.name}</div>`;
        });
        
        playlistModal.innerHTML = `
            <div class="playlist-selector-container">
                <div class="playlist-selector-header">
                    <h3>Add to Playlist</h3>
                    <button class="close-playlist-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="playlist-options">
                    ${playlistOptions}
                    <div class="playlist-option create-new">Create New Playlist</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(playlistModal);
        
        // Close button
        const closeBtn = playlistModal.querySelector('.close-playlist-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(playlistModal);
        });
        
        // Playlist selection
        const playlistOptionElements = playlistModal.querySelectorAll('.playlist-option:not(.create-new)');
        playlistOptionElements.forEach(option => {
            option.addEventListener('click', () => {
                const playlistId = option.getAttribute('data-id');
                this.addVideoToPlaylist(playlistId, videoId, title, thumbnail, channelTitle);
                document.body.removeChild(playlistModal);
            });
        });
        
        // Create new playlist option
        const createNewOption = playlistModal.querySelector('.create-new');
        createNewOption.addEventListener('click', () => {
            document.body.removeChild(playlistModal);
            this.createNewPlaylist(videoId, title, thumbnail, channelTitle);
        });
    }

    createNewPlaylist(videoId, title, thumbnail, channelTitle) {
        const playlistModal = document.createElement('div');
        playlistModal.className = 'new-playlist-modal';
        
        playlistModal.innerHTML = `
            <div class="new-playlist-container">
                <div class="new-playlist-header">
                    <h3>Create New Playlist</h3>
                    <button class="close-new-playlist-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="new-playlist-form">
                    <input type="text" placeholder="Playlist Name" id="playlistNameInput">
                    <textarea placeholder="Description (optional)" id="playlistDescInput"></textarea>
                    <button id="createPlaylistBtn">Create Playlist</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(playlistModal);
        
        // Close button
        const closeBtn = playlistModal.querySelector('.close-new-playlist-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(playlistModal);
        });
        
        // Create playlist button
        const createBtn = playlistModal.querySelector('#createPlaylistBtn');
        const nameInput = playlistModal.querySelector('#playlistNameInput');
        const descInput = playlistModal.querySelector('#playlistDescInput');
        
        createBtn.addEventListener('click', () => {
            const playlistName = nameInput.value.trim();
            const playlistDesc = descInput.value.trim();
            
            if (playlistName) {
                const newPlaylist = {
                    id: Date.now().toString(),
                    name: playlistName,
                    description: playlistDesc,
                    videos: []
                };
                
                this.playlists.push(newPlaylist);
                this.savePlaylistsToLocalStorage();
                this.renderPlaylists();
                
                if (videoId) {
                    this.addVideoToPlaylist(newPlaylist.id, videoId, title, thumbnail, channelTitle);
                }
                
                document.body.removeChild(playlistModal);
                this.showNotification('Playlist created successfully!', 'success');
            } else {
                alert('Please enter a playlist name');
            }
        });
    }

    addVideoToPlaylist(playlistId, videoId, title, thumbnail, channelTitle) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;
        
        // Check if video already exists in the playlist
        if (playlist.videos.some(v => v.videoId === videoId)) {
            this.showNotification('Video already in this playlist', 'info');
            return;
        }
        
        // Add video to playlist
        playlist.videos.push({
            videoId,
            title,
            thumbnail,
            channelTitle,
            addedAt: new Date().toISOString()
        });
        
        this.savePlaylistsToLocalStorage();
        this.renderPlaylists();
        this.showNotification('Video added to playlist', 'success');
    }

    removeVideoFromPlaylist(playlistId, videoId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;
        
        playlist.videos = playlist.videos.filter(v => v.videoId !== videoId);
        this.savePlaylistsToLocalStorage();
        this.renderPlaylists();
        this.showNotification('Video removed from playlist', 'info');
    }

    deletePlaylist(playlistId) {
        if (confirm('Are you sure you want to delete this playlist?')) {
            this.playlists = this.playlists.filter(p => p.id !== playlistId);
            this.savePlaylistsToLocalStorage();
            this.renderPlaylists();
            this.showNotification('Playlist deleted', 'info');
        }
    }

    savePlaylistsToLocalStorage() {
        localStorage.setItem('youtube_playlists', JSON.stringify(this.playlists));
    }

    renderPlaylists() {
        const playlistsContainer = document.querySelector('.playlists-container');
        if (!playlistsContainer) return;
        
        playlistsContainer.innerHTML = '';
        
        if (this.playlists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="empty-playlists">
                    <p>You haven't created any playlists yet.</p>
                    <button class="create-first-playlist">Create Your First Playlist</button>
                </div>
            `;
            
            const createFirstBtn = playlistsContainer.querySelector('.create-first-playlist');
            createFirstBtn.addEventListener('click', () => {
                this.createNewPlaylist();
            });
            
            return;
        }
        
        this.playlists.forEach(playlist => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            
            // Get thumbnail from first video or use placeholder
            const thumbnailUrl = playlist.videos.length > 0 
                ? playlist.videos[0].thumbnail 
                : 'assets/playlist-placeholder.png';
            
            playlistCard.innerHTML = `
                <div class="playlist-thumbnail">
                    <img src="${thumbnailUrl}" alt="${playlist.name}">
                    <div class="playlist-count">${playlist.videos.length} videos</div>
                </div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>${playlist.description || 'No description'}</p>
                    <div class="playlist-actions">
                        <button class="view-playlist-btn" data-id="${playlist.id}">
                            <i class="fas fa-play"></i> View
                        </button>
                        <button class="delete-playlist-btn" data-id="${playlist.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            playlistsContainer.appendChild(playlistCard);
            
            // View playlist button
            const viewBtn = playlistCard.querySelector('.view-playlist-btn');
            viewBtn.addEventListener('click', () => {
                this.viewPlaylist(playlist.id);
            });
            
            // Delete playlist button
            const deleteBtn = playlistCard.querySelector('.delete-playlist-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePlaylist(playlist.id);
            });
        });
    }

    viewPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;
        
        const playlistModal = document.createElement('div');
        playlistModal.className = 'playlist-view-modal';
        
        let videosHtml = '';
        if (playlist.videos.length === 0) {
            videosHtml = `<p class="empty-playlist-msg">This playlist has no videos yet.</p>`;
        } else {
            videosHtml = `<div class="playlist-videos">`;
            
            playlist.videos.forEach(video => {
                videosHtml += `
                    <div class="playlist-video-item">
                        <div class="playlist-video-thumbnail">
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="playlist-video-info">
                            <h4>${video.title}</h4>
                            <p>${video.channelTitle}</p>
                            <button class="remove-from-playlist" data-video-id="${video.videoId}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            });
            
            videosHtml += `</div>`;
        }
        
        playlistModal.innerHTML = `
            <div class="playlist-view-container">
                <div class="playlist-view-header">
                    <h3>${playlist.name}</h3>
                    <button class="close-playlist-view-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="playlist-description">
                    <p>${playlist.description || 'No description'}</p>
                </div>
                ${videosHtml}
            </div>
        `;
        
        document.body.appendChild(playlistModal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Close button
        const closeBtn = playlistModal.querySelector('.close-playlist-view-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(playlistModal);
            document.body.style.overflow = '';
        });
        
        // Play video buttons
        const playButtons = playlistModal.querySelectorAll('.playlist-video-thumbnail');
        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const video = playlist.videos[index];
                this.openVideoPlayer(video.videoId, video.title);
            });
        });
        
        // Remove video buttons
        const removeButtons = playlistModal.querySelectorAll('.remove-from-playlist');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoId = btn.getAttribute('data-video-id');
                this.removeVideoFromPlaylist(playlistId, videoId);
                document.body.removeChild(playlistModal);
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
        });
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the YouTube manager
document.addEventListener('DOMContentLoaded', () => {
    window.youtubeManager = new YouTubeManager();
}); 