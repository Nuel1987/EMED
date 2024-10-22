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

// Fetch Appointments for Doctor
exports.doctor = async (req, res) => {
    const provider_id = req.params.provider_id;
    const query = `SELECT * FROM providers WHERE provider_id = ? ORDER BY admission_date, consultation_time`;

    try {
        const [result] = await db.execute(query, [provider_id]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
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
