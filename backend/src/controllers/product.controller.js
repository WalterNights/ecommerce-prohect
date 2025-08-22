const { Product } = require('../models');

// Make a Product
exports.createProduct = async (req, res) => {
    try {
        const { batch_number, name, price, stock, date_in } = req.body;
        if (!batch_number || !name) {
            return res.status(400).json({ success: false, message: "Número de lote y nombre son obligatorios" });
        }
        if (price < 0 || stock < 0) {
            return res.status(400).json({ success: false, message: "Precio y Cantidad no pueden ser negativos" });
        }
        const product = await Product.create({ batch_number, name, price, stock, date_in });
        return res.status(201).json({ success: true, message: "Producto creado exitosamente", data: product});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al crear el producto", details: error.message });
    }
};

// Get Products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.json({success: true, data: products})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al obtener los productos", details: error.message });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        return res.json({ success: true, data: product })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al obtener el producto", details:error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { batch_number, name, price, stock, date_in } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        if (price !== undefined && price < 0) {
            return res.status(400).json({ success: false, message: "El precio no debe ser negativo" });
        }
        if (stock !== this.undefined && stock < 0) {
            return res.status(400).json({ success: false, message: "La cantidad no puede ser negativa" });
        }
        await product.update({ batch_number, name, price, stock, date_in });
        return res.json({ success: true, message: "Producto actualizado", data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al actualizar el producto", details: error.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado", details: error.message });
        await product.destroy();
        return res.json({ success: true, message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al eliminar el producto", details: error.message });
    }
} ;