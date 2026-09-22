const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { getPool, sql } = require("./config/Db");
 
 
const app = express();

const origenesPermitidos = new Set([
    process.env.FRONTEND_ORIGIN,
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "null"
].filter(Boolean));

function esOrigenLocal(origen) {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen);
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origenesPermitidos.has(origin) || origin === "null" || esOrigenLocal(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origen no permitido por CORS."));
    },
    credentials: true // necesario para que el navegador envíe la cookie de sesión
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
 
app.use(session({
    secret: process.env.SESSION_SECRET || "cambia_esto_en_produccion",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,       // true solo si usas HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 8 // 8 horas
    }
}));
 
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
 
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/interacciones", require("./routes/interacciones"));
app.use("/api/metricas", require("./routes/metricas")); 
app.use("/api/usuarios", require("./routes/metricas"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/productos", require("./routes/productos"));
// Manejador de errores centralizado: cualquier next(err) cae aquí
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            status: "error",
            message: "El cuerpo de la petición no contiene un JSON válido. Envía un objeto JSON, no un texto entre comillas."
        });
    }

    console.error(err);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Error interno del servidor."
    });
});
 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(` API corriendo en http://localhost:${PORT}`);
});