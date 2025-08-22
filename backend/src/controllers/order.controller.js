const { Order, OrderItem, Product, User } = require('../models');

module.exports = {
    // Make new Order with a item
    async createOrder(req, res) {
        try {
            const { items } = req.body;
            const userId = req.user.id;
            // Check Stock
            for (let item of items) {
                const product = await Product.findByPk(item.id);
                if (!product) return res.status(404).json({ error: `Producto ${item.id} no encontrado` });
                if (product.stock < item.quantity) {
                    return res.status(400).json({ error: `Cantidad insuficiente para ${product.name}` });
                }
            }
            if (!userId || !items.length === 0) {
                return res.status(400).json({ success: false, message: "Datos incompletos para crear el pedido" });
            }
            // Make Order
            const order = await Order.create({ user_id: userId, status: 'pending' });
            // Make Order Item
            for (let item of items) {
                const product = await Product.findByPk(item.id);
                await OrderItem.create({
                    order_id: order.id,
                    product_id: product.id,
                    quantity: item.quantity,
                    price: product.price,
                });
                product.stock -= item.quantity;
                await product.save();
            }
            return res.status(201).json({ success: true, message: "Orden creada exitosamente" });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Error al creal el pedido", details: error.message });
        }
    },

    // Get All Orders
    async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, attributes: ['id', 'username', 'email'] },
                    { model: OrderItem, include: [{ model: Product }] },
                ],
            });
            return res.json({ success: true, data: orders })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al obtener las órdenes", details: error.message });
        }
    },

    // Get Order by ID
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = Order.findByPk(id, {
                include: [
                    { model: User, attributes: ['id', 'username', 'email'] },
                    { model: OrderItem, include: [{ model: Product }] },
                ],
            });
            if (!order) {
                res.status(404).json({ success: false, message: "Orden no encontrada" });
            }
            return res.json({ success: true, data: order });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al obtener la orden", details: error.message })
        }
    },

    // Get my Order
    async getMyOrders(req, res) {
        try {
            const order = await Order.findAll({
                where: { user_id: req.user.id },
                include: [{ model: OrderItem, include: [{ model: Product }] }]
            });
            return res.json({ success: true, data: order })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al obtener tus órdenes", details: error.message })
        }
    },

    // Update Order Status
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ success: false, message: "Orden no encontrada" });
            }
            order.status = status;
            await order.save();
            return res.json({ success: true, message: "Estado aztualizado", data: order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Error al actualizar el estado de la orden", details: error.message });
        }
    },

    // Cancel Order
    async cancelOrder(req, res) {
        try {
            const { id } = req.params;
            const order = Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ success: false, message: "Orden no encontrada" });
            }
            order.status = 'cancelled';
            await order.save();
            return res.json({ success: true, message: "Orden cancelada", data: order });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Error al cancelar la orden", details: error.message });
        }
    },

    async getOrderHistory(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [{ model: Product, as: 'product' }]
                    },
                    { model: User, as: 'user' },
                    { model: Purchase, as: 'purchase' }
                ],
                order: [['created_at', 'DESC']]
            });
            res.json({ success: true, orders });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Error al obtener el historial", details: error.message });
        }
    }
};