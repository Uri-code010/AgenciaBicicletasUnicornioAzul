const { getPool, sql } = require("../config/Db");
 
async function listar({ estrategia } = {}) {
    const pool = await getPool();
    const request = pool.request();
 
    let where = "WHERE 1=1";
    if (estrategia) {
        request.input("estrategia", sql.NVarChar(10), estrategia);
        where += " AND estrategia_logistica = @estrategia";
    }
 
    const result = await request.query(`
        SELECT p.*, pr.nombre AS proveedor_nombre
        FROM productos p
        LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
        ${where}
        ORDER BY p.nombre
    `);
    return result.recordset;
}
 
async function obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT p.*, pr.nombre AS proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
            WHERE p.id = @id
        `);
    return result.recordset[0] || null;
}
 
async function crear({ nombre, descripcion, categoria, stock_actual, stock_minimo, proveedor_id, costo_unitario }) {
    const pool = await getPool();
    const result = await pool.request()
        .input("nombre", sql.NVarChar(150), nombre)
        .input("descripcion", sql.NVarChar(sql.MAX), descripcion || null)
        .input("categoria", sql.NVarChar(100), categoria || null)
        .input("stock_actual", sql.Int, stock_actual || 0)
        .input("stock_minimo", sql.Int, stock_minimo || 0)
        .input("proveedor_id", sql.Int, proveedor_id || null)
        .input("costo_unitario", sql.Decimal(10, 2), costo_unitario || 0)
        .query(`
            INSERT INTO productos (nombre, descripcion, categoria, stock_actual, stock_minimo, proveedor_id, costo_unitario)
            OUTPUT INSERTED.*
            VALUES (@nombre, @descripcion, @categoria, @stock_actual, @stock_minimo, @proveedor_id, @costo_unitario)
        `);
    return result.recordset[0];
}
 
async function actualizar(id, { nombre, descripcion, categoria, stock_actual, stock_minimo, proveedor_id, costo_unitario }) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("nombre", sql.NVarChar(150), nombre)
        .input("descripcion", sql.NVarChar(sql.MAX), descripcion || null)
        .input("categoria", sql.NVarChar(100), categoria || null)
        .input("stock_actual", sql.Int, stock_actual || 0)
        .input("stock_minimo", sql.Int, stock_minimo || 0)
        .input("proveedor_id", sql.Int, proveedor_id || null)
        .input("costo_unitario", sql.Decimal(10, 2), costo_unitario || 0)
        .query(`
            UPDATE productos
            SET nombre = @nombre,
                descripcion = @descripcion,
                categoria = @categoria,
                stock_actual = @stock_actual,
                stock_minimo = @stock_minimo,
                proveedor_id = @proveedor_id,
                costo_unitario = @costo_unitario
            OUTPUT INSERTED.*
            WHERE id = @id
        `);
    return result.recordset[0] || null;
}
 
async function eliminar(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM productos OUTPUT DELETED.id WHERE id = @id");
    return result.recordset[0] || null;
}
 
module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };