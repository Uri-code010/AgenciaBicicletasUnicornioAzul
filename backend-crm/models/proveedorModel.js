const { getPool, sql } = require("../config/Db");
 
async function listar() {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM proveedores ORDER BY nombre");
    return result.recordset;
}
 
async function obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM proveedores WHERE id = @id");
    return result.recordset[0] || null;
}
 
async function crear({ nombre, contacto, correo, telefono }) {
    const pool = await getPool();
    const result = await pool.request()
        .input("nombre", sql.NVarChar(150), nombre)
        .input("contacto", sql.NVarChar(150), contacto || null)
        .input("correo", sql.NVarChar(150), correo || null)
        .input("telefono", sql.NVarChar(30), telefono || null)
        .query(`
            INSERT INTO proveedores (nombre, contacto, correo, telefono)
            OUTPUT INSERTED.*
            VALUES (@nombre, @contacto, @correo, @telefono)
        `);
    return result.recordset[0];
}
 
module.exports = { listar, obtenerPorId, crear };