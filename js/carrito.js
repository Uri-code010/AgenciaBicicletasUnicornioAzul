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

        const indice = carrito.findIndex(
            producto => producto.nombre === nombre 
        );
        //condicion s
        if(indice >= 0) {
            carrito[indice].cantidad ++;
        } else {
            carrito.push({  
                nombre, 
                precio,
                cantidad: 1, 
                imagen:obtenerImagenProducto(nombre)
            });
        }
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
function vaciarCarrito(recargar = true) {

    const llaveCarrito = obtenerLlaveCarrito();

    if (llaveCarrito) {

        localStorage.removeItem(llaveCarrito);

    }

    if(recargar){
        location.reload();
    }

}

//obtener imagen del producto
function obtenerImagenProducto(nombre){
    //menu
    switch(nombre){
        case "Bicicleta de Montaña":
            return "img/mtb.jpg";
        case "Lechera":
                return "img/lechera.webp";
        case "Bicicleta Infantil":
                return "img/bici16.avif";
        case "Bicicleta BMX":
                return "img/bmx.webp";
        case "Bicicleta de Ruta":
                return "img/ruta.webp";
        case "Bicicleta Eléctrica":
                return "img/electrica.webp";
        case "Bicicleta Plegable":
                return "img/plegable.png";
        case "Bicicleta Urbana":
                return "img/urbana.webp";
        default:
                return "img/logo.jpg";
    }   
} 

// ===============================
// Aumentar cantidad
// ===============================
function aumentar(indice){
    const llaveCarrito = obtenerLlaveCarrito();
        let carrito = obtenerCarrito();

    carrito[indice].cantidad++;

    localStorage.setItem(
        llaveCarrito,
        JSON.stringify(carrito)
    );

    location.reload();

}


// ===============================
// Disminuir cantidad
// ===============================
function disminuir(indice){

    const llaveCarrito = obtenerLlaveCarrito();

    let carrito = obtenerCarrito();

    carrito[indice].cantidad--;

    if(carrito[indice].cantidad <= 0){

        carrito.splice(indice,1);

    }

    localStorage.setItem(
        llaveCarrito,
        JSON.stringify(carrito)
    );

    location.reload();

}


// ===============================
// Eliminar producto
// ===============================
function eliminarProducto(indice){

    const llaveCarrito = obtenerLlaveCarrito();

    let carrito = obtenerCarrito();

    carrito.splice(indice,1);

    localStorage.setItem(
        llaveCarrito,
        JSON.stringify(carrito)
    );

    location.reload();

}

//=========================
// FAVORITOS
//=========================

function agregarFavorito(nombre){

    const usuario =
    JSON.parse(localStorage.getItem("usuarioActual"));

    if(!usuario){

        alert("Debes iniciar sesión.");

        window.location.href="login.html";

        return;

    }

    const llave =
    "favoritos_" +
    usuario.correo.toLowerCase();

    let favoritos =
    JSON.parse(localStorage.getItem(llave)) || [];

    if(!favoritos.includes(nombre)){

        favoritos.push(nombre);

        localStorage.setItem(

            llave,

            JSON.stringify(favoritos)

        );

        alert("❤️ Producto agregado a favoritos");

    }

    else{

        alert("Este producto ya está en favoritos.");

    }

}