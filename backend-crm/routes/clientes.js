const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const interaccionController = require("../controllers/interaccionController..js");
const { reglasCliente, manejarErroresValidacion } = require("../middleware/validarCliente");
const { reglasEtapa, manejarErroresValidacion: manejarErroresEtapa } = require("../middleware/validarEtapa");
const { requireAuth, requireRole } = require("../middleware/auth");
 
router.get("/", requireAuth, clienteController.listar);
router.get("/:id", requireAuth, clienteController.obtenerPorId);
router.post("/", requireAuth, reglasCliente, manejarErroresValidacion, clienteController.crear);
router.put("/:id", requireAuth, reglasCliente, manejarErroresValidacion, clienteController.actualizar);
router.delete("/:id", requireRole("admin"), clienteController.eliminar);
 
// GET /api/clientes/:id/interacciones
router.get("/:id/interacciones", requireAuth, interaccionController.listarPorCliente);
 
// PUT /api/clientes/:id/etapa
router.put("/:id/etapa", requireAuth, reglasEtapa, manejarErroresEtapa, clienteController.actualizarEtapa);
 
module.exports = router;