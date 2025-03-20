const express = require('express');
const router = express.Router();
// const uploadMiddleware = require('../middleware/uploadFormMiddleware')

const { createStudentApplication} = require('../controllers/applicants');

// Use the uploadFields middleware for handling file uploads
router.post('/create-student-application',  

  createStudentApplication
);

module.exports = router;