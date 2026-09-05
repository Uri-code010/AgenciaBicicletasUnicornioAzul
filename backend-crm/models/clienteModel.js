//clienteModel.js es para definir el modelo de datos del cliente, 
//incluye la estructura de la tabla y los métodos para interactuar con la base de datos 
// getpool en pocas palabras es para obtener la conexión de la bd. esta instrucción es para obtener la conexión a la base de datos y ejecutar consultas sql
const { getPool, sql, SQL_UNIQUE_VIOLATION  } = require("../config/Db");
//esta instrucción async function listar() es para listar todos los clientes de la bd, ordenados por fecha de registro descendente.
async function listar() {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT * FROM clientes
        ORDER BY fecha_registro DESC
    `);
    return result.recordset;
}
//obtener por id es para obtener un cliente por su id, si no existe devuelve null.
async function obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM clientes WHERE id = @id");
    return result.recordset[0] || null;
}
//esta instrucción sirve en pocas palabras, para crear un nuevo cliente en la base de datos, 
// recibe un objeto con los datos del cliente y los inserta en la tabla clientes. Si el correo ya existe, lanza un error con código 409 (conflicto).
async function crear({ nombre, correo, telefono, empresa, estado }) {
    const pool = await getPool();
    try {
        const result = await pool.request()
            .input("nombre", sql.NVarChar(150), nombre)
            .input("correo", sql.NVarChar(150), correo)
            .input("telefono", sql.NVarChar(30), telefono || null)
            .input("empresa", sql.NVarChar(150), empresa || null)
            .input("estado", sql.NVarChar(10), estado || "activo")
            .query(`
                INSERT INTO clientes (nombre, correo, telefono, empresa, estado)
                OUTPUT INSERTED.*
                VALUES (@nombre, @correo, @telefono, @empresa, @estado)
            `);
        return result.recordset[0];
    } catch (err) {
        if (SQL_UNIQUE_VIOLATION.includes(err.number)) {
            const e = new Error("Ya existe un cliente registrado con ese correo.");
            e.status = 409;
            throw e;
        }
        throw err;
    }
}
//esta instrucción async function actualizar() es para actualizar los datos de un cliente existente en la base de datos, 
// recibe el id del cliente y un objeto con los datos a actualizar. Si el correo ya existe, lanza un error con código 409 (conflicto).
async function actualizar(id, { nombre, correo, telefono, empresa, estado }) {
    const pool = await getPool();
    try {
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.NVarChar(150), nombre)
            .input("correo", sql.NVarChar(150), correo)
            .input("telefono", sql.NVarChar(30), telefono || null)
            .input("empresa", sql.NVarChar(150), empresa || null)
            .input("estado", sql.NVarChar(10), estado || "activo")
            .query(`
                UPDATE clientes
                SET nombre = @nombre,
                    correo = @correo,
                    telefono = @telefono,
                    empresa = @empresa,
                    estado = @estado
                OUTPUT INSERTED.*
                WHERE id = @id
            `);
        return result.recordset[0] || null;
    } catch (err) {
        if (SQL_UNIQUE_VIOLATION.includes(err.number)) {
            const e = new Error("Ya existe un cliente registrado con ese correo.");
            e.status = 409;
            throw e;
        }
        throw err;
    }
}

//esta instrucción async function eliminar() es para eliminar un cliente existente en la base de datos,
async function eliminar(id){
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM clientes
            OUTPUT DELETED.*
            WHERE id = @id
        `);
        return result.recordset[0] || null;

}
 
module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
 