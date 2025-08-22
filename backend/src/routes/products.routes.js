const express = require('express');
const router = express.Router();
const { productValidator } = require('../middlewares/validators');
const { authenticate, authorize } = require('../middlewares/auth')
const handleValidation = require('../middlewares/handleValidations');
const productController = require('../controllers/product.controller');

// User
router.get("/", authenticate, productController.getProducts);
router.get("/:id", authenticate, productController.getProductById);

// Admin
router.post("/", authenticate, authorize('admin'), productValidator, handleValidation, productController.createProduct);
router.put("/:id", authenticate, authorize('admin'), productValidator, handleValidation, productController.updateProduct);
router.delete("/:id", authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;