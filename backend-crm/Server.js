const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { getPool, sql } = require("./config/db");
 
const app = express();
 
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());
 
// Ruta de salud: confirma que la API y la conexión a la BD funcionan
app.get("/api/health", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT GETDATE() AS ahora");
        res.json({ status: "ok", dbTime: result.recordset[0].ahora });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});
 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
 