// DOM Elements
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const roleSwitch = document.getElementById('roleSwitch');
const logoutBtn = document.getElementById('logoutBtn');
const videoGrid = document.getElementById('videoGrid');
const commentList = document.getElementById('commentList');
const uploadBtn = document.getElementById('uploadVideoBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.querySelector('.close-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const uploadForm = document.getElementById('uploadForm');
const successNotification = document.getElementById('successNotification');
const confirmModal = document.getElementById('confirmModal');
const confirmCancel = document.getElementById('confirmCancel');
const refreshCommentsBtn = document.getElementById('refreshComments');
const analyticsFilter = document.getElementById('analyticsFilter');
const totalViewsElement = document.getElementById('totalViews');
const totalSubscribersElement = document.getElementById('totalSubscribers');
const engagementRateElement = document.getElementById('engagementRate');

// Chart Instance
let performanceChart = null;

// Mock Data
let videos = [
    {
        id: 1,
        title: "Beginner's Guide to Pottery",
        views: 2450,
        likes: 189,
        comments: 24,
        thumbnail: "https://picsum.photos/300/180?random=1",
        uploaded: "2023-06-10",
        watchTime: 125
    },
    {
        id: 2,
        title: "Modern Home Decor Ideas",
        views: 3789,
        likes: 302,
        comments: 45,
        thumbnail: "https://picsum.photos/300/180?random=2",
        uploaded: "2023-06-12",
        watchTime: 210
    },
    {
        id: 3,
        title: "DIY Woodworking Projects",
        views: 1892,
        likes: 145,
        comments: 18,
        thumbnail: "https://picsum.photos/300/180?random=3",
        uploaded: "2023-06-15",
        watchTime: 95
    }
];

let comments = [
    {
        id: 1,
        author: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Amazing tutorial! Learned so much 💖",
        video: "Beginner's Guide to Pottery",
        timestamp: "2 hours ago"
    },
    {
        id: 2,
        author: "MikeChenDesigns",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "When will part 2 be available? I can't wait to see more of your content!",
        video: "Modern Home Decor Ideas",
        timestamp: "5 hours ago"
    },
    {
        id: 3,
        author: "CreativeMind",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        content: "Your techniques helped me complete my first project successfully. Thank you!",
        video: "DIY Woodworking Projects",
        timestamp: "1 day ago"
    }
];

// Initialize Dashboard
function initDashboard() {
    renderVideos();
    renderComments();
    updateStats();
    initChart();
    
    // Set active section based on URL hash or default
    const hash = window.location.hash.substring(1);
    showSection(hash || 'home');
}

// Sidebar toggle
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        if (section) {
            showSection(section);
            // Update URL without reload
            window.history.pushState(null, null, `#${section}`);
        }
    });
});

// Show section
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        link.classList.toggle('active', linkSection === sectionId);
        
        // Update breadcrumb
        if (linkSection === sectionId && linkSection) {
            document.querySelector('.breadcrumb').textContent = link.querySelector('span').textContent;
        }
    });
}

// Render Videos with enhanced UI
function renderVideos() {
    videoGrid.innerHTML = videos.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="thumbnail-overlay">
                    <span><i class="fas fa-eye"></i> ${video.views.toLocaleString()}</span>
                    <span><i class="fas fa-heart"></i> ${video.likes.toLocaleString()}</span>
                </div>
                <div class="video-actions">
                    <button class="video-action-btn edit-video" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="video-action-btn delete-video" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="video-details">
                <h3>${video.title}</h3>
                <div class="video-stats">
                    <span><i class="fas fa-comment"></i> ${video.comments}</span>
                    <span><i class="fas fa-clock"></i> ${video.watchTime} min</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoId = parseInt(btn.closest('.video-card').dataset.id);
            editVideo(videoId);
        });
    });
    
    document.querySelectorAll('.delete-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoId = parseInt(btn.closest('.video-card').dataset.id);
            showConfirmModal(
                "Delete Video", 
                "Are you sure you want to delete this video? This action cannot be undone.",
                () => deleteVideo(videoId)
            );
        });
    });
    
    // Add click event to video cards
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = parseInt(card.dataset.id);
            viewVideoDetails(videoId);
        });
    });
}

// Render Comments with enhanced UI
function renderComments() {
    commentList.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-author">
                <img src="${comment.avatar}" alt="${comment.author}">
                ${comment.author}
            </div>
            <div class="comment-content">
                <p>${comment.content}</p>
                <small>On: ${comment.video} • ${comment.timestamp}</small>
            </div>
            <div class="comment-actions">
                <button class="btn reply-comment" title="Reply"><i class="fas fa-reply"></i></button>
                <button class="btn text-danger delete-comment" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to comment buttons
    document.querySelectorAll('.reply-comment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const commentId = parseInt(btn.closest('.comment-item').dataset.id);
            replyToComment(commentId);
        });
    });
    
    document.querySelectorAll('.delete-comment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const commentId = parseInt(btn.closest('.comment-item').dataset.id);
            showConfirmModal(
                "Delete Comment", 
                "Are you sure you want to delete this comment?",
                () => deleteComment(commentId)
            );
        });
    });
}

// Update Stats with animations
function updateStats() {
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const engagementRate = ((totalViews / 10000) * 100).toFixed(1);
    
    // Animate stats update
    animateValue(totalViewsElement, 0, totalViews, 1000);
    animateValue(totalSubscribersElement, 0, 1200, 1000);
    animateValue(engagementRateElement, 0, engagementRate, 1000);
    
    // Update analytics section stats
    document.getElementById('analyticsTotalViews').textContent = totalViews.toLocaleString();
    document.getElementById('analyticsSubscribers').textContent = "1.2K";
    document.getElementById('analyticsEngagement').textContent = `${engagementRate}%`;
    document.getElementById('analyticsWatchTime').textContent = `${videos.reduce((sum, video) => sum + video.watchTime, 0)}h`;
}

// Helper function to animate number values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize Performance Chart
function initChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Views',
                data: [1200, 1900, 1500, 2400, 3200, 3800],
                borderColor: 'rgba(241, 92, 25, 1)',
                backgroundColor: 'rgba(241, 92, 25, 0.1)',
                tension: 0.3,
                fill: true
            }, {
                label: 'Subscribers',
                data: [400, 600, 500, 800, 900, 1200],
                borderColor: 'rgba(29, 65, 140, 1)',
                backgroundColor: 'rgba(29, 65, 140, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Update Chart Data based on filter
function updateChartData(filter) {
    // In a real app, you would fetch different data based on the filter
    // This is just a mock implementation
    let labels, viewData, subData;
    
    switch(filter) {
        case '7days':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            viewData = [300, 450, 600, 550, 700, 900, 1200];
            subData = [50, 80, 100, 90, 120, 150, 200];
            break;
        case '30days':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            viewData = [1200, 1900, 2100, 2500];
            subData = [200, 300, 350, 400];
            break;
        case '90days':
            labels = ['Month 1', 'Month 2', 'Month 3'];
            viewData = [5000, 6500, 8000];
            subData = [600, 800, 1200];
            break;
        case 'all':
        default:
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            viewData = [1200, 1900, 1500, 2400, 3200, 3800];
            subData = [400, 600, 500, 800, 900, 1200];
    }
    
    performanceChart.data.labels = labels;
    performanceChart.data.datasets[0].data = viewData;
    performanceChart.data.datasets[1].data = subData;
    performanceChart.update();
}

// Show confirmation modal
function showConfirmModal(title, message, confirmCallback) {
    document.getElementById('confirmMessage').textContent = message;
    confirmModal.style.display = 'flex';
    
    const confirmAction = document.getElementById('confirmAction');
    
    // Remove previous event listeners
    confirmAction.replaceWith(confirmAction.cloneNode(true));
    const newConfirmAction = document.getElementById('confirmAction');
    
    newConfirmAction.addEventListener('click', () => {
        confirmCallback();
        confirmModal.style.display = 'none';
    });
}

// Show success notification
function showNotification(message) {
    document.getElementById('notificationMessage').textContent = message;
    successNotification.style.display = 'block';
    
    setTimeout(() => {
        successNotification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            successNotification.style.display = 'none';
            successNotification.style.animation = '';
        }, 500);
    }, 3000);
}

// Video actions
function editVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        // In a real app, you would populate a form with the video data
        showNotification(`Editing video: ${video.title}`);
    }
}

function deleteVideo(videoId) {
    const videoIndex = videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;
    
    const videoTitle = videos[videoIndex].title;
    
    // Animate removal
    const videoElement = document.querySelector(`.video-card[data-id="${videoId}"]`);
    if (videoElement) {
        videoElement.style.transition = 'all 0.3s ease';
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            videos.splice(videoIndex, 1);
            renderVideos();
            updateStats();
            showNotification(`${videoTitle} deleted successfully`);
        }, 300);
    }
}

function viewVideoDetails(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        // In a real app, you would navigate to a video details page
        showNotification(`Viewing video: ${video.title}`);
    }
}

// Comment actions
function replyToComment(commentId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        // In a real app, you would show a reply form
        showNotification(`Replying to comment by ${comment.author}`);
    }
}

function deleteComment(commentId) {
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    const commentAuthor = comments[commentIndex].author;
    
    // Animate removal
    const commentElement = document.querySelector(`.comment-item[data-id="${commentId}"]`);
    if (commentElement) {
        commentElement.style.transition = 'all 0.3s ease';
        commentElement.style.opacity = '0';
        commentElement.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            comments.splice(commentIndex, 1);
            renderComments();
            showNotification(`Comment by ${commentAuthor} deleted`);
        }, 300);
    }
}

// Modal Handling
uploadBtn.addEventListener('click', () => {
    uploadModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    uploadModal.style.display = 'none';
    document.body.style.overflow = '';
});

closeModalBtn.addEventListener('click', () => {
    uploadModal.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === confirmModal) {
        confirmModal.style.display = 'none';
    }
});

// Handle Video Upload with progress simulation
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const progressBar = uploadForm.querySelector('.progress-fill');
    const progressText = uploadForm.querySelector('.progress-text');
    const uploadProgress = uploadForm.querySelector('.upload-progress');
    
    uploadProgress.style.display = 'block';
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Create new video object
            const newVideo = {
                id: videos.length + 1,
                title: document.getElementById('videoTitle').value,
                views: 0,
                likes: 0,
                comments: 0,
                watchTime: Math.floor(Math.random() * 100) + 30,
                thumbnail: "https://picsum.photos/300/180?random=" + Math.floor(Math.random()*100),
                uploaded: new Date().toISOString().split('T')[0]
            };

            videos.unshift(newVideo);
            renderVideos();
            updateStats();
            
            setTimeout(() => {
                uploadModal.style.display = 'none';
                uploadForm.reset();
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
                document.body.style.overflow = '';
                
                showNotification('Video uploaded successfully!');
            }, 500);
        }
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
});

// Role Switching
roleSwitch.addEventListener('change', () => {
    localStorage.setItem('role', roleSwitch.value);
    window.location.href = `${roleSwitch.value}-dashboard.html`;
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
});

// Refresh comments
refreshCommentsBtn.addEventListener('click', () => {
    // In a real app, you would fetch fresh comments from the server
    // This is just a mock implementation
    refreshCommentsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
    
    setTimeout(() => {
        renderComments();
        refreshCommentsBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        showNotification('Comments refreshed');
    }, 1000);
});

// Analytics filter change
analyticsFilter.addEventListener('change', () => {
    updateChartData(analyticsFilter.value);
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', initDashboard);