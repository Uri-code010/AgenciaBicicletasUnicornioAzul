//archivo que maneja la conexión de la base de datos y la creación del modelo de usuario
const bcrypt = require('bcrypt');
const { getPool, sql } = require("../config/Db");


async function crear({ nombre, correo, password, rol, permisos }) {
    const pool = await getPool();
    const password_hash = await bcrypt.hash(password, 10);
 
    const result = await pool.request()
        .input("nombre", sql.NVarChar(150), nombre)
        .input("correo", sql.NVarChar(150), correo)
        .input("password_hash", sql.NVarChar(255), password_hash)
        .input("rol", sql.NVarChar(20), rol || "cliente")
        .query(`
            INSERT INTO usuarios (nombre, correo, password_hash, rol)
            OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.correo, INSERTED.rol, INSERTED.fecha_creacion
            VALUES (@nombre, @correo, @password_hash, @rol)
        `);
    return result.recordset[0]; // nunca regresamos el password_hash al front-end
}

async function crearEmpleado({ nombre, correo, password, permisos, rol = "empleado" }) {
    const pool = await getPool();
    const passwordHash = await bcrypt.hash(password, 10);
    const permisosTexto = JSON.stringify(permisos || []);
    const result = await pool.request()
        .input("nombre", sql.NVarChar(150), nombre)
        .input("correo", sql.NVarChar(150), correo)
        .input("password_hash", sql.NVarChar(255), passwordHash)
        .input("rol", sql.NVarChar(20), rol)
        .input("permisos", sql.NVarChar(sql.MAX), permisosTexto)
        .query(`
            INSERT INTO usuarios (nombre, correo, password_hash, rol, permisos)
            OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.correo, INSERTED.rol, INSERTED.permisos, INSERTED.fecha_creacion
            VALUES (@nombre, @correo, @password_hash, @rol, @permisos)
        `);
    return result.recordset[0];
}

async function listarEmpleados() {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT id, nombre, correo, rol, permisos, fecha_creacion
        FROM usuarios
        WHERE id = @id AND rol = 'empleado'
        ORDER BY nombre
    `);
    return result.recordset;
}

async function actualizarPermisosEmpleado(id, permisos) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("permisos", sql.NVarChar(sql.MAX), JSON.stringify(permisos))
        .query(`
            UPDATE usuarios
            SET permisos = @permisos
            OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.correo, INSERTED.rol, INSERTED.permisos
            WHERE id = @id AND rol = 'empleado'
        `);
    return result.recordset[0] || null;
}

async function crearConCliente({ nombre, correo, password, telefono, rol }) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    const password_hash = await bcrypt.hash(password, 10);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request
            .input("nombre", sql.NVarChar(150), nombre)
            .input("correo", sql.NVarChar(150), correo)
            .input("telefono", sql.NVarChar(30), telefono || null)
            .input("password_hash", sql.NVarChar(255), password_hash)
            .input("rol", sql.NVarChar(20), rol || "cliente")
            .query(`
                INSERT INTO usuarios (nombre, correo, password_hash, rol)
                OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.correo, INSERTED.rol, INSERTED.fecha_creacion
                VALUES (@nombre, @correo, @password_hash, @rol)

                INSERT INTO clientes (nombre, correo, telefono, estado)
                SELECT @nombre, @correo, @telefono, 'activo'
                WHERE NOT EXISTS (
                    SELECT 1 FROM clientes WHERE correo = @correo
                )
            `);

        await transaction.commit();
        return result.recordset[0];
    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error("No se pudo revertir el registro", rollbackError);
        }
        throw err;
    }
}
 
async function buscarPorCorreo(correo) {
    const pool = await getPool();
    const result = await pool.request()
        .input("correo", sql.NVarChar(150), correo)
        .query(`
            SELECT u.*, c.telefono
            FROM usuarios u
            LEFT JOIN clientes c ON LOWER(c.correo) = LOWER(u.correo)
            WHERE LOWER(u.correo) = LOWER(@correo)
        `);
    return result.recordset[0] || null;
}

async function buscarPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT u.id, u.nombre, u.correo, u.rol, u.permisos, u.password_hash, c.telefono
            FROM usuarios u
            LEFT JOIN clientes c ON LOWER(c.correo) = LOWER(u.correo)
            WHERE u.id = @id
        `);
    return result.recordset[0] || null;
}

async function actualizarTelefonoPorCorreo(correo, telefono) {
    const pool = await getPool();
    const result = await pool.request()
        .input("correo", sql.NVarChar(150), correo)
        .input("telefono", sql.NVarChar(30), telefono || null)
        .query(`
            UPDATE clientes
            SET telefono = @telefono
            OUTPUT INSERTED.telefono
            WHERE LOWER(correo) = LOWER(@correo)
        `);
    return result.recordset[0] || null;
}

async function actualizarPassword(id, passwordHash) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("password_hash", sql.NVarChar(255), passwordHash)
        .query(`
            UPDATE usuarios
            SET password_hash = @password_hash
            OUTPUT INSERTED.id
            WHERE id = @id
        `);
    return result.recordset[0] || null;
}
 
async function verificarPassword(passwordPlano, passwordHash) {
    return bcrypt.compare(passwordPlano, passwordHash);
}
 
module.exports = { crear, crearEmpleado, listarEmpleados, actualizarPermisosEmpleado, crearConCliente, buscarPorCorreo, buscarPorId, actualizarTelefonoPorCorreo, actualizarPassword, verificarPassword };