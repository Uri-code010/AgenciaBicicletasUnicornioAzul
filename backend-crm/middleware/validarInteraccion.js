const { body, validationResult } = require("express-validator");

const TIPOS_VALIDOS = ["llamada", "correo", "reunión"];

const reglasInteraccion = [
    body("cliente_id")
        .notEmpty().withMessage("cliente_id es obligatorio.")
        .isInt().withMessage("cliente_id debe ser un número entero."),
    body("tipo")
        .trim()
        .toLowerCase()
        .isIn(TIPOS_VALIDOS).withMessage(`tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}.`),
    body("descripcion")
        .optional({ checkFalsy: true })
        .isString()
];

function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ status: "error", errores: errores.array() });
    }
    next();
}

module.exports = { reglasInteraccion, manejarErroresValidacion };