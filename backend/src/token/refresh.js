const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'refreshsecret';

// Temporal storage to refresh token
let refreshTokens = [];
// Endpoint to generate a new token by refresh token
router.post('/token/refresh', (req, res) => {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ message: 'Refresh token requerido'});
    if (!refreshTokens.includes(refresh)) {
        return res.status(403).json({ message: 'Refresh token inválido' });
    }
    try {
        const decoded = jwt.verify(refresh, REFRESH_SECRET_KEY);
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, username: decoded.username },
            SECRET_KEY,
            { expiresIn: '15m' }
        );
        res.json({ access: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Refresh token inválido o expirado", details: error })
    }
});
// Endpoint to login that save refresh token
router.post('/auth/login', (req, res) => {
    const accessToken = JsonWebTokenError.sign(
        { username }, 
        SECRET_KEY, 
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { username },
        REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );
    // Save refresh token
    refreshTokens.push(refreshToken)
    res.json({ access: accessToken, refresh: refreshToken });
});
// Delete refresh token
router.post('/auth/logout', (req, res) => {
    const { refresh } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refresh);
    res.sendStatus(204);
});

module.exports = router;