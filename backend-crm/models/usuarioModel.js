//archivo que maneja la conexión de la base de datos y la creación del modelo de usuario
const bcrypt = require('bcrypt');
const { getPool, sql } = require("../config/Db");


async function crear({ nombre, correo, password, rol }) {
    const pool = await getPool();
    const password_hash = await bcrypt.hash(password, 10);
 
    const result = await pool.request()
        .input("nombre", sql.NVarChar(150), nombre)
        .input("correo", sql.NVarChar(150), correo)
        .input("password_hash", sql.NVarChar(255), password_hash)
        .input("rol", sql.NVarChar(20), rol || "admin")
        .query(`
            INSERT INTO usuarios (nombre, correo, password_hash, rol)
            OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.correo, INSERTED.rol, INSERTED.fecha_creacion
            VALUES (@nombre, @correo, @password_hash, @rol)
        `);
    return result.recordset[0]; // nunca regresamos el password_hash al front-end
}
 
async function buscarPorCorreo(correo) {
    const pool = await getPool();
    const result = await pool.request()
        .input("correo", sql.NVarChar(150), correo)
        .query("SELECT * FROM usuarios WHERE correo = @correo");
    return result.recordset[0] || null;
}
 
async function verificarPassword(passwordPlano, passwordHash) {
    return bcrypt.compare(passwordPlano, passwordHash);
}
 
module.exports = { crear, buscarPorCorreo, verificarPassword };