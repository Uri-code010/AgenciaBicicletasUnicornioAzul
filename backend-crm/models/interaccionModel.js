const { getPool, sql } = require("../config/Db");
 
async function crear({ cliente_id, tipo, descripcion, usuario_id }) {
    const pool = await getPool();
    const result = await pool.request()
        .input("cliente_id", sql.Int, cliente_id)
        .input("tipo", sql.NVarChar(30), tipo)
        .input("descripcion", sql.NVarChar(sql.MAX), descripcion || null)
        .input("usuario_id", sql.Int, usuario_id || null)
        .query(`
            INSERT INTO interacciones (cliente_id, tipo, descripcion, usuario_id)
            OUTPUT INSERTED.*
            VALUES (@cliente_id, @tipo, @descripcion, @usuario_id)
        `);
    return result.recordset[0];
}
 
async function listarPorCliente(clienteId) {
    const pool = await getPool();
    const result = await pool.request()
        .input("cliente_id", sql.Int, clienteId)
        .query(`
            SELECT * FROM interacciones
            WHERE cliente_id = @cliente_id
            ORDER BY fecha DESC
        `);
    return result.recordset;
}
 
module.exports = { crear, listarPorCliente };