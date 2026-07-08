//==========================================
// CONFIRMACIÓN DE COMPRA
//==========================================

const compra =
JSON.parse(localStorage.getItem("ultimaCompra"));

const detalle =
document.getElementById("detallePedido");

if(!compra){

    detalle.innerHTML =

    "<h3>No existe ninguna compra registrada.</h3>";

}
else{

    let html = "";

    html += `

        <h3>Pedido: ${compra.id}</h3>

        <p>

            <strong>Cliente:</strong>

            ${compra.cliente}

        </p>

        <p>

            <strong>Dirección:</strong>

            ${compra.direccion}

        </p>

        <p>

            <strong>Ciudad:</strong>

            ${compra.ciudad}

        </p>

        <p>

            <strong>Código Postal:</strong>

            ${compra.codigoPostal}

        </p>

        <p>

            <strong>Teléfono:</strong>

            ${compra.telefono}

        </p>

        <p>

            <strong>Método de Pago:</strong>

            ${compra.metodo}

        </p>

        <p>

            <strong>Fecha:</strong>

            ${compra.fecha}

        </p>

        <hr>

        <h3>Productos Comprados</h3>

    `;

    compra.productos.forEach(producto=>{

        html += `

            <div class="productoConfirmacion">

                <img
                    src="${producto.imagen}"
                    class="miniProducto">

                <div>

                    <strong>

                        ${producto.nombre}

                    </strong>

                    <br>

                    Cantidad:

                    ${producto.cantidad}

                    <br>

                    Precio:

                    $${producto.precio}

                </div>

            </div>

            <hr>

        `;

    });

    html += `

        <p>

            <strong>

                Subtotal:

            </strong>

            $${compra.subtotal}

        </p>

        <p>

            <strong>

                Descuento:

            </strong>

            $${compra.descuento}

        </p>

        <p>

            <strong>

                Envío:

            </strong>

            $${compra.envio}

        </p>

        <h2>

            Total Pagado:

            $${compra.total}

        </h2>

    `;

    detalle.innerHTML = html;

    document.getElementById("estadoPedido").innerHTML =

    "🟢 " + compra.estado;

}