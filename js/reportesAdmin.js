//=========================================
// REPORTES ADMIN
//=========================================

const historial =
JSON.parse(
localStorage.getItem("historial")
) || [];

const usuarios =
obtenerUsuariosRegistrados();

let ventas = 0;

let productos = 0;

historial.forEach(pedido=>{

    ventas += pedido.total;

    pedido.productos.forEach(producto=>{

        productos += producto.cantidad || 1;

    });

});

document.getElementById("ventasTotales").innerHTML =
"$" + ventas.toFixed(2);

document.getElementById("totalPedidos").innerHTML =
historial.length;

document.getElementById("totalClientes").innerHTML =
usuarios.length;

document.getElementById("productosVendidos").innerHTML =
productos;

const tabla =
document.getElementById("tablaUltimosPedidos");

historial
.slice()
.reverse()
.forEach(pedido=>{

    tabla.innerHTML += `

    <tr>

        <td>${pedido.id}</td>

        <td>${pedido.cliente}</td>

        <td>$${pedido.total}</td>

        <td>${pedido.fecha}</td>

    </tr>

    `;

});