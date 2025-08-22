const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes')
const productRoutes = require('./routes/products.routes');
const purchaseRoutes = require('./routes/purchase.routes');

const app = express();

// Globar Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.get('/health', (req, res) => res.json({ ok: true }));

// CORS CONFIG
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Api Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;