const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { purchaseValidator } = require("../middlewares/validators");
const handleValidation = require("../middlewares/handleValidations");
const purchaseController = require("../controllers/purchase.controller");

// Client
router.post("/", authenticate, authorize(['client', 'admin']), purchaseValidator, handleValidation, purchaseController.createPurchase);
router.get('/my', authenticate, authorize(['client', 'admin']), purchaseController.getMyPurchases);

// Admin
router.get("/all", authenticate, authorize('admin'), purchaseController.getAllPurchases);

module.exports = router;