const pedido =

    JSON.parse(

    localStorage.getItem("ultimaCompra")

    );

    const contenedor =

    document.getElementById("infoPedido");

    const accionesConfirmacion = document.getElementById("accionesConfirmacion");
    const descargarReciboBtn = document.getElementById("descargarReciboBtn");

    function formatearFecha(fechaISO){

        return new Date(fechaISO).toLocaleString("es-MX");

    }

    function generarReciboTexto(pedidoActual){

        const lineasProductos = (pedidoActual.productos || []).map((producto)=>{

            const cantidad = producto.cantidad || 1;
            const precio = Number(producto.precio || 0);
            const totalLinea = precio * cantidad;

            return `${cantidad} x ${producto.nombre} - $${totalLinea.toFixed(2)}`;

        });

        return [

            "RECIBO DE COMPRA",

            "==============================",

            `Pedido: #${pedidoActual.id}`,

            `Fecha: ${formatearFecha(pedidoActual.fecha)}`,

            `Cliente: ${pedidoActual.cliente || "Cliente"}`,

            `Correo: ${pedidoActual.correo || "No registrado"}`,

            "",

            "FACTURACIÓN Y ENVÍO",

            `Dirección: ${pedidoActual.direccion || "No registrada"}`,

            `Ciudad: ${pedidoActual.ciudad || "No registrada"}`,

            `Código Postal: ${pedidoActual.codigoPostal || "No registrado"}`,

            `Teléfono: ${pedidoActual.telefono || "No registrado"}`,

            "",

            "DETALLE DEL PEDIDO",

            ...(lineasProductos.length ? lineasProductos : ["Sin productos registrados"]),

            "",

            `Subtotal: $${Number(pedidoActual.subtotal || 0).toFixed(2)}`,

            `Descuento: -$${Number(pedidoActual.descuento || 0).toFixed(2)}`,

            `Envío: $${Number(pedidoActual.envio || 0).toFixed(2)}`,

            `Total: $${Number(pedidoActual.total || 0).toFixed(2)}`,

            "",

            `Método de pago: ${pedidoActual.metodo || "No definido"}`,

            `Estado: ${pedidoActual.estado || "Pedido recibido"}`

        ].join("\n");

    }

    function descargarRecibo(){

        if(!pedido){

            return;

        }

        const contenido = generarReciboTexto(pedido);
        const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = `recibo-pedido-${pedido.id}.txt`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        URL.revokeObjectURL(url);

    }

    if(pedido){

        contenedor.innerHTML=`

            <p>

                <b>Pedido:</b>

                #${pedido.id}

            </p>

            <p>

                <b>Fecha:</b>

                ${new Date(pedido.fecha).toLocaleString("es-MX")}

            </p>

            <p>

            <b>Estado:</b>

                🟡 Pedido recibido

            </p>

            <h2>

                Total pagado

            </h2>

            <h1>

                $${Number(pedido.total).toFixed(2)}

            </h1>

            <h2>

                Facturación

            </h2>

            <p>

                <b>Nombre:</b>

                ${pedido.cliente || "Cliente"}

            </p>

            <p>

                <b>Correo:</b>

                ${pedido.correo || "No registrado"}

            </p>

            <p>

                <b>Dirección:</b>

                ${pedido.direccion || "No registrada"}

            </p>

            <p>

                <b>Ciudad:</b>

                ${pedido.ciudad || "No registrada"}

            </p>

            <p>

                <b>Código Postal:</b>

                ${pedido.codigoPostal || "No registrado"}

            </p>

            <p>

                <b>Teléfono:</b>

                ${pedido.telefono || "No registrado"}

            </p>

            <h2>

                Resumen del recibo

            </h2>

            <p>

                <b>Método de pago:</b>

                ${pedido.metodo || "No definido"}

            </p>

            <p>

                <b>Subtotal:</b>

                $${Number(pedido.subtotal || 0).toFixed(2)}

            </p>

            <p>

                <b>Descuento:</b>

                -$${Number(pedido.descuento || 0).toFixed(2)}

            </p>

            <p>

                <b>Envío:</b>

                $${Number(pedido.envio || 0).toFixed(2)}

            </p>

        `;

        if(accionesConfirmacion){

            accionesConfirmacion.style.display = "flex";

        }

        if(descargarReciboBtn){

            descargarReciboBtn.addEventListener("click", descargarRecibo);

        }

    }