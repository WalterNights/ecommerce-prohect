const { body } = require('express-validator');

// Register Validatons
const registerValidator = [
    body('username')
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3 }).withMessage("El nombre de usuario debe tener al menos 3 caracteres"),
    body('email')
        .isEmail().withMessage("Debe ser un correo válido"),
    body('password')
        .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    /* body('role')
        .isIn(['admin', 'client']).withMessage("El rol debe ser admin o client"), */
];

// Login Validations
const loginValidator = [
    body('email')
        .isEmail().withMessage("Debe ser un correo válido"),
    body('password')
        .notEmpty().withMessage("La contraseña es obligatoria"),
];

// Porudcts Validation
const productValidator = [
  body("batch_number")
    .notEmpty().withMessage("El número de lote es obligatorio"),
  body("name")
    .notEmpty().withMessage("El nombre es obligatorio"),
  body("price")
    .isFloat({ gt: 0 }).withMessage("El precio debe ser mayor que 0"),
  body("stock")
    .isInt({ min: 0 }).withMessage("La cantidad debe ser un número entero mayor o igual a 0"),
  body("date_in")
    .isISO8601().withMessage("La fecha de ingreso debe ser una fecha válida"),
];

// Shopping Validations
const purchaseValidator = [
  body("products")
    .isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("products.*.productId")
    .isInt().withMessage("El ID del producto debe ser un número entero"),
  body("products.*.stock")
    .isInt({ gt: 0 }).withMessage("La cantidad debe ser mayor a 0"),
];

module.exports = {
    registerValidator,
    loginValidator,
    productValidator,
    purchaseValidator
};