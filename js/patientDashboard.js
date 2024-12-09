document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchAppointments();
});

// Fetch and display the patient's profile details
function fetchProfile() {
    fetch('/auth/admissions') // Endpoint for fetching patient profile details
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.name;
            document.getElementById('phone').value = data.phone;
            document.getElementById('address').value = data.address;
        })
        .catch(error => console.error('Error fetching profile:', error));
}

// Update profile details
document.getElementById('edit-profile-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const updatedProfile = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
    };

    fetch('/auth/admissions', { // Endpoint for updating patient profile
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error updating profile:', error));
});

// Delete profile
function deleteProfile() {
    if (confirm('Are you sure you want to delete your profile?')) {
        fetch('/auth/admissions', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Error deleting profile:', error));
    }
}

// Fetch and display patient's appointments
function fetchAppointments() {
    fetch('/auth/admissions') // Endpoint for fetching appointments
        .then(response => response.json())
        .then(appointments => {
            const tbody = document.getElementById('appointmentsTable').querySelector('tbody');
            tbody.innerHTML = '';
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.id}</td>
                    <td>${appointment.doctor}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.status}</td>
                    <td>
                        <button onclick="rescheduleAppointment(${appointment.id})">Reschedule</button>
                        <button onclick="cancelAppointment(${appointment.id})">Cancel</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching appointments:', error));
}

// Reschedule an appointment
function rescheduleAppointment(id) {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newTime = prompt("Enter new time (HH:MM):");
    if (newDate && newTime) {
        fetch(`/auth/admissions/${id}`, { // Endpoint for rescheduling an appointment
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: newDate, time: newTime }),
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error rescheduling appointment:', error));
    }
}

// Cancel an appointment
function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        fetch(`/auth/admissions/${id}`, { // Endpoint for canceling an appointment
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchAppointments();
        })
        .catch(error => console.error('Error canceling appointment:', error));
    }
}
