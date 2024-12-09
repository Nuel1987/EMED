
    // Add User Form Submission
    document.getElementById('newUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Clear previous errors
        clearErrors();

        // Gather form data
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm-password').value;
        const role = document.getElementById('role').value;
        let valid = true;

        // Basic validation
        if (password !== confirm_password) {
            displayError('confirm-password-error', 'Passwords do not match.');
            valid = false;
        }

        if (role === 'Select') {
            displayError('role-error', 'Please select a role.');
            valid = false;
        }

        // If form is valid, send request to server
        if (valid) {
            fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name, last_name, email, password, role })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('User added successfully!');
                    document.getElementById('newUserForm').reset();
                    document.getElementById('user-form').style.display = 'none';
                    fetchUsers(); // Refresh the users list
                } else {
                    alert(result.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Function to fetch and display users in the table
    function fetchUsers() {
        fetch('/register/users')
            .then(response => response.json())
            .then(users => {
                const userTableBody = document.getElementById('user-table-body');
                userTableBody.innerHTML = ''; // Clear existing rows
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.user_id}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button onclick="editUser(${user.user_id})">Edit</button>
                            <button onclick="deleteUser(${user.user_id})">Delete</button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Utility functions for inline error handling
    function clearErrors() {
        document.getElementById('first-name-error').textContent = '';
        document.getElementById('last-name-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('password-error').textContent = '';
        document.getElementById('confirm-password-error').textContent = '';
        document.getElementById('role-error').textContent = '';
    }

    function displayError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    // Show Add User Form
    document.getElementById('add-user-btn').addEventListener('click', function() {
        document.getElementById('user-form').style.display = 'block';
    });

    // Initial fetch of users
    fetchUsers();

