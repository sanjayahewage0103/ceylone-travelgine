const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Use multer for vendor registration (accepts files and fields)
router.post('/register', upload.fields([
	{ name: 'logo', maxCount: 1 },
	{ name: 'documentPdf', maxCount: 1 },
	{ name: 'profilePic', maxCount: 1 },
	{ name: 'verificationPhoto', maxCount: 1 },
	{ name: 'sltdaLicensePic', maxCount: 1 }
]), register);
router.post('/login', login);

module.exports = router;
