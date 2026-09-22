const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);
router.put("/perfil", requireAuth, authController.actualizarPerfil);
router.put("/password", requireAuth, authController.cambiarPassword);
router.post("/empleados", requireRole("admin"), authController.crearEmpleado);
router.get("/empleados", requireRole("admin"), authController.listarEmpleados);
router.put("/empleados/:id/permisos", requireRole("admin"), authController.actualizarPermisosEmpleado);

module.exports = router;
 