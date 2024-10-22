        const form = document.getElementById('registerForm');
       
        form.addEventListener('submit', function(event) {
            event.preventDefault();


            // Clear previous error messages
            clearErrors();

            // Gather form data
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const role = document.getElementById('role').value;
            const terms = document.getElementById('terms').checked;

            
        // Console log the data before submitting
            console.log({ firstName, lastName, email, password, role, terms });
            // Form validation logic
            let valid = true;

            // Name validation
            if (firstName === '' || firstName.length < 4) {
                displayError('first-name-error', 'First name must be at least 4 characters.');
                valid = false;
            }
            if (lastName === '' || lastName.length < 4) {
                displayError('last-name-error', 'Last name must be at least 4 characters.');
                valid = false;
            }

            // Email validation
            if (email === '' || !validateEmail(email)) {
                displayError('email-error', 'Please enter a valid email address.');
                valid = false;
            }

            // Password validation
            if (password === '' || !validatePassword(password)) {
                displayError('password-error', 'Password must be at least 8 characters and include letters and numbers.');
                valid = false;
            }

            // Confirm password validation
            if (confirmPassword === '' || password !== confirmPassword) {
                displayError('confirm-password-error', 'Passwords do not match.');
                valid = false;
            }

            // Role validation
            if (role === 'Select') {
                displayError('role-error', 'Please select a role.');
                valid = false;
            }

            // Terms validation
            if (!terms) {
                alert('Please accept the terms and conditions.');
                valid = false;
            }

           
            if (valid) {
                // const data ={ first_name: firstName, last_name: lastName, email, password, role, terms };
                fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, role, terms }),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success){
                        alert('Registration successful! Please log in.');
                        window.location.href = '/login.html'
                    } else {
                        alert(result.message);
                    }
                })
                
                .catch(error =>{
                    console.error('Error:', error);
                    alert ('Registration failed. please try again.')
                });
                form.reset();
            }
        });

        // Helper functions
        function clearErrors() {
            document.getElementById('first-name-error').textContent = '';
            document.getElementById('last-name-error').textContent = '';
            document.getElementById('email-error').textContent = '';
            document.getElementById('password-error').textContent = '';
            document.getElementById('confirm-password-error').textContent = '';
            document.getElementById('role-error').textContent = '';
            document.getElementById('terms-error').textContent = '';
        }

        function displayError(elementId, message) {
            document.getElementById(elementId).textContent = message;
        }

        function validateEmail(email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }

        function validatePassword(password) {
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
            return passwordPattern.test(password);
        }
  