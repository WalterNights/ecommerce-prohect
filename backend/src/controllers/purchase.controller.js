const { sequelize, User, Product, Order, OrderItem, Purchase, PurchaseItem } = require('../models');

//Make Purchase
exports.createPurchase = async (req, res) => {
    const transact = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { orderId } = req.body;
        let total = 0;
        // Search Order with a Item
        const order = await Order.findByPk(orderId, {
            include: [{ model: OrderItem }],
            transaction: transact
        });
        if (!order) {
            await transact.rollback();
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        if (order.status !== 'pending') {
            await transact.rollback();
            return res.status(400).json({ mesagge: "La orden ya fue procesada o cancelada" });
        }
        // Check stock with blocking
        for (const item of order.OrderItem) {
            const product = await Product.findByPk(item.product_id, {
                transaction: transact,
                lock: transact.LOCK.UPDATE,
            });
            if (!product) {
                await transact.rollback();
                return res.status(404).json({ message: `Producto ${item.product_id} no existe` });
            }
            if (product.stock < item.quantity) {
                await transact.rollback();
                return res.status(404).json({ message: `Cantidad insuficiente para ${product.name}` });
            }
            // Stock Discount
            product.stock -= item.quantity;
            await product.save({ transaction: transact });
            // Sum Total
            total += item.price * item.quantity;
        }
        // Mark Order paid
        order.status = 'paid';
        order.total = total;
        await order.save({ transaction: transact });
        // Purchase Register
        const purchase = await Purchase.create(
            { user_id: userId, order_id: order.id, total, status: 'completed' },
            { transaction: transact }
        );
        // Make Purchase Item
        for (const item of order.OrderItem) {
            await PurchaseItem.create(
                {
                    purchase_id: purchase.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                },
                { transaction: transact }
            );
        }
        // Purchase Conmfirm
        await transact.commit();
        return res.status(201).json({ message: "Compra realizada con éxito", data: purchase })
    } catch (error) {
        return res.status(500).json({ message: "Error al realizar la compra", details: error.message });
    }
};

//Record Client Purchase View
exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            where: { user_id: req.user.id },
            include: [{ model: PurchaseItem, as: 'items', include: [Product] }]
        });
        return res.json(purchases);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el historial de compras" });
    }
};

//Admin: see all Purchases
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                { model: User, as: 'client', attributes: ['id', 'username', 'email'] },
                { model: PurchaseItem, as: 'items', include: [Product] }
            ]
        });
        return res.json(purchases);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener las compras" });
    }
};