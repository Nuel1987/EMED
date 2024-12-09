const form = document.getElementById('providerForm');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Clear previous error messages
            clearErrors();

            // Gather form data
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const specialty = document.getElementById('provider_specialty').value.trim();
            const email = document.getElementById('email_address').value.trim();
            const phoneNumber = document.getElementById('phone_number').value.trim();
            const dateJoined = document.getElementById('date_joined').value.trim();

            console.log({ firstName, lastName, specialty, email, phoneNumber, dateJoined });
            
            // Validate data
            let valid = true;

            // Example validation for name
            if (firstName === '' || firstName.length < 4) {
                displayError('first-name-error', 'First name must be at least 4 characters.');
                valid = false;
            }
            if (lastName === '' || lastName.length < 4) {
                displayError('last-name-error', 'Last name must be at least 4 characters.');
                valid = false;
            }
            if (specialty === '' || specialty.length < 4) {
                displayError('specialty-error', 'Specialty  must be at least 4 characters.');
                valid = false;
            }

            if (email === '' || !validateEmail(email)) {
                displayError('email-error', 'Please enter a valid email address.');
                valid = false;
            }

            if (phoneNumber.length < 10) {
                displayError ('phone-error', 'Invalid Phone number.');
                valid = false;
            }

            if (dateJoined === ''  ) {
                displayError('date-error', 'Please choose a valid date.');
                valid = false;
            }

            // If valid, process the form 
            if (valid) {
                fetch ('/auth/provider', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ first_name: firstName, last_name: lastName, provider_specialty: specialty, email_address: email, phone_number: phoneNumber, date_joined: dateJoined })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success){
                        alert('Registration successful!'); // or any other processing logic
                        form.reset();
                        window.location.href = '/login.html'
                    } else {
                        alert(result.message);
                    }
                })
                .catch(error =>{
                    console.error('Error:', error);
                    alert ('Registration failed. please try again.')
                });
                
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

        function validateEmail(email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }
