const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || '4826seWD)%#/efvv90342SDF$#/=sdf#$343234SDFSDFsdsf';

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({ error: "Token requerido" });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado "});
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "No tienes permisos" });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
}