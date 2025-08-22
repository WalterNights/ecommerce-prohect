const express = require('express');
const router = express.Router();
const refreshToken = require('../token/refresh');
const authController = require('../controllers/auth.controller');
const handleValidation = require('../middlewares/handleValidations');
const { registerValidator, loginValidator } = require('../middlewares/validators');

// Register
router.post("/register", registerValidator, handleValidation, authController.register);

// Login
router.post("/login", loginValidator, handleValidation, authController.login);

// Refresh Token
router.post("/token/refresh", refreshToken);

module.exports = router;