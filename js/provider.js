const form = document.getElementById('providerForm');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Clear previous error messages
            clearErrors();

            // Gather form data
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const specialty = document.getElementById('provider_specialty').value.trim();
            const email = document.getElementById('email').value.trim();
            const phoneNumber = document.getElementById('phone_number').value.trim();
            const dateJoined = document.getElementById('date').value.trim();

            // Validate data
            let valid = true;

            // Example validation for name
            if (firstName.length < 2) {
                displayError('first-name-error', 'First name must be at least 2 characters.');
                valid = false;
            }
            if (lastName.length < 2) {
                displayError('last-name-error', 'Last name must be at least 2 characters.');
                valid = false;
            }
            // Add more validation as needed...

            // If valid, process the form (you can replace this with an AJAX call or any logic you want)
            if (valid) {
                alert('Registration successful!'); // or any other processing logic
                form.reset(); // Reset the form after submission
            }
        });

        function clearErrors() {
            document.getElementById('first-name-error').textContent = '';
            document.getElementById('last-name-error').textContent = '';
            document.getElementById('specialty-error').textContent = '';
            document.getElementById('email-error').textContent = '';
            document.getElementById('phone-error').textContent = '';
            document.getElementById('date-error').textContent = '';
        }

        function displayError(elementId, message) {
            document.getElementById(elementId).textContent = message;
        }