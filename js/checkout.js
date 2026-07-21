// ========================================
// CHECKOUT
// Agencia de Bicicletas El Unicornio Azul
// ========================================

// Obtener carrito del usuario
const carrito = obtenerCarrito();

const resumen = document.getElementById("resumenCompra");
const metodoPagoEl = document.getElementById("metodoPago");
const datosPagoDinamicosEl = document.getElementById("datosPagoDinamicos");

let subtotal = 0;
let descuento = 0;
let totalFinal = 0;
let cuponAplicado = "";

//========================================
// PROMOCIONES
//========================================

const promociones = JSON.parse(localStorage.getItem("promociones")) || [];

function obtenerUsuarioActual(){
    return JSON.parse(localStorage.getItem("usuarioActual")) || null;
}

function obtenerUltimoPedidoPorCorreo(correo){
    if(!correo){
        return null;
    }

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedidosUsuario = pedidos.filter(p => (p.correo || "").toLowerCase() === correo.toLowerCase());

    if(pedidosUsuario.length === 0){
        return null;
    }

    return pedidosUsuario[pedidosUsuario.length - 1];
}

function autocompletarDatosUsuario(){
    const usuario = obtenerUsuarioActual() || {};
    const ultimoPedido = obtenerUltimoPedidoPorCorreo(usuario.correo);

    const nombre = document.getElementById("nombre");
    const direccion = document.getElementById("direccion");
    const ciudad = document.getElementById("ciudad");
    const cp = document.getElementById("cp");
    const telefono = document.getElementById("telefono");

    if(nombre){
        nombre.value = usuario.nombre || "";
    }

    if(direccion){
        direccion.value = usuario.direccion || (ultimoPedido ? ultimoPedido.direccion || "" : "");
    }

    if(ciudad){
        ciudad.value = usuario.ciudad || (ultimoPedido ? ultimoPedido.ciudad || "" : "");
    }

    if(cp){
        cp.value = usuario.codigoPostal || (ultimoPedido ? ultimoPedido.codigoPostal || "" : "");
    }

    if(telefono){
        telefono.value = usuario.telefono || (ultimoPedido ? ultimoPedido.telefono || "" : "");
    }
}

function guardarDatosEditablesUsuario(datos){
    const usuarioActual = obtenerUsuarioActual();
    if(!usuarioActual || !usuarioActual.correo){
        return;
    }

    const usuarioActualizado = {
        ...usuarioActual,
        nombre: datos.nombre,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
        codigoPostal: datos.codigoPostal,
        telefono: datos.telefono
    };

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));

    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const indice = usuarios.findIndex((u)=> (u.correo || "").toLowerCase() === usuarioActual.correo.toLowerCase());

    if(indice >= 0){
        usuarios[indice] = {
            ...usuarios[indice],
            nombre: datos.nombre,
            direccion: datos.direccion,
            ciudad: datos.ciudad,
            codigoPostal: datos.codigoPostal,
            telefono: datos.telefono
        };

        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    }
}

function obtenerNombreMetodoPago(valor){
    const etiquetas = {
        efectivo: "Efectivo",
        debito: "Tarjeta de Débito",
        credito: "Tarjeta de Crédito",
        transferencia: "Transferencia Bancaria"
    };

    return etiquetas[valor] || "Método no definido";
}

function enmascararNumero(numero){
    const soloDigitos = String(numero || "").replace(/\D/g, "");
    if(soloDigitos.length <= 4){
        return soloDigitos;
    }
    return "**** **** **** " + soloDigitos.slice(-4);
}

function renderizarCamposPago(){
    if(!metodoPagoEl || !datosPagoDinamicosEl){
        return;
    }

    const metodo = metodoPagoEl.value;

    if(metodo === "efectivo"){
        datosPagoDinamicosEl.innerHTML = `
            <label>Monto con el que pagarás</label>
            <input type="number" id="montoEfectivo" min="${Math.ceil(totalFinal)}" step="0.01" placeholder="Ejemplo: ${Math.ceil(totalFinal)}">
            <p id="infoCambioEfectivo" style="margin-top:6px; color:#374151;">Ingresa el monto para calcular cambio.</p>
        `;

        const montoEfectivoEl = document.getElementById("montoEfectivo");
        if(montoEfectivoEl){
            montoEfectivoEl.addEventListener("input", actualizarCambioEfectivo);
        }

        actualizarCambioEfectivo();
        return;
    }

    if(metodo === "debito" || metodo === "credito"){
        const titulo = metodo === "debito" ? "Tarjeta de Débito" : "Tarjeta de Crédito";

        datosPagoDinamicosEl.innerHTML = `
            <h3 style="margin:8px 0;">Datos de ${titulo} (simulado)</h3>
            <label>Número de tarjeta</label>
            <input type="text" id="numeroTarjeta" maxlength="19" placeholder="1234 5678 9012 3456">
            <label>Nombre del titular</label>
            <input type="text" id="titularTarjeta" placeholder="Como aparece en la tarjeta">
            <label>Vencimiento (MM/AA)</label>
            <input type="text" id="vencimientoTarjeta" maxlength="5" placeholder="08/28">
            <label>CVV</label>
            <input type="password" id="cvvTarjeta" maxlength="4" placeholder="123">
        `;
        return;
    }

    if(metodo === "transferencia"){
        datosPagoDinamicosEl.innerHTML = `
            <h3 style="margin:8px 0;">Datos de transferencia (simulado)</h3>
            <label>Banco emisor</label>
            <input type="text" id="bancoTransferencia" placeholder="Ejemplo: Banco Unicornio">
            <label>CLABE (18 dígitos)</label>
            <input type="text" id="clabeTransferencia" maxlength="18" placeholder="012345678901234567">
            <label>Referencia</label>
            <input type="text" id="referenciaTransferencia" placeholder="Ejemplo: PEDIDO-12345">
        `;
    }
}

function actualizarCambioEfectivo(){
    const montoEfectivoEl = document.getElementById("montoEfectivo");
    const infoCambioEl = document.getElementById("infoCambioEfectivo");

    if(!montoEfectivoEl || !infoCambioEl){
        return;
    }

    const monto = Number(montoEfectivoEl.value || 0);
    const cambio = monto - totalFinal;

    if(!montoEfectivoEl.value){
        infoCambioEl.innerHTML = "Ingresa el monto para calcular cambio.";
        return;
    }

    if(cambio < 0){
        infoCambioEl.innerHTML = `Faltan $${Math.abs(cambio).toFixed(2)} para cubrir el total.`;
        return;
    }

    infoCambioEl.innerHTML = `Cambio estimado: $${cambio.toFixed(2)}.`;
}

function validarYConstruirPago(){
    const metodo = metodoPagoEl ? metodoPagoEl.value : "efectivo";

    if(metodo === "efectivo"){
        const monto = Number((document.getElementById("montoEfectivo") || {}).value || 0);

        if(!monto){
            return { ok:false, mensaje:"Ingresa el monto para pago en efectivo." };
        }

        if(monto < totalFinal){
            return { ok:false, mensaje:"El monto en efectivo debe cubrir el total del pedido." };
        }

        return {
            ok:true,
            detalle:{
                tipo:"efectivo",
                montoRecibido:monto,
                cambio:Number((monto - totalFinal).toFixed(2))
            }
        };
    }

    if(metodo === "debito" || metodo === "credito"){
        const numero = (document.getElementById("numeroTarjeta") || {}).value || "";
        const titular = (document.getElementById("titularTarjeta") || {}).value || "";
        const vencimiento = (document.getElementById("vencimientoTarjeta") || {}).value || "";
        const cvv = (document.getElementById("cvvTarjeta") || {}).value || "";

        const numeroLimpio = numero.replace(/\D/g, "");

        if(numeroLimpio.length < 16){
            return { ok:false, mensaje:"El número de tarjeta debe tener al menos 16 dígitos." };
        }

        if(!titular.trim()){
            return { ok:false, mensaje:"Ingresa el nombre del titular de la tarjeta." };
        }

        if(!/^\d{2}\/\d{2}$/.test(vencimiento.trim())){
            return { ok:false, mensaje:"El vencimiento debe tener formato MM/AA." };
        }

        if(!/^\d{3,4}$/.test(cvv.trim())){
            return { ok:false, mensaje:"El CVV debe tener 3 o 4 dígitos." };
        }

        return {
            ok:true,
            detalle:{
                tipo:metodo,
                numeroEnmascarado:enmascararNumero(numeroLimpio),
                titular:titular.trim(),
                vencimiento:vencimiento.trim()
            }
        };
    }

    if(metodo === "transferencia"){
        const banco = (document.getElementById("bancoTransferencia") || {}).value || "";
        const clabe = ((document.getElementById("clabeTransferencia") || {}).value || "").replace(/\D/g, "");
        const referencia = (document.getElementById("referenciaTransferencia") || {}).value || "";

        if(!banco.trim()){
            return { ok:false, mensaje:"Ingresa el banco emisor para la transferencia." };
        }

        if(clabe.length !== 18){
            return { ok:false, mensaje:"La CLABE debe tener 18 dígitos." };
        }

        if(!referencia.trim()){
            return { ok:false, mensaje:"Ingresa una referencia para la transferencia." };
        }

        return {
            ok:true,
            detalle:{
                tipo:"transferencia",
                banco:banco.trim(),
                clabeEnmascarada:"**************" + clabe.slice(-4),
                referencia:referencia.trim()
            }
        };
    }

    return { ok:false, mensaje:"Selecciona un método de pago válido." };
}

// ========================================
// MOSTRAR PRODUCTOS DEL CARRITO
// ========================================

function renderizarResumenCarrito(){
    if(!resumen){
        return;
    }

    subtotal = 0;
    resumen.innerHTML = "";

    carrito.forEach(producto => {
        const cantidad = producto.cantidad || 1;
        let precio = producto.precio;
        const categoria = producto.categoria || "";

        const promo = promociones.find(p=> p.categoria == categoria);

        if(promo){
            precio = precio - (precio * promo.descuento /100);
        }

        subtotal += precio * cantidad;

        resumen.innerHTML += `
        <p>
            🚲 ${producto.nombre}
            x${cantidad}
            <strong>
                $${(precio*cantidad).toFixed(2)}
            </strong>
        </p>
        `;
    });

    document.getElementById("subtotalCompra").innerHTML = "Subtotal: $" + subtotal.toFixed(2);
    document.getElementById("descuentoCompra").innerHTML = "Descuento: $0.00";
    document.getElementById("envioCompra").innerHTML = "Envío: Gratis";
    document.getElementById("totalCompra").innerHTML = "Total: $" + subtotal.toFixed(2);

    totalFinal = subtotal;
}

// ========================================
// CUPÓN
// ========================================

function actualizarEstadoCupon() {
    const estadoCupon = document.getElementById("estadoCupon");

    if (estadoCupon) {
        estadoCupon.textContent = cuponAplicado
            ? `Cupón aplicado: ${cuponAplicado}`
            : "Sin cupón aplicado";
        estadoCupon.style.color = cuponAplicado ? "#2e7d32" : "#6b7280";
    }
}

function aplicarCupon() {
    const cupon = document.getElementById("cupon").value.trim().toUpperCase();

    if (!cupon) {
        descuento = 0;
        cuponAplicado = "";
        mostrarToast("⚠ Ingresa un cupón para aplicar.", "advertencia");
        actualizarTotal();
        return;
    }

    const cuponesValidos = ["UNICORNIO10", "UNICORNIO", "UNICORNIO15"];

    if (cuponesValidos.includes(cupon)) {
        const porcentaje = cupon === "UNICORNIO15" ? 0.15 : 0.10;
        descuento = subtotal * porcentaje;
        cuponAplicado = cupon;
        mostrarToast("✅ Cupón aplicado correctamente.", "exito");
    }
    else {
        descuento = 0;
        cuponAplicado = "";
        mostrarToast("❌ Cupón inválido. Prueba con UNICORNIO10, UNICORNIO o UNICORNIO15.", "advertencia");
    }

    actualizarTotal();
}

// ========================================
// ACTUALIZAR TOTAL
// ========================================

function actualizarTotal() {
    const envio = Number(document.querySelector('input[name="envio"]:checked').value);

    totalFinal = subtotal - descuento + envio;

    document.getElementById("descuentoCompra").innerHTML = "Descuento: $" + descuento.toFixed(2);
    document.getElementById("envioCompra").innerHTML = envio === 0 ? "Envío: Gratis" : "Envío: $" + envio.toFixed(2);
    document.getElementById("totalCompra").innerHTML = "Total: $" + totalFinal.toFixed(2);

    actualizarEstadoCupon();

    if(metodoPagoEl && metodoPagoEl.value === "efectivo"){
        const montoEfectivoEl = document.getElementById("montoEfectivo");
        if(montoEfectivoEl){
            montoEfectivoEl.min = String(Math.ceil(totalFinal));
        }
        actualizarCambioEfectivo();
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

function inicializarCheckout(){
    renderizarResumenCarrito();
    autocompletarDatosUsuario();
    actualizarTotal();
    renderizarCamposPago();

    document.querySelectorAll('input[name="envio"]').forEach(opcion => {
        opcion.addEventListener("change", actualizarTotal);
    });

    if(metodoPagoEl){
        metodoPagoEl.addEventListener("change", renderizarCamposPago);
    }
}

inicializarCheckout();

// ========================================
// CONFIRMAR COMPRA
// ========================================

document.getElementById("formCheckout").addEventListener("submit", function (e) {
    e.preventDefault();

    if (carrito.length === 0) {
        mostrarToast("🛒 El carrito está vacío.", "info");
        return;
    }

    if (!document.getElementById("politica").checked) {
        mostrarToast("⚠ Debe aceptar la política de devoluciones.", "advertencia");
        return;
    }

    if (!document.getElementById("terminos").checked) {
        mostrarToast("⚠ Debe aceptar los términos y condiciones.", "advertencia");
        return;
    }

    const validacionPago = validarYConstruirPago();
    if(!validacionPago.ok){
        mostrarToast("⚠ " + validacionPago.mensaje, "advertencia");
        return;
    }

    const usuario = obtenerUsuarioActual() || {};
    const fechaISO = new Date().toISOString();
    const metodoPago = metodoPagoEl ? metodoPagoEl.value : "efectivo";

    const datosEnvio = {
        nombre: document.getElementById("nombre").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim(),
        codigoPostal: document.getElementById("cp").value.trim(),
        telefono: document.getElementById("telefono").value.trim()
    };

    guardarDatosEditablesUsuario(datosEnvio);

    const pedido = {
        id: Date.now(),
        cliente: datosEnvio.nombre || usuario.nombre || "Cliente",
        correo: usuario.correo || "",
        direccion: datosEnvio.direccion,
        ciudad: datosEnvio.ciudad,
        codigoPostal: datosEnvio.codigoPostal,
        telefono: datosEnvio.telefono,
        metodo: obtenerNombreMetodoPago(metodoPago),
        metodoClave: metodoPago,
        pagoDetalle: validacionPago.detalle,
        productos: carrito,
        subtotal: subtotal,
        descuento: descuento,
        envio: Number(document.querySelector('input[name="envio"]:checked').value),
        total: totalFinal,
        fecha: fechaISO,
        estado: "Pedido recibido"
    };

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("historial", JSON.stringify(pedidos));

    if(usuario.correo){
        localStorage.setItem(
            "historial_" + usuario.correo.toLowerCase(),
            JSON.stringify(pedidos.filter(p=>p.correo===usuario.correo))
        );
    }

    localStorage.setItem("ultimaCompra", JSON.stringify(pedido));
    localStorage.setItem("pedidoSeleccionado", pedido.id);

    vaciarCarrito(false);

    document.getElementById("mensajeCompra").innerHTML = "✅ Compra realizada correctamente.";
    mostrarToast("🎉 Pedido realizado correctamente.", "exito");

    setTimeout(function () {
        window.location.href = "confirmacion.html";
    }, 1200);
});