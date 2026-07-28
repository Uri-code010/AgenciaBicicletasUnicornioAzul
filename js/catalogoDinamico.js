//====================================
// CATÁLOGO DINÁMICO
//====================================

const PRODUCTOS_INICIALES = [
    {
        nombre: "Bicicleta Urbana",
        categoria: "Urbana",
        etiqueta: "Popular",
        precio: 1800,
        descripcion: "Diseño cómodo y práctico para ciudad, desplazamientos diarios y paseo.",
        imagen: "img/bici16.avif",
        existencia: 8,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta Ruta",
        categoria: "Ruta",
        etiqueta: "Nuevo",
        precio: 3200,
        descripcion: "Ligera y veloz para rutas, entrenamientos y recorridos largos.",
        imagen: "img/bici162.avif",
        existencia: 5,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta MTB",
        categoria: "MTB",
        etiqueta: "Destacada",
        precio: 3600,
        descripcion: "Ideal para terrenos irregulares, montaña y aventuras fuera de la ciudad.",
        imagen: "img/bici163.avif",
        existencia: 6,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta Eléctrica",
        categoria: "Eléctrica",
        etiqueta: "Eco",
        precio: 4800,
        descripcion: "Potencia y confort para trayectos largos con menos esfuerzo.",
        imagen: "img/bici16.avif",
        existencia: 4,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta Infantil",
        categoria: "Infantil",
        etiqueta: "Nuevo",
        precio: 1500,
        descripcion: "Segura, ligera y perfecta para aprender a pedalear con confianza.",
        imagen: "img/bici162.avif",
        existencia: 10,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta Plegable",
        categoria: "Plegable",
        etiqueta: "Oferta",
        precio: 2200,
        descripcion: "Compacta y fácil de guardar, ideal para transporte y uso diario.",
        imagen: "img/bici163.avif",
        existencia: 7,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta BMX",
        categoria: "BMX",
        etiqueta: "Popular",
        precio: 2100,
        descripcion: "Diseñada para trucos, urbanismo y un estilo muy dinámico.",
        imagen: "img/bici16.avif",
        existencia: 5,
        estado: "Disponible"
    },
    {
        nombre: "Bicicleta Lechera",
        categoria: "Lechera",
        etiqueta: "Clásica",
        precio: 1700,
        descripcion: "Cómoda y resistente, perfecta para trayectos sencillos y paseo.",
        imagen: "img/bici162.avif",
        existencia: 9,
        estado: "Disponible"
    }
];

let productos = [];

try {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));

    if (Array.isArray(productosGuardados) && productosGuardados.length > 0) {
        productos = productosGuardados;
    } else {
        productos = PRODUCTOS_INICIALES;
        localStorage.setItem("productos", JSON.stringify(productos));
    }
} catch (error) {
    productos = PRODUCTOS_INICIALES;
    localStorage.setItem("productos", JSON.stringify(productos));
}

//===============================
// PROMOCIONES
//===============================

let promociones =

JSON.parse(

localStorage.getItem("promociones")

) || [];

const catalogo =
document.getElementById("catalogo");
let categoriaActual = "todos";

let etiquetaActual = "todas";

let textoBusqueda = "";
const UMBRAL_STOCK_BAJO = 3;

function mostrarAlertaStockAdminCatalogo(){

    const alerta = document.getElementById("alertaStockAdminCatalogo");

    if(!alerta){
        return;
    }

    let usuarioActual = null;

    try{
        usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    }
    catch(error){
        usuarioActual = null;
    }

    if(!usuarioActual || usuarioActual.rol !== "admin"){
        alerta.style.display = "none";
        alerta.innerHTML = "";
        return;
    }

    const stockBajo = productos.filter(producto => {
        const existencia = Number(producto.existencia || 0);
        return producto.estado !== "Inactivo" && existencia > 0 && existencia <= UMBRAL_STOCK_BAJO;
    });

    if(stockBajo.length === 0){
        alerta.style.display = "none";
        alerta.innerHTML = "";
        return;
    }

    const nombres = stockBajo.map(p => p.nombre).join(", ");

    alerta.style.display = "block";
    alerta.innerHTML = `⚠ Stock bajo detectado (${stockBajo.length}): ${nombres}.`;
}
//====================================
// MOSTRAR CATÁLOGO
//====================================

function mostrarCatalogo(){

    catalogo.innerHTML = "";

    // Solo mostrar productos que NO estén inactivos
    const productosVisibles =
    productos.filter(producto =>

        producto.estado !== "Inactivo"

    );

    productosVisibles.forEach(producto=>{
        //buscar promocion para el producto
        const promocion =

        promociones.find(p=>

        p.categoria == producto.categoria

        );

        let precioMostrar =
        producto.precio;

        let porcentaje = 0;

        if(promocion){

            porcentaje =
            promocion.descuento;

            precioMostrar =
            producto.precio -

            (producto.precio * porcentaje /100);

        }
        const etiquetaVisible =
        typeof producto.etiqueta === "string"
            ? producto.etiqueta.trim()
            : "";

        const etiquetaNormalizada =
        etiquetaVisible && etiquetaVisible.toLowerCase() !== "ninguna"
            ? etiquetaVisible.toLowerCase()
            : "ninguna";

        catalogo.innerHTML += `

        <div
            class="producto"

            data-categoria="${producto.categoria.toLowerCase()}"

            data-etiqueta="${etiquetaNormalizada}"

            data-nombre="${producto.nombre.toLowerCase()}">

            ${

                etiquetaVisible &&
                etiquetaVisible.toLowerCase() !== "ninguna"

                ?

                `<span class="etiqueta ${etiquetaNormalizada}">

                ${etiquetaVisible}

                </span>`

                :

                ""

            }

           
            ${
                producto.estado == "Agotado"

                ?

                `<span class="etiquetaAgotado">

                    AGOTADO

                </span>`

                :

                ""

            }

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}">

            <h3>

                ${producto.nombre}

            </h3>

            <p>

                ${producto.descripcion}

            </p>

            <h4>

                ${
                    promocion
                    ?

                    `

                    <p class="precioAnterior">

                    $${producto.precio}

                    </p>

                    <h4 class="precioOferta">

                    $${precioMostrar.toFixed(2)}

                    </h4>

                    <p class="promoActiva">

                    🔥 ${porcentaje}% OFF

                    </p>

                    `

                    :

                    `

                    <h4>

                    $${producto.precio}

                    </h4>

                    `

                }

            </h4>

            <p>

                Existencia:
                <strong>

                    ${producto.existencia}

                </strong>

            </p>

            <div class="accionesProducto">

                <button
                    onclick="window.location.href='detalleProducto.html?nombre=${encodeURIComponent(producto.nombre)}'">

                    Ver detalle

                </button>

                ${
                    producto.estado == "Agotado"

                    ?

                    `

                    <button
                        class="btnAgotado"
                        disabled>

                        Agotado

                    </button>

                    `

                    :

                    `

                    <button
                        onclick="agregarCarrito('${producto.nombre}', ${precioMostrar}, '${producto.categoria}')">

                        Agregar al carrito

                    </button>

                    <button
                        onclick="comprarAhora('${producto.nombre}', ${precioMostrar}, '${producto.categoria}')">

                        Comprar ahora

                    </button>

                    `

                }

            </div>

        </div>

        `;

    });

    actualizarContador();
    mostrarAlertaStockAdminCatalogo();

}
//Filtrar categoria

function filtrarCategoria(categoria){

    categoriaActual = categoria;

    aplicarFiltros();

}


//filtrar etiqueta
function filtrarEtiqueta(etiqueta){

    etiquetaActual = etiqueta.toLowerCase();

    aplicarFiltros();

}

//aplicar filtros 
function aplicarFiltros(){

    const tarjetas =

    document.querySelectorAll(".producto");

    let encontrados = 0;

    tarjetas.forEach(tarjeta=>{

        const categoria =

        tarjeta.dataset.categoria;

        const etiqueta =

        tarjeta.dataset.etiqueta;

        const nombre =

        tarjeta.dataset.nombre;

        const coincideCategoria =

        categoriaActual=="todos"

        ||

        categoria==categoriaActual;

        const coincideEtiqueta =

        etiquetaActual=="todas"

        ||

        etiqueta==etiquetaActual;

        const coincideBusqueda =

        nombre.includes(textoBusqueda);

        const coincide =

        coincideCategoria

        &&

        coincideEtiqueta

        &&

        coincideBusqueda;

        tarjeta.style.display = coincide ? "block" : "none";

        if(coincide){

            encontrados++;

        }

    });

    const mensajeSinResultados = document.getElementById("mensajeSinResultados");

    if(encontrados===0){

        const etiquetaTexto = etiquetaActual == "todas"
            ? "todos los productos"
            : etiquetaActual.charAt(0).toUpperCase() + etiquetaActual.slice(1);

        mostrarToast(
            `No se encontró por el momento la etiqueta "${etiquetaTexto}".`,
            "info"
        );

        if(mensajeSinResultados){
            mensajeSinResultados.style.display = "block";
            mensajeSinResultados.innerHTML = `No se encontró por el momento la etiqueta "${etiquetaTexto}".`;
        }

        document.getElementById("contadorProductos").innerHTML =

        `No se encontró por el momento la etiqueta "${etiquetaTexto}".`;

    }

    else{

        if(mensajeSinResultados){
            mensajeSinResultados.style.display = "none";
            mensajeSinResultados.innerHTML = "";
        }

        document.getElementById(

            "contadorProductos"

        ).innerHTML =

        "Se encontraron "

        +

        encontrados

        +

        " productos";

    }

}


//====================================
// CONTADOR DE PRODUCTOS
//====================================

function actualizarContador(mensaje = null){

    const productos =
    document.querySelectorAll(".producto");

    const visibles =
    Array.from(productos).filter(producto =>

        producto.style.display !== "none"

    ).length;

    document.getElementById("contadorProductos").innerHTML =

    mensaje ||

    "Se encontraron " +

    visibles +

    " productos";

}

mostrarCatalogo();