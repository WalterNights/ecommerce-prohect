const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
}

module.exports = handleValidation;