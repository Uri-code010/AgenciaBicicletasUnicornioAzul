// =========================================
// BUSCADOR Y FILTROS DEL CATÁLOGO
// =========================================

let buscador;

// Esperar a que cargue el HTML
document.addEventListener("DOMContentLoaded", function () {

    buscador = document.getElementById("buscar");

    if (buscador) {

        buscador.addEventListener("keyup", buscarProductos);

    }

    actualizarContador();

});


// Buscar productos
function buscarProductos() {

    const texto = buscador.value.toLowerCase();

    const productos = document.querySelectorAll(".producto");
    //para cada prducto, 
    // se obtiene el nombre del producto y se compara con el texto ingresado en el buscador. 
    productos.forEach(producto => {

        const nombre = (producto.dataset.nombre || "").toLowerCase();

        if (nombre.includes(texto)) {

            producto.style.display = "block";

        } else {

            producto.style.display = "none";

        }

    });

    actualizarContador();

}


// Filtrar productos
function filtrar(categoria) {

    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {

        if (categoria == "todos") {

            producto.style.display = "block";

        }

        else if (producto.dataset.categoria == categoria) {

            producto.style.display = "block";

        }

        else {

            producto.style.display = "none";

        }

    });

    actualizarContador();

}


// Contador
function actualizarContador() {

    const productos = document.querySelectorAll(".producto");

    let visibles = 0;

    productos.forEach(producto => {

        if (producto.style.display != "none") {

            visibles++;

        }

    });

    const contador = document.getElementById("contadorProductos");

    if (contador) {

        contador.innerHTML = "Se encontraron " + visibles + " productos";

    }

}