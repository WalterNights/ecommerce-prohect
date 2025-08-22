const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// User
router.post("/", authenticate, orderController.createOrder);
router.get("/my-oders", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.put("/:id/cancel", authenticate, orderController.cancelOrder);
router.get("/history", authenticate, orderController.getOrderHistory)

// Admin
router.get("/", authenticate, authorize('admin'), orderController.getAllOrders);
router.put("/:id/status", authenticate, authorize('admin'), orderController.updateOrderStatus);


module.exports = router;