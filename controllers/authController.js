// Import and create authentication functions
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// User registration function (logic)
exports.registerUser = async (request, response) => {
    // Fetch data
    const { first_name, last_name, email, password, role } = request.body;

    // Log values to check for undefined fields
    console.log({ first_name, last_name, email, password, role });
    try {
        // Check if user exists in the database - use email address
        const [rows] = await db.execute('SELECT * FROM user_reg WHERE email = ?', [email]);
        if (rows.length > 0) {
            return response.status(400).json({ message: 'User already exists!' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert record into db table
        await db.execute('INSERT INTO user_reg (first_name, last_name, email, password, role) VALUES (?,?,?,?,?)', [
            first_name,
            last_name,
            email,
            hashedPassword,
            role
        ]);
        response.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'An error occurred!', error });
    }
};

// User login function
exports.loginUser = async (request, response) => {
    const { email, password } = request.body;
    try {
        // Check if user exists
        const [rows] = await db.execute('SELECT * FROM user_reg WHERE email = ?', [email]);
        if (rows.length === 0) {
            return response.status(400).json({ message: 'User not found! Please register.' });
        }
        const user = rows[0];

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).json({ message: 'Invalid credentials!' });
        }

        // Store user information in session
        request.session.user = {
            id: user.id, // check for the 'id' column in your user_reg table
            name: `${user.first_name} ${user.last_name}`, // Combine first and last name
            email: user.email,
            role: user.role // Store the user's role
        };

        response.status(200).json({ success: true, message: 'Login successful!', user: request.session.user });
    } catch (error) {
        response.status(500).json({ message: 'An error occurred!', error });
    }
};

//register doctor
exports.doctor= async (request, response) => {
    // Fetch data
    const { first_name, last_name, provider_specialty, email_address, phone_number, date_joined } = request.body;

    // Log values to check for undefined fields
    console.log({ first_name, last_name, provider_specialty, email_address, phone_number, date_joined  });
    try {
        // Check if user exists in the database - use email address
        const [rows] = await db.execute('SELECT * FROM providers WHERE email_address = ?', [email_address]);
        if (rows.length > 0) {
            return response.status(400).json({ message: 'User already exists!' });
        }

        // Insert record into db table
        await db.execute('INSERT INTO providers (first_name, last_name, provider_specialty, email_address, phone_number, date_joined) VALUES (?,?,?,?,?,?)', [
            first_name, 
            last_name, 
            provider_specialty, 
            email_address, 
            phone_number, 
            date_joined
        ]);
        response.status(201).json({ success: true, message: 'Provider registered successfully!' });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'An error occurred!', error });
    }
};

// Fetch Appointments for Doctor
exports.getDoctor = async (req, res) => {
    const provider_id = req.params.provider_id;
    const query = `SELECT * FROM providers WHERE provider_id = ? ORDER BY admission_date, consultation_time`;

    try {
        const [result] = await db.execute(query, [provider_id]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching providers', error });
    }
};

// Fetch All Appointments (Admin View)
exports.admin = async (req, res) => {
    const query = `SELECT * FROM appointments ORDER BY admission_date, consultation_time`;

    try {
        const [result] = await db.execute(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

// Add Admission Function
exports.addAdmissions = async (req, res) => {
    const { patient_id, admission_date, service, primary_diagnosis, consultation_time } = req.body;

    try {
        // Insert record into admission table
        await db.execute('INSERT INTO admissions (patient_id, admission_date, service, primary_diagnosis, consultation_time) VALUES (?,?,?,?,?)', [
            patient_id,
            admission_date,
            service,
            primary_diagnosis,
            consultation_time
        ]);
        res.status(201).json({ success: true, message: 'Admission booked successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while booking admission!', error });
    }
};

// Fetch all admissions (Admin View)
exports.getAdmissions = async (req, res) => {
    const query = `SELECT * FROM admissions ORDER BY admission_date`;

    try {
        const [result] = await db.execute(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admissions', error });
    }
};

// Update Patient Profile
exports.updatePatientProfile = async (req, res) => {
    const { patient_id } = req.params; // Extract patient_id from the request parameters
    const { name, phone, address } = req.body; // Get updated data from request body

    try {
        const result = await db.execute(
            'UPDATE user_reg SET name = ?, phone = ?, address = ? WHERE id = ?',
            [name, phone, address, patient_id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Profile updated successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while updating the profile!', error });
    }
};

// Delete Patient Profile
exports.deletePatientProfile = async (req, res) => {
    const { patient_id } = req.params;

    try {
        const result = await db.execute('DELETE FROM user_reg WHERE id = ?', [patient_id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Profile deleted successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while deleting the profile!', error });
    }
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, date, time } = req.body; // Adjust parameters as necessary

    try {
        await db.execute('INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES (?,?,?,?)', [
            patient_id,
            doctor_id,
            date,
            time
        ]);
        res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while booking the appointment!', error });
    }
};

// Reschedule Appointment
exports.rescheduleAppointment = async (req, res) => {
    const { appointment_id } = req.params; // Get the appointment ID from request parameters
    const { date, time } = req.body; // Get new date and time from request body

    try {
        const result = await db.execute(
            'UPDATE appointments SET date = ?, time = ? WHERE id = ?',
            [date, time, appointment_id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Appointment rescheduled successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Appointment not found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while rescheduling the appointment!', error });
    }
};

// Fetch user profile and appointments
exports.getUserProfileWithAppointments = async (req, res) => {
    const patient_id = req.params.patient_id;

    try {
        // Fetch user profile
        const [userRows] = await db.execute('SELECT * FROM user_reg WHERE id = ?', [patient_id]);
        const userProfile = userRows[0];

        // Fetch user appointments
        const [appointmentRows] = await db.execute('SELECT * FROM appointments WHERE patient_id = ?', [patient_id]);

        if (userProfile) {
            res.status(200).json({
                profile: userProfile,
                appointments: appointmentRows
            });
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the profile and appointments', error });
    }
};
