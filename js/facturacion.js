function obtenerPedidoActivo() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const idSeleccionado = localStorage.getItem("pedidoSeleccionado");

    if (idSeleccionado !== null) {
        const encontrado = pedidos.find((p) => String(p.id) === String(idSeleccionado));
        if (encontrado) {
            return encontrado;
        }
    }

    const ultimaCompra = JSON.parse(localStorage.getItem("ultimaCompra"));
    if (!ultimaCompra) {
        return null;
    }

    const pedidoPersistido = pedidos.find((p) => String(p.id) === String(ultimaCompra.id));
    return pedidoPersistido || ultimaCompra;
}

let pedido = obtenerPedidoActivo();

const tituloPedido = document.getElementById("tituloPedido");
const textoFecha = document.getElementById("textoFecha");
const totalPagado = document.getElementById("totalPagado");
const datosFacturacion = document.getElementById("datosFacturacion");
const resumenPedido = document.getElementById("resumenPedido");
const listaProductos = document.getElementById("listaProductos");
const estadoPedido = document.getElementById("estadoPedido");
const descargarReciboBtn = document.getElementById("descargarReciboBtn");
const descargarFacturaBtn = document.getElementById("descargarFacturaBtn");
const estadoFactura = document.getElementById("estadoFactura");
const mensajeFactura = document.getElementById("mensajeFactura");
const mostrarFormularioFacturaBtn = document.getElementById("mostrarFormularioFacturaBtn");
const accionesFacturaVacia = document.getElementById("accionesFacturaVacia");
const formFactura = document.getElementById("formFactura");
const resumenFactura = document.getElementById("resumenFactura");
const cancelarFacturaBtn = document.getElementById("cancelarFacturaBtn");
const llenarEjemploFacturaBtn = document.getElementById("llenarEjemploFacturaBtn");
const notificacionPagina = document.getElementById("notificacionPagina");

let temporizadorNotificacion = null;

function mostrarNotificacionPagina(mensaje, tipo = "info") {
    if (!notificacionPagina) {
        return;
    }

    if (temporizadorNotificacion) {
        clearTimeout(temporizadorNotificacion);
    }

    notificacionPagina.textContent = mensaje;
    notificacionPagina.className = "notificacion-pagina";
    notificacionPagina.classList.add(
        tipo === "ok" ? "notificacion-ok" : tipo === "error" ? "notificacion-error" : "notificacion-info"
    );
    notificacionPagina.style.display = "block";

    temporizadorNotificacion = setTimeout(() => {
        notificacionPagina.style.display = "none";
    }, 2800);
}

const ejemplosFactura = [
    {
        razonSocial: "Pedro Ramirez Torres",
        rfc: "RATP900101AB1",
        correoFiscal: "pedro.ramirez@correo.com",
        codigoPostalFiscal: "20196",
        regimenFiscal: "612 - Personas Físicas con Actividades Empresariales y Profesionales",
        usoCfdi: "G03 - Gastos en general"
    },
    {
        razonSocial: "Bicicletas del Centro SA de CV",
        rfc: "BCC190425KJ2",
        correoFiscal: "facturacion@biciscentro.com",
        codigoPostalFiscal: "20000",
        regimenFiscal: "601 - General de Ley Personas Morales",
        usoCfdi: "G03 - Gastos en general"
    },
    {
        razonSocial: "Ana Sofia Luna Garcia",
        rfc: "LUGA9503189T4",
        correoFiscal: "ana.luna@ejemplo.mx",
        codigoPostalFiscal: "20235",
        regimenFiscal: "626 - Régimen Simplificado de Confianza",
        usoCfdi: "S01 - Sin efectos fiscales"
    }
];

let indiceEjemploFactura = 0;

function llenarFormularioConEjemplo() {
    if (!formFactura) {
        return;
    }

    const ejemplo = ejemplosFactura[indiceEjemploFactura % ejemplosFactura.length];
    indiceEjemploFactura += 1;

    const razonSocialEl = document.getElementById("razonSocial");
    const rfcEl = document.getElementById("rfc");
    const correoFiscalEl = document.getElementById("correoFiscal");
    const codigoPostalFiscalEl = document.getElementById("codigoPostalFiscal");
    const regimenFiscalEl = document.getElementById("regimenFiscal");
    const usoCfdiEl = document.getElementById("usoCfdi");

    if (razonSocialEl) {
        razonSocialEl.value = ejemplo.razonSocial;
    }
    if (rfcEl) {
        rfcEl.value = ejemplo.rfc;
    }
    if (correoFiscalEl) {
        correoFiscalEl.value = ejemplo.correoFiscal;
    }
    if (codigoPostalFiscalEl) {
        codigoPostalFiscalEl.value = ejemplo.codigoPostalFiscal;
    }
    if (regimenFiscalEl) {
        regimenFiscalEl.value = ejemplo.regimenFiscal;
    }
    if (usoCfdiEl) {
        usoCfdiEl.value = ejemplo.usoCfdi;
    }
}

function guardarPedidoActualizado(pedidoActualizado) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const indice = pedidos.findIndex((p) => String(p.id) === String(pedidoActualizado.id));

    if (indice >= 0) {
        pedidos[indice] = pedidoActualizado;
    } else {
        pedidos.push(pedidoActualizado);
    }

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("historial", JSON.stringify(pedidos));

    const ultimaCompraActual = JSON.parse(localStorage.getItem("ultimaCompra"));
    if (ultimaCompraActual && String(ultimaCompraActual.id) === String(pedidoActualizado.id)) {
        localStorage.setItem("ultimaCompra", JSON.stringify(pedidoActualizado));
    }

    if (pedidoActualizado.correo) {
        const pedidosUsuario = pedidos.filter(
            (p) => (p.correo || "").toLowerCase() === pedidoActualizado.correo.toLowerCase()
        );
        localStorage.setItem("historial_" + pedidoActualizado.correo.toLowerCase(), JSON.stringify(pedidosUsuario));
    }
}

function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleString("es-MX");
}

function generarReciboTexto(pedidoActual) {
    const lineasProductos = (pedidoActual.productos || []).map((producto) => {
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

function generarFacturaTexto(pedidoActual) {
    const factura = pedidoActual.factura || {};
    const lineasProductos = (pedidoActual.productos || []).map((producto) => {
        const cantidad = producto.cantidad || 1;
        const precio = Number(producto.precio || 0);
        const totalLinea = precio * cantidad;

        return `${cantidad} x ${producto.nombre} - $${totalLinea.toFixed(2)}`;
    });

    return [
        "FACTURA DIGITAL",
        "==============================",
        `Folio: ${factura.folio || "No disponible"}`,
        `Fecha de emisión: ${factura.fechaEmision ? formatearFecha(factura.fechaEmision) : "No disponible"}`,
        `Pedido: #${pedidoActual.id}`,
        "",
        "DATOS FISCALES",
        `Razón social: ${factura.razonSocial || "No disponible"}`,
        `RFC: ${factura.rfc || "No disponible"}`,
        `Correo fiscal: ${factura.correoFiscal || "No disponible"}`,
        `Código postal fiscal: ${factura.codigoPostalFiscal || "No disponible"}`,
        `Régimen fiscal: ${factura.regimenFiscal || "No disponible"}`,
        `Uso CFDI: ${factura.usoCfdi || "No disponible"}`,
        "",
        "CONCEPTOS",
        ...(lineasProductos.length ? lineasProductos : ["Sin productos registrados"]),
        "",
        `Subtotal: $${Number(pedidoActual.subtotal || 0).toFixed(2)}`,
        `Descuento: -$${Number(pedidoActual.descuento || 0).toFixed(2)}`,
        `Envío: $${Number(pedidoActual.envio || 0).toFixed(2)}`,
        `Total: $${Number(pedidoActual.total || 0).toFixed(2)}`,
        "",
        "Documento generado para fines demostrativos"
    ].join("\n");
}

function descargarFactura() {
    if (!pedido || !pedido.factura) {
        return;
    }

    const contenido = generarFacturaTexto(pedido);
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `factura-pedido-${pedido.id}.txt`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
}

function validarFactura(datos) {
    const rfc = (datos.rfc || "").trim().toUpperCase();
    const cp = (datos.codigoPostalFiscal || "").trim();

    if (!datos.razonSocial.trim()) {
        return "Ingresa la razón social.";
    }

    if (!/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) {
        return "Ingresa un RFC válido (12 o 13 caracteres).";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correoFiscal.trim())) {
        return "Ingresa un correo fiscal válido.";
    }

    if (!/^\d{5}$/.test(cp)) {
        return "El código postal fiscal debe tener 5 dígitos.";
    }

    if (!datos.regimenFiscal.trim()) {
        return "Selecciona un régimen fiscal.";
    }

    if (!datos.usoCfdi.trim()) {
        return "Selecciona un uso CFDI.";
    }

    return "";
}

function mostrarResumenFactura() {
    if (!pedido || !pedido.factura || !resumenFactura) {
        return;
    }

    const factura = pedido.factura;
    resumenFactura.innerHTML = `
        <p><strong>Folio:</strong> ${factura.folio}</p>
        <p><strong>Razón social:</strong> ${factura.razonSocial}</p>
        <p><strong>RFC:</strong> ${factura.rfc}</p>
        <p><strong>Correo fiscal:</strong> ${factura.correoFiscal}</p>
        <p><strong>Código postal fiscal:</strong> ${factura.codigoPostalFiscal}</p>
        <p><strong>Régimen fiscal:</strong> ${factura.regimenFiscal}</p>
        <p><strong>Uso CFDI:</strong> ${factura.usoCfdi}</p>
        <p><strong>Fecha de emisión:</strong> ${formatearFecha(factura.fechaEmision)}</p>
    `;
    resumenFactura.style.display = "block";
}

function actualizarVistaFactura() {
    if (!pedido) {
        return;
    }

    const facturaExiste = Boolean(pedido.factura);

    if (estadoFactura) {
        estadoFactura.textContent = facturaExiste ? "Generada" : "Sin generar";
        estadoFactura.className = facturaExiste ? "estado-factura estado-ok" : "estado-factura estado-pendiente";
    }

    if (mensajeFactura) {
        mensajeFactura.textContent = facturaExiste
            ? "Tu factura ya está disponible. Puedes descargarla cuando quieras."
            : "Si deseas factura, completa el formulario fiscal para este pedido.";
    }

    if (accionesFacturaVacia) {
        accionesFacturaVacia.style.display = facturaExiste ? "none" : "flex";
    }

    if (formFactura) {
        formFactura.style.display = facturaExiste ? "none" : formFactura.style.display;
    }

    if (descargarFacturaBtn) {
        descargarFacturaBtn.style.display = facturaExiste ? "inline-flex" : "none";
    }

    if (facturaExiste) {
        mostrarResumenFactura();
    } else if (resumenFactura) {
        resumenFactura.style.display = "none";
        resumenFactura.innerHTML = "";
    }
}

function descargarRecibo() {
    if (!pedido) {
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

if (pedido) {
    tituloPedido.textContent = `Pedido #${pedido.id}`;
    textoFecha.textContent = `Fecha de emisión: ${formatearFecha(pedido.fecha)}`;
    totalPagado.textContent = `$${Number(pedido.total || 0).toFixed(2)}`;

    datosFacturacion.innerHTML = `
        <dt>Nombre</dt><dd>${pedido.cliente || "Cliente"}</dd>
        <dt>Correo</dt><dd>${pedido.correo || "No registrado"}</dd>
        <dt>Dirección</dt><dd>${pedido.direccion || "No registrada"}</dd>
        <dt>Ciudad</dt><dd>${pedido.ciudad || "No registrada"}</dd>
        <dt>Código Postal</dt><dd>${pedido.codigoPostal || "No registrado"}</dd>
        <dt>Teléfono</dt><dd>${pedido.telefono || "No registrado"}</dd>
    `;

    resumenPedido.innerHTML = `
        <p><strong>Método de pago:</strong> ${pedido.metodo || "No definido"}</p>
        <p><strong>Subtotal:</strong> $${Number(pedido.subtotal || 0).toFixed(2)}</p>
        <p><strong>Descuento:</strong> -$${Number(pedido.descuento || 0).toFixed(2)}</p>
        <p><strong>Envío:</strong> $${Number(pedido.envio || 0).toFixed(2)}</p>
        <p><strong>Total:</strong> $${Number(pedido.total || 0).toFixed(2)}</p>
    `;

    listaProductos.innerHTML = (pedido.productos || []).length
        ? pedido.productos.map((producto) => {
            const cantidad = producto.cantidad || 1;
            const precio = Number(producto.precio || 0);
            return `
                <div class="producto-linea">
                    <div>
                        <strong>${producto.nombre}</strong>
                        <span>Cantidad: ${cantidad}</span>
                    </div>
                    <div>
                        <strong>$${(precio * cantidad).toFixed(2)}</strong>
                        <span>$${precio.toFixed(2)} c/u</span>
                    </div>
                </div>
            `;
        }).join("")
        : '<p>No hay productos para mostrar.</p>';

    estadoPedido.textContent = `Estado: ${pedido.estado || "Pedido recibido"}`;

    actualizarVistaFactura();

    if (descargarReciboBtn) {
        descargarReciboBtn.addEventListener("click", descargarRecibo);
    }

    if (descargarFacturaBtn) {
        descargarFacturaBtn.addEventListener("click", descargarFactura);
    }

    if (mostrarFormularioFacturaBtn && formFactura) {
        mostrarFormularioFacturaBtn.addEventListener("click", () => {
            formFactura.style.display = "block";
            accionesFacturaVacia.style.display = "none";
        });
    }

    if (cancelarFacturaBtn && formFactura && accionesFacturaVacia) {
        cancelarFacturaBtn.addEventListener("click", () => {
            formFactura.reset();
            formFactura.style.display = "none";
            accionesFacturaVacia.style.display = "flex";
        });
    }

    if (llenarEjemploFacturaBtn) {
        llenarEjemploFacturaBtn.addEventListener("click", llenarFormularioConEjemplo);
    }

    if (formFactura) {
        formFactura.addEventListener("submit", (e) => {
            e.preventDefault();

            const datosFactura = {
                razonSocial: (document.getElementById("razonSocial") || {}).value || "",
                rfc: (document.getElementById("rfc") || {}).value || "",
                correoFiscal: (document.getElementById("correoFiscal") || {}).value || "",
                codigoPostalFiscal: (document.getElementById("codigoPostalFiscal") || {}).value || "",
                regimenFiscal: (document.getElementById("regimenFiscal") || {}).value || "",
                usoCfdi: (document.getElementById("usoCfdi") || {}).value || ""
            };

            const error = validarFactura(datosFactura);
            if (error) {
                mostrarNotificacionPagina(error, "error");
                return;
            }

            pedido = {
                ...pedido,
                factura: {
                    ...datosFactura,
                    rfc: datosFactura.rfc.trim().toUpperCase(),
                    razonSocial: datosFactura.razonSocial.trim(),
                    correoFiscal: datosFactura.correoFiscal.trim(),
                    codigoPostalFiscal: datosFactura.codigoPostalFiscal.trim(),
                    fechaEmision: new Date().toISOString(),
                    folio: "FAC-" + String(pedido.id)
                }
            };

            guardarPedidoActualizado(pedido);
            formFactura.reset();
            formFactura.style.display = "none";
            actualizarVistaFactura();
            mostrarNotificacionPagina("Factura generada correctamente.", "ok");
        });
    }
} else {
    tituloPedido.textContent = "No hay pedido disponible";
    textoFecha.textContent = "Realiza una compra para ver la facturación.";
    totalPagado.textContent = "$0.00";
    datosFacturacion.innerHTML = "<dt>Estado</dt><dd>No existe un pedido reciente</dd>";
    resumenPedido.innerHTML = "<p>No hay información para mostrar.</p>";
    listaProductos.innerHTML = "<p>No hay productos para mostrar.</p>";
    estadoPedido.textContent = "";
    if (estadoFactura) {
        estadoFactura.textContent = "Sin pedido";
    }
    if (mensajeFactura) {
        mensajeFactura.textContent = "Realiza una compra para solicitar factura.";
    }
    if (accionesFacturaVacia) {
        accionesFacturaVacia.style.display = "none";
    }
    if (formFactura) {
        formFactura.style.display = "none";
    }

    if (descargarReciboBtn) {
        descargarReciboBtn.disabled = true;
    }

    if (descargarFacturaBtn) {
        descargarFacturaBtn.style.display = "none";
    }
}