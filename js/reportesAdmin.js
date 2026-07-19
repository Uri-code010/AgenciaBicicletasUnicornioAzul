//=========================================
// REPORTES ADMIN
//=========================================

const historial =
JSON.parse(
localStorage.getItem("pedidos")
) || [];

const usuarios =
obtenerUsuariosRegistrados();

function formatearFecha(fecha){
    if(!fecha){
        return "No disponible";
    }
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime())
        ? fecha
        : fechaObj.toLocaleString("es-MX");
}

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
const buscadorReporte = document.getElementById("buscarReporte");
const pedidosPorPagina = 7;
let paginaActual = 1;
let pedidosFiltrados = [];

function obtenerPedidosOrdenados(){

    return historial.slice().reverse();

}

function aplicarFiltro(){

    const texto = (buscadorReporte.value || "").toLowerCase().trim();

    pedidosFiltrados = obtenerPedidosOrdenados().filter(pedido => {

        const textoPedido = `${pedido.id} ${pedido.cliente} ${pedido.fecha}`.toLowerCase();

        return textoPedido.includes(texto);

    });

    paginaActual = 1;
    renderizarTabla();

}

function renderizarTabla(){

    tabla.innerHTML = "";

    const inicio = (paginaActual - 1) * pedidosPorPagina;
    const fin = inicio + pedidosPorPagina;
    const pedidosPagina = pedidosFiltrados.slice(inicio, fin);

    if(pedidosPagina.length === 0){

        tabla.innerHTML = `

        <tr>

            <td colspan="4">No se encontraron pedidos.</td>

        </tr>

        `;

        return;

    }

    pedidosPagina.forEach(pedido=>{

        tabla.innerHTML += `

        <tr>

            <td>${pedido.id}</td>

            <td>${pedido.cliente}</td>

            <td>$${pedido.total}</td>

            <td>${formatearFecha(pedido.fecha)}</td>

        </tr>

        `;

    });

    renderizarPaginacion();

}

function renderizarPaginacion(){

    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);

    let paginacion = document.getElementById("paginacionReportes");

    if(!paginacion){

        paginacion = document.createElement("div");
        paginacion.id = "paginacionReportes";
        paginacion.className = "paginacionAdmin";
        tabla.parentNode.appendChild(paginacion);

    }

    if(totalPaginas <= 1){

        paginacion.innerHTML = "";
        return;

    }

    paginacion.innerHTML = "";

    for(let i = 1; i <= totalPaginas; i++){

        const boton = document.createElement("button");
        boton.innerText = i;
        boton.className = paginaActual === i ? "activo" : "";
        boton.addEventListener("click", ()=>{

            paginaActual = i;
            renderizarTabla();

        });

        paginacion.appendChild(boton);

    }

}

if(buscadorReporte){

    buscadorReporte.addEventListener("input", aplicarFiltro);

}

pedidosFiltrados = obtenerPedidosOrdenados();
renderizarTabla();