//===============================
// ADMINISTRADOR DE PRODUCTOS
//===============================

let productos =
JSON.parse(localStorage.getItem("productos")) || [];

const tabla =
document.getElementById("tablaProductos");

mostrarProductos();

function mostrarProductos(){

    tabla.innerHTML="";

    productos.forEach((producto,indice)=>{

        tabla.innerHTML+=`

        <tr>

            <td>${indice+1}</td>

            <td>${producto.nombre}</td>

            <td>$${producto.precio}</td>

            <td>${producto.categoria}</td>

            <td>
                <button class="btnEditar" onclick="editarProducto(${indice})">
                    ✏️ Editar
                </button>
                <button class="btnEliminar" onclick="eliminarProducto(${indice})">
                    🗑 Eliminar
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

const nuevoProducto={

nombre:
document.getElementById("nombreProducto").value,

precio:
Number(
document.getElementById("precioProducto").value
),

imagen:
document.getElementById("imagenProducto").value,

categoria:
document.getElementById("categoriaProducto").value,

descripcion:
document.getElementById("descripcionProducto").value

};

productos.push(nuevoProducto);

localStorage.setItem(

"productos",

JSON.stringify(productos)

);

mostrarProductos();

this.reset();

alert("Producto agregado correctamente.");

});

//==============================
// ELIMINAR PRODUCTO
//==============================

function eliminarProducto(indice){

    if(confirm("¿Eliminar este producto?")){

        productos.splice(indice,1);

        localStorage.setItem(

            "productos",

            JSON.stringify(productos)

        );

        mostrarProductos();

    }

}

//==============================
// EDITAR PRODUCTO
//==============================

function editarProducto(indice){

    const producto = productos[indice];

    document.getElementById("nombreProducto").value =
    producto.nombre;

    document.getElementById("precioProducto").value =
    producto.precio;

    document.getElementById("imagenProducto").value =
    producto.imagen;

    document.getElementById("categoriaProducto").value =
    producto.categoria;

    document.getElementById("descripcionProducto").value =
    producto.descripcion;

    productos.splice(indice,1);

    localStorage.setItem(

        "productos",

        JSON.stringify(productos)

    );

    mostrarProductos();

}