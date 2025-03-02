// Form Validation and Submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if(password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Simulate registration success
    alert('Registration successful! Redirecting to login...');
    
    // Redirect to login page after 1 second
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
});

// Mobile Menu Toggle (if needed)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});