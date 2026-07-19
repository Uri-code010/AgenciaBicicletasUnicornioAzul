//===============================
// ADMINISTRADOR DE PRODUCTOS
//===============================

let productos =
JSON.parse(localStorage.getItem("productos")) || [];

let indiceEditando = null;

function actualizarModoFormulario() {
    const botonSubmit = document.querySelector("#formProducto button[type='submit']");

    if (botonSubmit) {
        botonSubmit.textContent = indiceEditando === null
            ? "➕ Agregar Producto"
            : "✏️ Actualizar Producto";
    }
}

if(productos.length === 0){
    productos = [
        {
            nombre: "Bicicleta Infantil",
            categoria: "Infantil",
            etiqueta: "Nuevo",
            precio: 1500,
            descripcion: "Bicicleta ideal para niños y niñas que están aprendiendo a montar. Diseño seguro, ligero y resistente.",
            imagen: "img/bici16.avif",
            existencia: 10,
            estado: "Disponible"
        }
    ];
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
.addEventListener("submit",function(e){

e.preventDefault();

const imagenPrincipal =
    document.getElementById("imagenProducto").value.trim();

const imagenesAdicionales =
    document.getElementById("imagenesProducto")
        .value
        .split(",")
        .map((imagen) => imagen.trim())
        .filter(Boolean);

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

    imagen: imagenPrincipal,

    imagenes: imagenesAdicionales.length > 0
        ? [imagenPrincipal, ...imagenesAdicionales].filter(Boolean)
        : [imagenPrincipal],

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
        ? producto.imagenes.filter((imagen) => imagen !== producto.imagen).join(", ")
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

    buscarProductos();

}