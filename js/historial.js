//======================================
// HISTORIAL DE PEDIDOS
//======================================

const usuario =
JSON.parse(localStorage.getItem("usuarioActual"));

if(!usuario){

    mostrarToast(
        "Debes iniciar sesión.",
        "advertencia"
    );

    setTimeout(()=>{

        location.href="login.html";

    },1000);

}

const historial =

JSON.parse(

localStorage.getItem(

"historial_"+usuario.correo.toLowerCase()

)

) || [];

const contenedor =

document.getElementById("listaHistorial");

if(historial.length==0){

    contenedor.innerHTML=`

    <div class="pedidoVacio">

        <h2>

            No tienes compras todavía.

        </h2>

    </div>

    `;

}

else{

    historial.reverse().forEach(pedido=>{

        contenedor.innerHTML+=`

        <div class="pedidoCard">

            <h2>

                Pedido #${pedido.id}

            </h2>

            <p>

                📅 ${new Date(pedido.fecha).toLocaleDateString()}

            </p>

            <p>

                💲 $${pedido.total.toFixed(2)}

            </p>

            <p>

                🚚 ${pedido.estado}

            </p>

            <button

            onclick="verPedido(${pedido.id})"

            class="boton">

                Ver detalle

            </button>

            <button

            onclick="facturarPedido(${pedido.id})"

            class="boton">

                ${pedido.factura ? "Ver factura" : "Solicitar factura"}

            </button>

        </div>

        `;

    });

}

function verPedido(id){

    localStorage.setItem(

        "pedidoSeleccionado",

        id

    );

    location.href="detallePedido.html";

}

function facturarPedido(id){

    localStorage.setItem(

        "pedidoSeleccionado",

        id

    );

    location.href="facturacion.html";

}