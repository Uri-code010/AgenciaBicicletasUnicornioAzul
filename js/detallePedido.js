let historial =
JSON.parse(localStorage.getItem("historial")) || [];

let id =
localStorage.getItem("pedidoSeleccionado");

let compra =
historial.find(c=>c.id===id);

let detalle =
document.getElementById("detallePedido");

if(compra){

let productos="";

compra.productos.forEach(p=>{

productos +=

`
<li>

${p.nombre}

............

$${p.precio}

</li>
`;

});

detalle.innerHTML=

`

<h2>${compra.id}</h2>

<p><strong>Cliente:</strong> ${compra.cliente}</p>

<p><strong>Dirección:</strong> ${compra.direccion}</p>

<p><strong>Teléfono:</strong> ${compra.telefono}</p>

<p><strong>Fecha:</strong> ${compra.fecha}</p>

<p><strong>Método:</strong> ${compra.metodo}</p>

<p><strong>Estado:</strong> ${compra.estado}</p>

<h3>Productos</h3>

<ul>

${productos}

</ul>

<h2>Total: $${compra.total}</h2>

`;

}