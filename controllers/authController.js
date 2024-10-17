//import and create authetication functions
const db = require('../config/db');
const bcrypt = require('bcryptjs');


//user registration function (logic)
exports.registerUser = async (request, response) => {
    //fetch data
    const { first_name, last_name, email, password, role } = request.body;
    try{
        //check if user exists in the database - use email address
        const [rows] = await db.execute('SELECT * FROM user_reg WHERE email = ?', [email])
        if(rows.length > 0){
            return response.status(400).json({ message: 'User already exists!'});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert record into db table
        await db.execute('INSERT INTO user_reg (first_name, last_name, email, password, role) VALUES (?,?,?,?,?)', [
            first_name,
            last_name,
            email,
            hashedPassword,
            role
        ]);
        response.status(201).json({ message: 'User registered successfully!'})
    } catch(error) {
        console.log(error)
        response.status(500).json({ message: 'An error occured!', error });
    }
}

exports.loginUser = async (request, response) => {
    const { email, password } = request.body;
    try{
        //check if user exists
        const [rows] = await db.execute('SELECT * FROM user_reg WHERE email = ?', [email]);
        if(rows.length === 0){
            return response.status(400).json({ message: 'User not found! Please register.'});
        }
        const user = rows[0];

        //compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(400).json({ message: 'Invalid credentials!' });
        }
        response.status(200).json({ message: 'Login successful!', name: user.name, email : user.email });
    } catch(error) {
        response.status(500).json({ message: 'An error occured!', error });
    }
}

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