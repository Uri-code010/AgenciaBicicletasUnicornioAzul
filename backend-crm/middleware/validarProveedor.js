const { body, validationResult } = require("express-validator");
 
const reglasProveedor = [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio."),
    body("correo").optional({ checkFalsy: true }).isEmail().withMessage("El correo no tiene un formato válido."),
    body("telefono").optional({ checkFalsy: true }).isString(),
    body("contacto").optional({ checkFalsy: true }).isString()
];
 
function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ status: "error", errores: errores.array() });
    }
    next();
}
 
module.exports = { reglasProveedor, manejarErroresValidacion };
 