const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
 
router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);
 
module.exports = router;
 