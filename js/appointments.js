document.getElementById('filterButton').addEventListener('click', function() {
    const date = document.getElementById('filterDate').value;
    const doctor = document.getElementById('filterDoctor').value;
    const status = document.getElementById('filterStatus').value;

    // Fetch data and filter logic
    console.log('Filters:', { date, doctor, status });

    // Simulate fetching data and updating table
    filterAppointments(date, doctor, status);
});

function filterAppointments(date, doctor, status) {
    // Here you would normally send a request to the backend to fetch filtered data
    // For demonstration, we'll log the filters
    console.log('Filtering appointments with:', { date, doctor, status });

    // You can also update the UI here with filtered data
}

// You can add more logic for view, edit, and delete buttons
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Viewing appointment');
    });
});

document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Editing appointment');
    });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this appointment?')) {
            alert('Appointment deleted');
        }
    });
});
