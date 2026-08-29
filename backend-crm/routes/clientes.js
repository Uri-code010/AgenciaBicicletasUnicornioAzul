const express = require("express");
const { getPool, sql } = require("../config/Db");

const router = express.Router();

// GET /api/clientes - lista todos los clientes
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM Clientes ORDER BY Id DESC");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// GET /api/clientes/:id - obtiene un cliente por id
router.get("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM Clientes WHERE Id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ status: "error", message: "Cliente no encontrado" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// POST /api/clientes - crea un nuevo cliente
router.post("/", async (req, res) => {
    const { nombre, correo, telefono } = req.body;
    if (!nombre || !correo) {
        return res.status(400).json({ status: "error", message: "nombre y correo son obligatorios" });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("nombre", sql.NVarChar, nombre)
            .input("correo", sql.NVarChar, correo)
            .input("telefono", sql.NVarChar, telefono || null)
            .query(`INSERT INTO Clientes (Nombre, Correo, Telefono)
                    OUTPUT INSERTED.*
                    VALUES (@nombre, @correo, @telefono)`);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// PUT /api/clientes/:id - actualiza un cliente existente
router.put("/:id", async (req, res) => {
    const { nombre, correo, telefono } = req.body;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .input("nombre", sql.NVarChar, nombre)
            .input("correo", sql.NVarChar, correo)
            .input("telefono", sql.NVarChar, telefono || null)
            .query(`UPDATE Clientes
                    SET Nombre = @nombre, Correo = @correo, Telefono = @telefono
                    OUTPUT INSERTED.*
                    WHERE Id = @id`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ status: "error", message: "Cliente no encontrado" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// DELETE /api/clientes/:id - elimina un cliente
router.delete("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM Clientes WHERE Id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ status: "error", message: "Cliente no encontrado" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
