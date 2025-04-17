// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const avatarUpload = document.getElementById('avatarUpload');
const profileAvatar = document.getElementById('profileAvatar');
const dashboardSwitch = document.getElementById('dashboardSwitch');
const goToDashboardBtn = document.getElementById('goToDashboardBtn');
const passwordDisplay = document.getElementById('passwordDisplay');
const passwordInputWrapper = document.querySelector('.password-input-wrapper');
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.querySelector('.toggle-password');

// Debug: Verify DOM selections
if (!passwordInputWrapper) console.error('passwordInputWrapper not found');
if (!passwordInput) console.error('passwordInput not found');
if (!togglePassword) console.error('togglePassword not found');

// Profile Fields
const profileFields = {
    fullName: document.getElementById('fullName'),
    fullNameInput: document.getElementById('fullNameInput'),
    email: document.getElementById('email'),
    emailInput: document.getElementById('emailInput'),
    bio: document.getElementById('bio'),
    bioInput: document.getElementById('bioInput'),
    password: passwordDisplay,
    passwordInput: passwordInput
};

// In-memory user data (persists until refresh)
let userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Digital creator and tech enthusiast. Love to share my creations with the world!",
    joinDate: "June 15, 2023",
    role: "buyer",
    password: "••••••••" // Initial placeholder
};

// Edit Profile Mode
let isEditMode = false;

// Toggle Edit Mode
editProfileBtn.addEventListener('click', () => {
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        // Enter edit mode
        editProfileBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        editProfileBtn.classList.remove('btn-outline');
        editProfileBtn.classList.add('btn-danger');
        
        // Show input fields with current values
        profileFields.fullNameInput.value = profileFields.fullName.textContent;
        profileFields.emailInput.value = profileFields.email.textContent;
        profileFields.bioInput.value = profileFields.bio.textContent;
        profileFields.passwordInput.value = ''; // Clear password field
        
        // Toggle visibility
        profileFields.fullName.style.display = 'none';
        profileFields.fullNameInput.style.display = 'block';
        profileFields.email.style.display = 'none';
        profileFields.emailInput.style.display = 'block';
        profileFields.bio.style.display = 'none';
        profileFields.bioInput.style.display = 'block';
        profileFields.password.style.display = 'none';
        passwordInputWrapper.style.display = 'block';
        profileFields.passwordInput.style.display = 'block';
        togglePassword.style.display = 'block';
        
        saveProfileBtn.style.display = 'inline-flex';
    } else {
        // Exit edit mode
        editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editProfileBtn.classList.add('btn-outline');
        editProfileBtn.classList.remove('btn-danger');
        
        // Toggle visibility
        profileFields.fullName.style.display = 'inline';
        profileFields.fullNameInput.style.display = 'none';
        profileFields.email.style.display = 'inline';
        profileFields.emailInput.style.display = 'none';
        profileFields.bio.style.display = 'inline';
        profileFields.bioInput.style.display = 'none';
        profileFields.password.style.display = 'inline';
        passwordInputWrapper.style.display = 'none';
        profileFields.passwordInput.style.display = 'none';
        togglePassword.style.display = 'none';
        
        saveProfileBtn.style.display = 'none';
    }
});

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Make password field clickable to enter edit mode
passwordDisplay.addEventListener('click', () => {
    if (isEditMode) return;
    editProfileBtn.click();
    passwordInput.focus();
});

// Save Profile Changes
saveProfileBtn.addEventListener('click', () => {
    const storage = localStorage.getItem('keepSignedIn') ? localStorage : sessionStorage;
    storage.setItem('username', profileFields.fullNameInput.value);
    // Update in-memory user data
    userData.name = profileFields.fullNameInput.value;
    userData.email = profileFields.emailInput.value;
    userData.bio = profileFields.bioInput.value;
    
    // Handle password update
    const newPassword = profileFields.passwordInput.value;
    if (newPassword) {
        userData.password = '•'.repeat(newPassword.length); // Set dots based on password length
    }
    
    // Update displayed values
    profileFields.fullName.textContent = userData.name;
    profileFields.email.textContent = userData.email;
    profileFields.bio.textContent = userData.bio;
    profileFields.password.textContent = userData.password;
    
    // Reset password field UI
    profileFields.password.style.display = 'inline';
    passwordInputWrapper.style.display = 'none';
    profileFields.passwordInput.value = '';
    
    // Exit edit mode
    editProfileBtn.click();
    
    // Show success message
    showToast('Profile updated successfully!');
});

// In the avatar upload event listener
avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profileAvatar.src = event.target.result;
        localStorage.setItem('avatarUrl', event.target.result); // Add this line
        showToast('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  });

// Dashboard Navigation
goToDashboardBtn.addEventListener('click', () => {
    const selectedDashboard = dashboardSwitch.value;
    window.location.href = `${selectedDashboard}-dashboard.html`;
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
});

// Helper: Show Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize with user data
function loadUserData() {
    profileFields.fullName.textContent = userData.name;
    profileFields.email.textContent = userData.email;
    profileFields.bio.textContent = userData.bio;
    profileFields.password.textContent = userData.password;
    
    const initials = userData.name.split(' ').map(n => n[0]).join('');
    profileAvatar.src = `https://ui-avatars.com/api/?name=${initials}&background=e91e63&color=fff`;
    
    dashboardSwitch.value = localStorage.getItem('role') || userData.role;
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadUserData);