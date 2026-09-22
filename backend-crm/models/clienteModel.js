//clienteModel.js es para definir el modelo de datos del cliente, 
//incluye la estructura de la tabla y los métodos para interactuar con la base de datos 
// getpool en pocas palabras es para obtener la conexión de la bd. esta instrucción es para obtener la conexión a la base de datos y ejecutar consultas sql
const { getPool, sql, SQL_UNIQUE_VIOLATION  } = require("../config/Db");
//esta instrucción async function listar() es para listar todos los clientes de la bd, ordenados por fecha de registro descendente.
async function listar() {
    const pool = await getPool();
    await pool.request().query(`
        INSERT INTO clientes (nombre, correo, estado)
        SELECT u.nombre, u.correo, 'activo'
        FROM usuarios u
        WHERE u.rol <> 'admin'
          AND NOT EXISTS (
              SELECT 1 FROM clientes c WHERE LOWER(c.correo) = LOWER(u.correo)
          )
    `);

    const result = await pool.request().query(`
        SELECT * FROM clientes
        ORDER BY fecha_registro DESC
    `);
    return result.recordset;
}

async function sincronizarUsuarios(usuarios) {
    const pool = await getPool();

    for (const usuario of usuarios) {
        await pool.request()
            .input("nombre", sql.NVarChar(150), usuario.nombre)
            .input("correo", sql.NVarChar(150), usuario.correo.toLowerCase())
            .input("telefono", sql.NVarChar(30), usuario.telefono || null)
            .query(`
                INSERT INTO clientes (nombre, correo, telefono, estado)
                SELECT @nombre, @correo, @telefono, 'activo'
                WHERE NOT EXISTS (
                    SELECT 1 FROM clientes WHERE LOWER(correo) = @correo
                )
            `);
    }
}
//obtener por id es para obtener un cliente por su id, si no existe devuelve null.
async function obtenerPorId(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM clientes WHERE id = @id");
    return result.recordset[0] || null;
}

async function obtenerPorCorreo(correo) {
    const pool = await getPool();
    const result = await pool.request()
        .input("correo", sql.NVarChar(150), correo)
        .query("SELECT * FROM clientes WHERE LOWER(correo) = LOWER(@correo)");
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
 
async function actualizarEtapa(id, etapa_crm) {
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("etapa_crm", sql.NVarChar(20), etapa_crm)
        .query(`
            UPDATE clientes
            SET etapa_crm = @etapa_crm
            OUTPUT INSERTED.*
            WHERE id = @id
        `);
    return result.recordset[0] || null;
}
 
async function eliminar(id) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const clienteResult = await new sql.Request(transaction)
            .input("id", sql.Int, id)
            .query("SELECT id, correo FROM clientes WHERE id = @id");

        const cliente = clienteResult.recordset[0];
        if (!cliente) {
            await transaction.rollback();
            return null;
        }

        await new sql.Request(transaction)
            .input("cliente_id", sql.Int, id)
            .query("DELETE FROM interacciones WHERE cliente_id = @cliente_id");

        await new sql.Request(transaction)
            .input("id", sql.Int, id)
            .query("DELETE FROM clientes WHERE id = @id");

        await new sql.Request(transaction)
            .input("correo", sql.NVarChar(150), cliente.correo)
            .query("DELETE FROM usuarios WHERE LOWER(correo) = LOWER(@correo) AND rol <> 'admin'");

        await transaction.commit();
        return cliente;
    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error("No se pudo revertir la eliminación", rollbackError);
        }
        throw err;
    }
}

module.exports = { listar, sincronizarUsuarios, obtenerPorId, obtenerPorCorreo, crear, actualizar, eliminar, actualizarEtapa };
 