const express = require('express');
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

//Authenticate only
router.get("/profile", authenticate, (req, res) => {
    res.json({ message: "Perfil del usuario", user: req.user });
});

//Admin only
router.get("/admin/profile", authenticate, authorize('admin'), (req, res) => {
    res.json({ message: "Ruta solo para admin" });
});

module.exports = router;