//===============================
// ADMINISTRADOR DE PRODUCTOS
//===============================

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
    }
} catch (error) {
    productos = PRODUCTOS_INICIALES;
}

let indiceEditando = null;
const UMBRAL_STOCK_BAJO = 3;

function actualizarModoFormulario() {
    const botonSubmit = document.querySelector("#formProducto button[type='submit']");

    if (botonSubmit) {
        botonSubmit.textContent = indiceEditando === null
            ? "➕ Agregar Producto"
            : "✏️ Actualizar Producto";
    }
}

if(productos.length === 0){
    productos = PRODUCTOS_INICIALES;
}

//normalizar productos antiguos
productos.forEach(producto => {

    if(producto.existencia == undefined){

        producto.existencia = 10;

    }

    if(producto.estado == undefined){

        producto.estado = "Disponible";

    }

});

//guardar productos normalizados
localStorage.setItem(

    "productos",

    JSON.stringify(productos)

);

const tabla =
document.getElementById("tablaProductos");

mostrarProductos();
actualizarModoFormulario();
mostrarAlertasStockBajo();

function obtenerProductosStockBajo(){
    return productos.filter(producto => {
        const existencia = Number(producto.existencia || 0);
        return producto.estado !== "Inactivo" && existencia > 0 && existencia <= UMBRAL_STOCK_BAJO;
    });
}

function mostrarAlertasStockBajo(){
    const contenedor = document.getElementById("alertaStockBajo");
    const stockBajo = obtenerProductosStockBajo();

    if(!contenedor){
        return;
    }

    if(stockBajo.length === 0){
        contenedor.style.display = "none";
        contenedor.innerHTML = "";
        return;
    }

    const nombres = stockBajo.map(p => p.nombre).join(", ");
    contenedor.style.display = "block";
    contenedor.innerHTML = `⚠ Stock bajo (${stockBajo.length}): ${nombres}.`;
}

function parsearListaImagenes(texto){
    return texto
        .split(/[,;\n\r]+/)
        .map((imagen) => imagen.trim())
        .filter(Boolean);
}

function leerArchivosComoDataURL(archivos){
    return Promise.all(
        archivos.map((archivo)=>{
            return new Promise((resolve,reject)=>{
                const lector = new FileReader();

                lector.onload = () => resolve(lector.result);
                lector.onerror = () => reject(new Error("No se pudo leer una imagen seleccionada."));

                lector.readAsDataURL(archivo);
            });
        })
    );
}

function mostrarProductos(){

    tabla.innerHTML="";

    productos.forEach((producto,indice)=>{

        tabla.innerHTML+=`

            <tr>

                <td>

                    <img
                        src="${producto.imagen}"
                        class="miniProducto">

                </td>

                <td>

                    ${producto.nombre}

                </td>

                <td>

                    ${producto.categoria}

                </td>

                <td>

                    $${producto.precio}

                </td>

                <td>

                    ${producto.existencia}

                </td>

                <td>

                    <span class="${
                        producto.estado == "Disponible"
                        ? "estadoDisponible"
                        : "estadoAgotado"
                    }">

                        ${producto.estado}

                    </span>

                </td>

                <td>

                    <button
                        class="btnEditar"
                        onclick="editarProducto(${indice})">

                        ✏️

                    </button>

                    <button
                        class="btnEliminar"
                        onclick="eliminarProducto(${indice})">

                        🗑

                    </button>

                    <button
                        class="btnVer"
                        onclick="verProducto(${indice})">

                        👁

                    </button>

                </td>

        </tr>

        `;

    });

}

document
.getElementById("formProducto")
.addEventListener("submit",async function(e){

e.preventDefault();

const imagenPrincipal =
    document.getElementById("imagenProducto").value.trim();

const inputArchivos =
    document.getElementById("imagenesArchivosProducto");

const archivosSeleccionados =
    inputArchivos
    ?
    Array.from(inputArchivos.files || [])
    :
    [];

const imagenesAdicionales =
    parsearListaImagenes(
        document.getElementById("imagenesProducto").value
    );

let imagenesDesdeArchivos = [];

if(archivosSeleccionados.length > 0){
    try{
        imagenesDesdeArchivos = await leerArchivosComoDataURL(archivosSeleccionados);
    }
    catch(error){
        mostrarToast("❌ Ocurrió un problema al leer las imágenes seleccionadas.", "error");
        return;
    }
}

const primeraImagenArchivo = imagenesDesdeArchivos[0] || "";

const imagenBase = imagenPrincipal || primeraImagenArchivo || imagenesAdicionales[0] || "";
const galeriaUnica = Array.from(
    new Set([imagenBase, ...imagenesAdicionales, ...imagenesDesdeArchivos].filter(Boolean))
);

if(!imagenBase){
    mostrarToast("⚠ Agrega al menos una imagen por ruta o desde archivos.", "advertencia");
    return;
}

const nuevoProducto={
    nombre:
    document.getElementById("nombreProducto").value,

    categoria:
    document.getElementById("categoriaProducto").value,

    etiqueta:
    document.getElementById("etiquetaProducto").value,

    precio:Number(

        document.getElementById("precioProducto").value

    ),

    descripcion:
    document.getElementById("descripcionProducto").value,

    imagen: imagenBase,

    imagenes: galeriaUnica,

    existencia:Number(

        document.getElementById("existenciaProducto").value

    ),

    estado:
    document.getElementById("estadoProducto").value

};

if (indiceEditando !== null) {
    productos[indiceEditando] = nuevoProducto;
    mostrarToast("✅ Producto actualizado correctamente.", "exito");
    indiceEditando = null;
} else {
    productos.push(nuevoProducto);
    mostrarToast("✅ Producto agregado correctamente.", "exito");
}

localStorage.setItem(

"productos",

JSON.stringify(productos)

);

mostrarProductos();
mostrarAlertasStockBajo();
actualizarModoFormulario();

this.reset();

});

//==============================
// ELIMINAR PRODUCTO
//==============================

function eliminarProducto(indice){

    mostrarConfirmacion(

        "¿Eliminar este producto?",

        ()=>{

            productos.splice(indice,1);

            localStorage.setItem(

                "productos",

                JSON.stringify(productos)

            );

            mostrarProductos();
            mostrarAlertasStockBajo();

            mostrarToast("🗑 Producto eliminado correctamente.", "info");

        }

    );

}

//==============================
// EDITAR PRODUCTO
//==============================

function editarProducto(indice){

    const producto = productos[indice];

    indiceEditando = indice;

    document.getElementById("nombreProducto").value =
    producto.nombre;

    document.getElementById("precioProducto").value =
    producto.precio;

    document.getElementById("imagenProducto").value =
    producto.imagen;

    document.getElementById("imagenesProducto").value =
    Array.isArray(producto.imagenes)
        ? producto.imagenes.filter((imagen) => imagen !== producto.imagen).join("\n")
        : "";

    document.getElementById("categoriaProducto").value =
    producto.categoria;

    document.getElementById("etiquetaProducto").value =
    producto.etiqueta || "Ninguna";

    document.getElementById("descripcionProducto").value =
    producto.descripcion;

    document.getElementById("existenciaProducto").value =
    producto.existencia;

    document.getElementById("estadoProducto").value =
    producto.estado;

    actualizarModoFormulario();

    document.getElementById("nombreProducto").focus();

}

//==============================
// VER PRODUCTO
//==============================

function verProducto(indice){

    const producto = productos[indice];

    document.getElementById("detalleProducto").innerHTML = `

        <h2>${producto.nombre}</h2>

        <img
            src="${producto.imagen}">

        <p>

            <strong>Categoría:</strong>

            ${producto.categoria}

        </p>

        <p>

            <strong>Precio:</strong>

            $${producto.precio}

        </p>

        <p>

            <strong>Existencia:</strong>

            ${producto.existencia}

        </p>

        <p>

            <strong>Estado:</strong>

            ${producto.estado}

        </p>

        <hr>

        <p>

            ${producto.descripcion}

        </p>

    `;

    document.getElementById("modalProducto").style.display = "block";

}

//==============================
// CERRAR MODAL
//==============================

function cerrarModal(){

    document.getElementById("modalProducto").style.display = "none";

}

window.onclick = function(event){

    const modal =
    document.getElementById("modalProducto");

    if(event.target == modal){

        cerrarModal();

    }

}

//==============================
// BUSCAR PRODUCTO
//==============================

document
.getElementById("buscarProducto")
.addEventListener("keyup", buscarProductos);

function buscarProductos(){

    const texto =
    document
    .getElementById("buscarProducto")
    .value
    .toLowerCase()
    .trim();

    const filas =
    document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila=>{

        const nombre =
        fila.children[1].textContent.toLowerCase();

        const categoria =
        fila.children[2].textContent.toLowerCase();

        const precio =
        fila.children[3].textContent.toLowerCase();

        const existencia =
        fila.children[4].textContent.toLowerCase();

        const estado =
        fila.children[5].textContent.toLowerCase();

        const textoCompleto =

            nombre + " " +
            categoria + " " +
            precio + " " +
            existencia + " " +
            estado;

        if(textoCompleto.includes(texto)){

            fila.style.display = "";

        }

        else{

            fila.style.display = "none";

        }

    });

}