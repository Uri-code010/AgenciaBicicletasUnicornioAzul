const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { reglasCliente, manejarErroresValidacion } = require("../middleware/validarCliente");
 
router.get("/", clienteController.listar);
router.post("/", reglasCliente, manejarErroresValidacion, clienteController.crear);
router.put("/:id", reglasCliente, manejarErroresValidacion, clienteController.actualizar);
 
module.exports = router;
 