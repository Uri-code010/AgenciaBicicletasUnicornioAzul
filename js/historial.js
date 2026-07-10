let historial =
JSON.parse(localStorage.getItem("historial")) || [];

const usuario =
JSON.parse(localStorage.getItem("usuarioActual")) || {};

let lista =
document.getElementById("listaHistorial");

const comprasUsuario = historial.filter(compra =>
    compra.correo === usuario.correo || compra.cliente === usuario.nombre
);

if(comprasUsuario.length==0){

    lista.innerHTML="<p>No existen compras para este usuario.</p>";

}

comprasUsuario.forEach(compra=>{

lista.innerHTML +=

`

<div class="pedido">

<h3>${compra.id}</h3>

<p><strong>Fecha:</strong> ${compra.fecha}</p>

<p><strong>Total:</strong> $${compra.total}</p>

<p><strong>Estado:</strong> ${compra.estado}</p>

<button onclick="verDetalle('${compra.id}')">

Ver Detalle

</button>

</div>

`;

});

function verDetalle(id){

localStorage.setItem(

"pedidoSeleccionado",

id

);

window.location.href="detallePedido.html";

}