// =========================================
// CARRITO DE COMPRAS
// Agencia de Bicicletas El Unicornio Azul
// =========================================

// Obtiene la llave del carrito del usuario actual
function obtenerLlaveCarrito() {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuario) {
        return null;
    }

    return "carrito_" + usuario.correo.toLowerCase();
}


// Agregar producto al carrito
function agregarCarrito(nombre, precio) {

    // Verificar sesión
    const sesionActiva =
        localStorage.getItem("sesionActiva");

    if (sesionActiva !== "true") {

        alert("Debes iniciar sesión para realizar compras.");

        window.location.href = "login.html";

        return;
    }

    const llaveCarrito = obtenerLlaveCarrito();

    let carrito =
        JSON.parse(localStorage.getItem(llaveCarrito)) || [];

    carrito.push({

        nombre: nombre,
        precio: precio

    });

    localStorage.setItem(
        llaveCarrito,
        JSON.stringify(carrito)
    );

    const mensaje =
        document.getElementById("mensajeCarrito");

    if (mensaje) {

        mensaje.innerHTML =
            `🛒 ${nombre} agregado al carrito`;

        mensaje.style.opacity = "1";

        setTimeout(() => {

            mensaje.style.opacity = "0";

        }, 3000);

    }

}


// Obtener carrito del usuario
function obtenerCarrito() {

    const llaveCarrito = obtenerLlaveCarrito();

    if (!llaveCarrito) {

        return [];

    }

    return JSON.parse(
        localStorage.getItem(llaveCarrito)
    ) || [];

}


// Vaciar carrito
function vaciarCarrito() {

    const llaveCarrito = obtenerLlaveCarrito();

    if (llaveCarrito) {

        localStorage.removeItem(llaveCarrito);

    }

    location.reload();

}