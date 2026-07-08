//=====================================
// PANEL ADMINISTRADOR
//=====================================

// Productos publicados

document.getElementById("totalProductos").innerHTML = 8;


// Clientes registrados

const usuarios =
JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

document.getElementById("clientes").innerHTML =
usuarios.length;


// Pedidos

const historial =
JSON.parse(localStorage.getItem("historial")) || [];

document.getElementById("pedidosHoy").innerHTML =
historial.length;


// Ventas

let ventas = 0;

historial.forEach(compra=>{

    ventas += Number(compra.total);

});

document.getElementById("ventasMes").innerHTML =
"$" + ventas.toLocaleString();


// Agotados (simulado)

document.getElementById("agotados").innerHTML = 2;

