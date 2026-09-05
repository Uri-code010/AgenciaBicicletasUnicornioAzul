//archivo clientecontroller.js sirve en pocas palabras y sencillas, para manejar las solicitudes http relacionadas con los clientes, como listar, crear y acutalizar clientes. 
// Este archivo actúa como intermediario entre las rutas y el modelo de datos, procesando las solicitudes entrantes, llamando a los métodos del modelo y enviando las respuestas adecuadas al cliente.

//instrucción sirve para importar el modelo de cliente, que contiene las funciones para interactuar con la base de datos.
const clienteModel = require("../models/clienteModel");
//esta instruccion async function listar() es para manejar la solicitud de listar todos los clientes, llama al método listar del modelo y devuelve la lista de cliente en formato JSON.
//  Si ocurre un error, lo pasa al siguiente middleware de manejo de errores.
async function listar(req, res, next) {
    try {
        const clientes = await clienteModel.listar();
        res.json(clientes);
    } catch (err) {
        next(err);
    }
}
//obtener por id es para manejar la solicitud de obtener un cliente por su id, 
// llama al método obtenerPorId del modelo y devuelve el cliente en formato JSON. Si el cliente no existe, devuelve un error 404 (no encontrado).
async function obtenerPorId(req, res, next) {
    try {
        const cliente = await clienteModel.obtenerPorId(req.params.id);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "Cliente no encontrado." });
        }
        res.json(cliente);
    } catch (err) {
        next(err);
    }
}
 
//maneja la solicitud de crear un nuevo cliente, llama al metodo crear del modelo con los datos recibidos en el cuerpo de la solicitud y devuelve el cliente creado en formato JSON con un código de estado 201 (creado).
//  Si ocurre un error, lo pasa al siguiente middleware de manejo de errores.
async function crear(req, res, next) {
    try {
        const cliente = await clienteModel.crear(req.body);
        res.status(201).json(cliente);
    } catch (err) {
        next(err);
    }
}
//maneja la solicitud de actualizar un cliente existente, llama al método actualizar del modelo con el id del cliente y los datos recibidos en el cuerpo de la solicitud.
async function actualizar(req, res, next) {
    try {
        const cliente = await clienteModel.actualizar(req.params.id, req.body);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "Cliente no encontrado." });
        }
        res.json(cliente);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next){
    //maneja la solicitud de eliminar un cliente existente, llama al método eliminar del modelo con el id de cliente recibido
    try{
        const cliente = await clienteModel.eliminar(req.params.id);
        if(!cliente){
            return res.status(404).json({status: "error", message: "Cliente no encontrado."});
        }
        res.status(204).send();
    } catch(err){
        next(err);
    }
}
module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };