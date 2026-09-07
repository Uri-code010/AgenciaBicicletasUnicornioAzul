const { body, validationResult } = require("express-validator");
 
const ETAPAS_VALIDAS = ["Prospecto", "Activo", "Frecuente", "Inactivo"];
 
const reglasEtapa = [
    body("etapa_crm")
        .trim()
        .isIn(ETAPAS_VALIDAS).withMessage(`etapa_crm debe ser una de: ${ETAPAS_VALIDAS.join(", ")}.`)
];
 
function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ status: "error", errores: errores.array() });
    }
    next();
}
 
module.exports = { reglasEtapa, manejarErroresValidacion };
 