const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const interaccionController = require("../controllers/interaccionController..js");
const { reglasCliente, manejarErroresValidacion } = require("../middleware/validarCliente");
const { reglasEtapa, manejarErroresValidacion: manejarErroresEtapa } = require("../middleware/validarEtapa");
const { requireAuth, requirePermission } = require("../middleware/auth");
 
router.get("/", requirePermission("clientes:ver"), clienteController.listar);
router.post("/sincronizar", requirePermission("clientes:editar"), clienteController.sincronizarUsuarios);
router.get("/:id", requirePermission("clientes:ver"), clienteController.obtenerPorId);
router.post("/", requirePermission("clientes:editar"), reglasCliente, manejarErroresValidacion, clienteController.crear);
router.put("/:id", requirePermission("clientes:editar"), reglasCliente, manejarErroresValidacion, clienteController.actualizar);
router.delete("/:id", requirePermission("clientes:editar"), clienteController.eliminar);
 
// GET /api/clientes/:id/interacciones
router.get("/:id/interacciones", requirePermission("clientes:ver"), interaccionController.listarPorCliente);
 
// PUT /api/clientes/:id/etapa
router.put("/:id/etapa", requirePermission("clientes:editar"), reglasEtapa, manejarErroresEtapa, clienteController.actualizarEtapa);
 
module.exports = router;