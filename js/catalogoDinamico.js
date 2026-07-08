//====================================
// CATÁLOGO DINÁMICO
//====================================

let productos =

JSON.parse(

localStorage.getItem("productos")

) || [];

const catalogo =
document.getElementById("catalogo");

function mostrarCatalogo(){

    catalogo.innerHTML = "";

    productos.forEach(producto=>{

        catalogo.innerHTML += `

        <div
        class="producto"
        data-categoria="${producto.categoria.toLowerCase()}"
        data-nombre="${producto.nombre.toLowerCase()}">

            <span class="etiqueta ${producto.categoria.toLowerCase()}">

                ${producto.categoria}

            </span>

            <img src="${producto.imagen}">

            <h3>${producto.nombre}</h3>

            <p>

                ${producto.descripcion}

            </p>

            <h4>

                $${producto.precio}

            </h4>

            <button

            onclick="agregarCarrito(

                '${producto.nombre}',

                ${producto.precio}

            )">

            Agregar al carrito

            </button>

        </div>

        `;

    });

}

mostrarCatalogo();