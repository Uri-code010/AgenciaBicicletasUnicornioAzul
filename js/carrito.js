// =========================================
// CARRITO DE COMPRAS
// Agencia de Bicicletas El Unicornio Azul
// =========================================

//==============================
// OBTENER LLAVE DEL CARRITO
//==============================

function obtenerLlaveCarrito(){

    const usuario =
    JSON.parse(localStorage.getItem("usuarioActual"));

    if(!usuario){

        return null;

    }

    return "carrito_" + usuario.correo.toLowerCase();

}

//==============================
// OBTENER CARRITO
//==============================

function obtenerCarrito(){

    const llaveCarrito =
    obtenerLlaveCarrito();

    if(!llaveCarrito){

        return [];

    }

    return JSON.parse(

        localStorage.getItem(llaveCarrito)

    ) || [];

}

//==============================
// AGREGAR PRODUCTO
//==============================

function agregarCarrito(nombre,precio,categoria=""){

    const sesionActiva =
    localStorage.getItem("sesionActiva");

    if(sesionActiva!="true"){

        mostrarToast(

            "⚠ Debes iniciar sesión.",

            "advertencia"

        );

        window.location.href="login.html";

        return;

    }

    const llaveCarrito =
    obtenerLlaveCarrito();

    let carrito =
    obtenerCarrito();

    const indice =

    carrito.findIndex(

        producto=>producto.nombre==nombre

    );

    if(indice>=0){

        carrito[indice].cantidad++;

    }

    else{

        carrito.push({

            nombre:nombre,

            precio:precio,

            categoria:categoria,

            cantidad:1,

            imagen:

            obtenerImagenProducto(nombre)

        });

    }

    localStorage.setItem(

        llaveCarrito,

        JSON.stringify(carrito)

    );

    actualizarContadorCarrito();

    mostrarToast(

        "🛒 Producto agregado al carrito.",

        "exito"

    );

}

function comprarAhora(nombre,precio,categoria=""){

    const sesionActiva =
    localStorage.getItem("sesionActiva");

    if(sesionActiva!="true"){

        mostrarToast(

            "⚠ Debes iniciar sesión.",

            "advertencia"

        );

        window.location.href="login.html";

        return;

    }

    agregarCarrito(nombre,precio,categoria);

    setTimeout(()=>{

        window.location.href="checkout.html";

    },250);

}

//==============================
// VACIAR CARRITO
//==============================

function vaciarCarrito(){

    let carrito =

    obtenerCarrito();

    if(carrito.length==0){

        mostrarToast(

            "🛒 El carrito ya está vacío.",

            "info"

        );

        return;

    }

    mostrarConfirmacion(

        "¿Desea vaciar todo el carrito?",

        ()=>{

            const llaveCarrito =

            obtenerLlaveCarrito();

            localStorage.removeItem(

                llaveCarrito

            );

            actualizarContadorCarrito();

            mostrarToast(

                "🗑 Carrito vaciado correctamente.",

                "exito"

            );

            setTimeout(()=>{

                mostrarCarrito();

            },700);

        }

    );

    return;

    const llaveCarrito =

    obtenerLlaveCarrito();

    localStorage.removeItem(

        llaveCarrito

    );

    actualizarContadorCarrito();

    mostrarToast(

        "🗑 Carrito vaciado correctamente.",

        "exito"

    );

    setTimeout(()=>{

        mostrarCarrito();

    },700);

}

//==============================
// OBTENER IMAGEN DEL PRODUCTO
//==============================

function obtenerImagenProducto(nombre){

    switch(nombre){

        case "Bicicleta de Montaña":
            return "img/mtb.jpeg";

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

//==============================
// AUMENTAR CANTIDAD
//==============================

function aumentar(indice){

    const llaveCarrito =
    obtenerLlaveCarrito();

    let carrito =
    obtenerCarrito();

    carrito[indice].cantidad++;

    localStorage.setItem(

        llaveCarrito,

        JSON.stringify(carrito)

    );

    actualizarContadorCarrito();

    mostrarCarrito();

}

//==============================
// DISMINUIR CANTIDAD
//==============================

function disminuir(indice){

    const llaveCarrito =
    obtenerLlaveCarrito();

    let carrito =
    obtenerCarrito();

    carrito[indice].cantidad--;

    if(carrito[indice].cantidad<=0){

        carrito.splice(indice,1);

        mostrarToast(

            "🗑 Producto eliminado.",

            "info"

        );

    }

    localStorage.setItem(

        llaveCarrito,

        JSON.stringify(carrito)

    );

    actualizarContadorCarrito();

    mostrarCarrito();

}

//==============================
// ELIMINAR PRODUCTO
//==============================

function eliminarProducto(indice){

    const llaveCarrito =
    obtenerLlaveCarrito();

    let carrito =
    obtenerCarrito();

    carrito.splice(indice,1);

    localStorage.setItem(

        llaveCarrito,

        JSON.stringify(carrito)

    );

    actualizarContadorCarrito();

    mostrarToast(

        "🗑 Producto eliminado del carrito.",

        "info"

    );

    setTimeout(()=>{

        mostrarCarrito();

    },700);

}

//==============================
// FAVORITOS
//==============================

function agregarFavorito(nombre){

    const usuario =

    JSON.parse(

        localStorage.getItem("usuarioActual")

    );

    if(!usuario){

        mostrarToast(

            "⚠ Debes iniciar sesión.",

            "advertencia"

        );

        window.location.href="login.html";

        return;

    }

    const llave =

    "favoritos_" +

    usuario.correo.toLowerCase();

    let favoritos =

    JSON.parse(

        localStorage.getItem(llave)

    ) || [];

    if(!favoritos.includes(nombre)){

        favoritos.push(nombre);

        localStorage.setItem(

            llave,

            JSON.stringify(favoritos)

        );

        mostrarToast(

            "❤️ Producto agregado a favoritos.",

            "exito"

        );

    }

    else{

        mostrarToast(

            "ℹ Este producto ya está en favoritos.",

            "info"

        );

    }

}

//==============================
// CONTADOR DEL CARRITO
//==============================

function actualizarContadorCarrito(){

    const menu =

    document.getElementById("menuCarrito");

    if(!menu){

        return;

    }

    const carrito =

    obtenerCarrito();

    let cantidad = 0;

    carrito.forEach(producto=>{

        cantidad += producto.cantidad || 1;

    });

    menu.innerHTML =

    "🛒 Carrito (" + cantidad + ")";

}

actualizarContadorCarrito();