const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const interaccionController = require("../controllers/interaccionController..js");
const { reglasCliente, manejarErroresValidacion } = require("../middleware/validarCliente");
const { reglasEtapa, manejarErroresValidacion: manejarErroresEtapa } = require("../middleware/validarEtapa");
  
router.get("/", clienteController.listar);
router.get("/:id", clienteController.obtenerPorId); 
router.post("/", reglasCliente, manejarErroresValidacion, clienteController.crear);
router.put("/:id", reglasCliente, manejarErroresValidacion, clienteController.actualizar);
router.delete("/:id", clienteController.eliminar);
router.get("/:id/interacciones", interaccionController.listarPorCliente);
// PUT /api/clientes/:id/etapa
router.put("/:id/etapa", reglasEtapa, manejarErroresEtapa, clienteController.actualizarEtapa);
 
module.exports = router;
 