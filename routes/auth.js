const express = require('express');
const {
    registerUser,
    loginUser,
    admin,
    getAdmissions,
    addAdmissions,
    doctor,
    getDoctor,
    updatePatientProfile,
    deletePatientProfile,
    bookAppointment,
    rescheduleAppointment,
} = require('../controllers/authController');
const { generateResponse } = require('../openaiservice');

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// User appointment
router.post('/appointment', admin);

// Admissions management
router.post('/admissions', addAdmissions);
router.get('/admissions', getAdmissions);

// Provider registration
router.post('/provider', doctor);
router.get('/provider', getDoctor);

// Patient profile management
router.put('/patient/profile/:patient_id', updatePatientProfile);
router.delete('/patient/profile/:patient_id', deletePatientProfile);
router.post('/patient/appointments', bookAppointment);
router.put('/patient/appointments/:appointment_id', rescheduleAppointment);

// AI Chat endpoint
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        console.log('Chat endpoint invoked with message:', message);
        const aiResponse = await generateResponse(message);
        res.status(200).json({ reply: aiResponse });
    } catch (error) {
        console.error('Error in /chat route:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
