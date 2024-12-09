// Form submission event listener for login form
const form = document.getElementById('loginForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Clear previous error messages
    clearErrors();

    // Gather form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    let valid = true;

    // Validate email
    if (email === '' || !validateEmail(email)) {
        displayError('email-error', 'Please enter a valid email address.');
        valid = false;
    }

    // Validate password
    if (password === '' || !validatePassword(password)) {
        displayError('password-error', 'Password must be at least 8 characters long and include both letters and numbers.');
        valid = false;
    }

    // If valid, proceed with login
    if (valid) {
        loginUser(email, password);
    }
});

// Function to handle the login process
function loginUser(email, password) {
    // Log data to check before sending
    console.log({ email, password });

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Login successful!');
            // Redirect based on user role
            if (result.user.role === 'Admin') {
                window.location.href = '/admin.html';
            } else if (result.user.role === 'Doctor') {
                window.location.href = '/doctorMgt.html';
            } else {
                window.location.href = '/patientDashboard.html'; // Adjust accordingly
            }
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    });
}

// Helper functions

// Clear error messages
function clearErrors() {
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
}

// Display error messages
function displayError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Validate password (at least 8 characters, letters, and numbers)
function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordPattern.test(password);
}
