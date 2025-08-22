const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = process.env.JWT_SECRET || '4826seWD)%#/efvv90342SDF$#/=sdf#$343234SDFSDFsdsf';

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });     
        res.status(201).json({ message: "Usuario registrado", user })
    } catch (error) {
        console.error('ERROR DE REGISTRO', error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        const validatePassword = await bcrypt.compare(password, user.password);
        if(!validatePassword) return res.status(401).json({ error: "Credenciales inválidas" })
        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role 
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};