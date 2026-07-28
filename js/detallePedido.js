let historial =
JSON.parse(localStorage.getItem("pedidos")) || [];

let id = localStorage.getItem("pedidoSeleccionado");

let compra = historial.find(c => {
    if (!c || !c.id) return false;
    return String(c.id) === String(id);
});

if (!compra && id !== null) {
    compra = historial.find(c => Number(c.id) === Number(id));
}

let detalle =
document.getElementById("detallePedido");

function formatearFecha(fecha){
    if(!fecha){
        return "No disponible";
    }
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime())
        ? fecha
        : fechaObj.toLocaleString("es-MX");
}

function formatearMoneda(valor){
    return `$${Number(valor || 0).toFixed(2)}`;
}

function abrirFacturacion(idPedido){
    localStorage.setItem("pedidoSeleccionado", idPedido);
    location.href = "facturacion.html";
}

if(compra){

    let productos="";

    compra.productos.forEach(p=>{

        const cantidad = p.cantidad || 1;
        const subtotal = Number(p.precio || 0) * cantidad;

        productos +=

         `
            <li class="pedido-item">
                <span>${p.nombre} × ${cantidad}</span>
                <strong>${formatearMoneda(subtotal)}</strong>
            </li>
        `;

    });

    detalle.innerHTML=

        `
            <div class="detalle-resumen">
                <div class="detalle-encabezado">
                    <div>
                        <p class="detalle-etiqueta">Pedido</p>
                        <h2>${compra.id}</h2>
                    </div>
                    <span class="detalle-estado">${compra.estado || "Procesando"}</span>
                </div>

                <div class="detalle-grid">
                    <div>
                        <p><strong>Cliente:</strong> ${compra.cliente || "No registrado"}</p>
                        <p><strong>Correo:</strong> ${compra.correo || "No registrado"}</p>
                        <p><strong>Dirección:</strong> ${compra.direccion || "No disponible"}</p>
                    </div>
                    <div>
                        <p><strong>Ciudad:</strong> ${compra.ciudad || "No disponible"}</p>
                        <p><strong>C.P.:</strong> ${compra.codigoPostal || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> ${compra.telefono || "No disponible"}</p>
                    </div>
                </div>

                <div class="detalle-meta">
                    <p><strong>Fecha:</strong> ${formatearFecha(compra.fecha)}</p>
                    <p><strong>Método de pago:</strong> ${compra.metodo || "No especificado"}</p>
                </div>

                <h3>Productos adquiridos</h3>
                <ul class="detalle-productos">
                    ${productos}
                </ul>

                <div class="detalle-total">
                    <p><span>Subtotal:</span> <strong>${formatearMoneda(compra.subtotal || 0)}</strong></p>
                    <p><span>Envío:</span> <strong>${formatearMoneda(compra.envio || 0)}</strong></p>
                    <p><span>Descuento:</span> <strong>${formatearMoneda(compra.descuento || 0)}</strong></p>
                    <h3><span>Total pagado:</span> <strong>${formatearMoneda(compra.total || 0)}</strong></h3>
                </div>

                <div style="margin-top:14px;">
                    <button class="boton" onclick="abrirFacturacion('${compra.id}')">
                        ${compra.factura ? "Ver factura" : "Solicitar factura"}
                    </button>
                </div>
            </div>
    `;

} else {
    detalle.innerHTML = `
        <div class="detalle-vacio">
            <h2>No se encontró el pedido</h2>
            <p>Regresa a tu historial para ver tus compras.</p>
        </div>
    `;
}