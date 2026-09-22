const { body, validationResult } = require("express-validator");
 
const reglasProducto = [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio."),
    body("categoria").optional({ checkFalsy: true }).isString(),
    body("stock_actual").optional().isInt({ min: 0 }).withMessage("stock_actual debe ser un número entero >= 0."),
    body("stock_minimo").optional().isInt({ min: 0 }).withMessage("stock_minimo debe ser un número entero >= 0."),
    body("proveedor_id").optional({ checkFalsy: true }).isInt().withMessage("proveedor_id debe ser un número entero."),
    body("costo_unitario").optional().isFloat({ min: 0 }).withMessage("costo_unitario debe ser un número >= 0.")
];
 
function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ status: "error", errores: errores.array() });
    }
    next();
}
 
module.exports = { reglasProducto, manejarErroresValidacion };
 