//historial para pedidos
let historial =
JSON.parse(localStorage.getItem("historial")) || [];

const tabla =
document.getElementById("tablaPedidos");

mostrarPedidos();

function mostrarPedidos(){

    tabla.innerHTML="";

    if(historial.length==0){

        tabla.innerHTML=`

        <tr>

            <td colspan="6">

                No existen pedidos.

            </td>

        </tr>

        `;

        return;
    }

    historial.forEach((pedido,indice)=>{

        tabla.innerHTML+=`

        <tr>

            <td>${pedido.id}</td>

            <td>${pedido.cliente}</td>

            <td>${pedido.fecha}</td>

            <td>$${pedido.total}</td>

            <td>

                <span class="estado">

                ${pedido.estado}

                </span>

            </td>

            <td>

                <button
                onclick="cambiarEstado(${indice})">

                Cambiar Estado

                </button>

            </td>

        </tr>

        `;

    });

}

// cambiar estado del pedido
function cambiarEstado(indice){

    const estados=[

        "Pedido recibido",

        "Preparando pedido",

        "Enviado",

        "Entregado"

    ];

    let posicion=

    estados.indexOf(

        historial[indice].estado

    );

    if(posicion<estados.length-1){

        posicion++;

    }

    historial[indice].estado=

    estados[posicion];

    localStorage.setItem(

        "historial",

        JSON.stringify(historial)

    );

    mostrarPedidos();

}