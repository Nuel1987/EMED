// Dummy user data for admin, doctor, and patient
const admins = [
    { email: "admin1@example.com", password: "password123" },
    { email: "admin2@example.com", password: "admin456" }
];

const doctors = [
    { email: "provider1@example.com", password: "password123" },
    { email: "provider2@example.com", password: "provider456" }
];

const patients = [
    { email: "patient1@example.com", password: "patient123" },
    { email: "patient2@example.com", password: "patient456" }
];

// Handle login and redirect based on user type
function handleLogin(email, password) {
    // Find if the user is admin, doctor, or patient
    const admin = admins.find(user => user.email === email && user.password === password);
    const doctor = doctors.find(user => user.email === email && user.password === password);
    const patient = patients.find(user => user.email === email && user.password === password);

    // Check which user type has logged in and redirect accordingly
    if (doctor) {
        window.location.href = 'doctorMgt.html'; // Redirect to doctor management dashboard
    } else if (admin) {
        window.location.href = 'admin.html'; // Redirect to admin dashboard
    } else if (patient) {
        window.location.href = 'patient_registration.html'; // Redirect to patient dashboard
    } else {
        // Display error message for invalid login credentials
        displayError('error-message', 'Invalid email or password. Please try again.');
    }
}

// Clear previous error messages
function clearErrors() {
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('error-message').textContent = ''; // Clear general error
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

// Form submission event listener
const form = document.getElementById('loginForm');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous error messages
    clearErrors();

    // Gather form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    let valid = true;

    // Email validation
    if (email === '' || !validateEmail(email)) {
        displayError('email-error', 'Please enter a valid email address.');
        valid = false;
    }

    // Password validation
    if (password === '' || !validatePassword(password)) {
        displayError('password-error', 'Password must be at least 8 characters long and include both letters and numbers.');
        valid = false;
    }

    // If both email and password are valid, proceed with login handling
    if (valid) {
        handleLogin(email, password); // Call the login function
    }
});
