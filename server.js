const express = require('express');
const session = require('express-session')
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4500;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// JWT Middleware to Verify Token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

// Register User
app.post('/register', (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
   
    // Log incoming request data
    console.log("Received data:", { first_name, last_name, email, role });

    // Check if email already exists
    const checkEmailQuery = "SELECT * FROM user_reg WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).send('Internal server Error');
        }
        if (result.length > 0) {
            return res.status(400).send('Email already exists');
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8);

        //Insert user into database
        const query = "INSERT INTO user_reg (first_name, last_name, email, password, role) VALUES (?,?,?,?,?)";
        db.query(query, [first_name, last_name, email, hashedPassword, role], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).send('Error registering user');
            }
            console.log("User inserted:", result);
            res.status(200).send('User registered successfully');
        });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = "SELECT * FROM user_reg WHERE email = ?";
    db.query(query, [email], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Invalid login credentials');

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid login credentials');

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

// Dashboard (Role-Based Access)
app.get('/dashboard', verifyToken, (req, res) => {
    if (req.userRole === 'Doctor') {
        res.status(200).send('Doctor Dashboard');
    } else if (req.userRole === 'Admin') {
        res.status(200).send('Admin Dashboard');
    } else {
        res.status(200).send('Patient Dashboard');
    }
});

// Add Doctor (Admin Only)
app.post('/add_doctor', verifyToken, (req, res) => {
    // Admin check
    if (req.userRole !== 'Admin') return res.status(403).send('Access Denied');

    // Extract fields
    const { first_name, last_name, pprovider_specialty, email_address, phone_number } = req.body;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;  

    if (!first_name || !last_name || !pprovider_specialty || !email_address || !phone_number) {
        return res.status(400).send('All fields are required');
    }
    
    if (!emailRegex.test(email_address)) {
        return res.status(400).send('Invalid email format');
    }

    if (!phoneRegex.test(phone_number)) {
        return res.status(400).send('Invalid phone number. It must be a 10-digit number');
    }

    // Optional: You can check if the names contain only letters
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
        return res.status(400).send('First and last names should contain only letters');
    }

    // Insert doctor into the database if all validations pass
    const query = "INSERT INTO providers (first_name, last_name, pprovider_specialty, email_address, phone_number) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [first_name, last_name, pprovider_specialty, email_address, phone_number], (err, result) => {
        if (err) return res.status(500).send('Error adding doctor');
        res.status(200).send('Doctor added successfully');
    });
});


// Read All Doctors
app.get('/doctorMgt', verifyToken, (req, res) => {
    const query = "SELECT * FROM providers";
    db.query(query, (err, result) => {
        if (err) return res.status(500).send('Error fetching doctors');
        res.status(200).send(result);
    });
});

// Update Doctor Schedule or Profile (Admin/Doctor)
app.put('/update_doctor/:provider_id', verifyToken, (req, res) => {
    const provider_id = req.params.provider_id;
    const { first_name, last_name, pprovider_specialty, email_address, phone_number } = req.body;

    if (req.userRole !== 'Admin' && req.userRole !== 'Doctor') {
        return res.status(403).send('Access Denied');
    }

    const query = "UPDATE providers SET first_name = ?, last_name = ?, pprovider_specialty = ?, email_address = ?, phone_number = ? WHERE provider_id = ?";
    db.query(query, [first_name, last_name, pprovider_specialty, email_address, phone_number, provider_id], (err, result) => {
        if (err) return res.status(500).send('Error updating doctor');
        res.status(200).send('Doctor updated successfully');
    });
});

// Delete/Deactivate Doctor (Admin Only)
app.delete('/delete_doctor/:id', verifyToken, (req, res) => {
    const provider_id = req.params.id;

    if (req.userRole !== 'Admin') return res.status(403).send('Access Denied');

    const query = "DELETE FROM providers WHERE provider_id = ?";
    db.query(query, [provider_id], (err, result) => {
        if (err) return res.status(500).send('Error deleting doctor');
        res.status(200).send('Doctor deleted successfully');
    });
});

// Server Listen
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
// Fetch Appointments for Doctor
app.get('/appointments/:provider_id', (req, res) => {
    const provider_id = req.params.provider_id;

    const query = `SELECT * FROM appointments WHERE provider_id = ? ORDER BY admission_date, consultation_time`;
    db.query(query, [provider_id], (err, result) => {
        if (err) return res.status(500).send('Error fetching appointments');
        res.status(200).json(result);
    });
});

// Fetch All Appointments (Admin View)
app.get('/admin/appointments', (req, res) => {
    const query = `SELECT * FROM appointments ORDER BY admission_date, consultation_time`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).send('Error fetching appointments');
        res.status(200).json(result);
    });
});
