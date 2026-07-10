// =========================================
// BUSCADOR Y FILTROS DEL CATÁLOGO
// =========================================

let buscador;

// Esperar a que cargue el HTML
document.addEventListener("DOMContentLoaded", function () {

    buscador = document.getElementById("buscar");

    if (buscador) {

        buscador.addEventListener("input", buscarProductos);

    }

    actualizarContador();

});

// Buscar productos
function buscarProductos() {

    const texto = (buscador?.value || "").trim().toLowerCase();

    if (typeof aplicarFiltros === "function") {

        if (typeof textoBusqueda !== "undefined") {
            textoBusqueda = texto;
        }

        aplicarFiltros();
        return;

    }

    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {

        const nombre = (producto.dataset.nombre || "").toLowerCase();

        producto.style.display = nombre.includes(texto) ? "block" : "none";

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