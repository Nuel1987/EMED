// Load appointments on page load
window.onload = fetchAppointments;

// Submit the form to update an appointment
document.getElementById('edit-appointment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const admission_id = document.getElementById('admission_id').value;
    const doctor_id = document.getElementById('doctor_id').value;
    const admission_date = document.getElementById('admission_date').value;
    const service = document.getElementById('service').value;
    const primary_diagnosis = document.getElementById('primary_diagnosis').value;
    const consultation_time = document.getElementById('consultation_time').value;
    const status = document.getElementById('status').value;

    fetch(`/auth/admissions/${admission_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            admission_date,
            service,
            primary_diagnosis,
            consultation_time,
        })
    })
    fetch(`/auth/register/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Appointment updated successfully');
            fetchAppointments(); // Refresh the table
            document.getElementById('edit-appointment-form').classList.add('hidden'); // Hide the form
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Fetch appointments and display them in the table
function fetchAppointments() {
    fetch('/auth/admissions', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#appointmentsTable tbody'); 
            tbody.innerHTML = ''; // Clear existing rows

            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.admission_id}</td>
                    <td>${appointment.patient_id}</td>
                    <td>${appointment.doctor_id}</td>
                    <td>${appointment.admission_date}</td>
                    <td>${appointment.service}</td>
                    <td>${appointment.primary_diagnosis}</td>
                    <td>${appointment.consultation_time}</td>
                    <td>${appointment.status}</td>
                    <td>
                        <button class="edit-btn" onclick="editAppointment(${appointment.admission_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteAppointment(${appointment.admission_id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}




// Edit appointment
function editAppointment(admission_id) {
    fetch(`/auth/admissions/${admission_id}`)
        .then(response => response.json())
        .then(data => {
            const appointment = data.appointment;
            document.getElementById('admission_id').value = appointment.admission_id;
            document.getElementById('doctor_id').value = appointment.doctor_id;
            document.getElementById('admission_date').value = appointment.admission_date;
            document.getElementById('service').value = appointment.service;
            document.getElementById('primary_diagnosis').value = appointment.primary_diagnosis;
            document.getElementById('consultation_time').value = appointment.consultation_time;
            document.getElementById('status').value = appointment.status;

            // Show the edit form
            document.getElementById('edit-appointment-form').classList.remove('hidden');
        })
        .catch(error => console.error('Error:', error));
}

// Delete appointment
function deleteAppointment(admission_id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        fetch(`/auth/admissions/${admission_id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Appointment deleted successfully');
                fetchAppointments(); // Refresh the table
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
