const { getPool, sql } = require("../config/Db");

async function totalClientes() {
    const pool = await getPool();
    const result = await pool.request().query("SELECT COUNT(*) AS total FROM clientes");
    return result.recordset[0].total;
}

async function clientesPorEstado() {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT estado, COUNT(*) AS total
        FROM clientes
        GROUP BY estado
    `);
    // Normalizamos para que siempre vengan las dos llaves, aunque alguna tenga 0
    const resumen = { activo: 0, inactivo: 0 };
    result.recordset.forEach(fila => {
        resumen[fila.estado] = fila.total;
    });
    return resumen;
}

async function interaccionesPorCliente() {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT c.id, c.nombre, COUNT(i.id) AS total_interacciones
        FROM clientes c
        LEFT JOIN interacciones i ON i.cliente_id = c.id
        GROUP BY c.id, c.nombre
        ORDER BY total_interacciones DESC
    `);
    return result.recordset;
}

async function clientesSinInteraccionReciente(diasSinInteraccion = 30) {
    const pool = await getPool();
    const result = await pool.request()
        .input("dias", sql.Int, diasSinInteraccion)
        .query(`
            SELECT c.id, c.nombre, c.correo, MAX(i.fecha) AS ultima_interaccion
            FROM clientes c
            LEFT JOIN interacciones i ON i.cliente_id = c.id
            GROUP BY c.id, c.nombre, c.correo
            HAVING MAX(i.fecha) IS NULL
                OR MAX(i.fecha) < DATEADD(DAY, -@dias, GETDATE())
        `);
    return result.recordset;
}

module.exports = { totalClientes, clientesPorEstado, interaccionesPorCliente, clientesSinInteraccionReciente };