//clienteModel.js es para definir el modelo de datos del cliente, 
//incluye la estructura de la tabla y los métodos para interactuar con la base de datos 
const { getPool, sql } = require("../config/Db");

const SQL_UNIQUE_VIOLATION =  [2627, 2601]; // codigo de error de violación de clave unica en sql server

async function listarClientes() {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Clientes");
    return result.recordset;
}