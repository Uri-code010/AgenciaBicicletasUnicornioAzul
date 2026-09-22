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

async function listarPorUsuario(usuarioId) {
    const pool = await getPool();
    const result = await pool.request()
        .input("usuario_id", sql.Int, usuarioId)
        .query(`
            SELECT i.id, i.tipo, i.descripcion, i.fecha,
                   c.id AS cliente_id, c.nombre AS cliente_nombre
            FROM interacciones i
            JOIN clientes c ON c.id = i.cliente_id
            WHERE i.usuario_id = @usuario_id
            ORDER BY i.fecha DESC
        `);
    return result.recordset;
}

async function listarSolicitudes() {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT i.id, i.tipo, i.descripcion, i.fecha,
             COALESCE(c.id, i.cliente_id) AS cliente_id,
             COALESCE(c.nombre, i.nombre_contacto) AS cliente_nombre,
             COALESCE(c.correo, i.correo_contacto) AS cliente_correo,
             i.nombre_contacto, i.correo_contacto, i.telefono_contacto,
               u.nombre AS usuario_nombre
        FROM interacciones i
         LEFT JOIN clientes c ON c.id = i.cliente_id
        LEFT JOIN usuarios u ON u.id = i.usuario_id
        WHERE i.tipo IN ('petición', 'contacto')
        ORDER BY i.fecha DESC
    `);
    return result.recordset;
}

async function crearContacto({ nombre, correo, telefono, descripcion, usuario_id, cliente_id }) {
    const pool = await getPool();
    const result = await pool.request()
        .input("cliente_id", sql.Int, cliente_id || null)
        .input("tipo", sql.NVarChar(30), "contacto")
        .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
        .input("usuario_id", sql.Int, usuario_id || null)
        .input("nombre", sql.NVarChar(150), nombre)
        .input("correo", sql.NVarChar(150), correo)
        .input("telefono", sql.NVarChar(30), telefono || null)
        .query(`
            INSERT INTO interacciones (cliente_id, tipo, descripcion, usuario_id, nombre_contacto, correo_contacto, telefono_contacto)
            OUTPUT INSERTED.*
            VALUES (@cliente_id, @tipo, @descripcion, @usuario_id, @nombre, @correo, @telefono)
        `);
    return result.recordset[0];
}

module.exports = { crear, listarPorCliente, listarPorUsuario, listarSolicitudes, crearContacto };