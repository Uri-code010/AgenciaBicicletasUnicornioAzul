//historial para pedidos
let pedidos = [];
let historial = [];
let tabla = null;

function iniciarPedidosAdmin(){

    pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const tablaPedidos = document.getElementById("tablaPedidos");

    tabla = tablaPedidos;

    if(!tabla){

        return;

    }

    pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    historial = pedidos;

    mostrarPedidos();

    if(historial.length > 0 && typeof mostrarToast === "function"){

        const ultimoPedido = historial[historial.length - 1];
        const ultimoNotificado = sessionStorage.getItem("ultimoPedidoNotificadoId");

        if(String(ultimoPedido.id) !== ultimoNotificado){

            mostrarToast(

                `📦 Nuevo pedido recibido: ${ultimoPedido.id}`,

                "exito"

            );

            sessionStorage.setItem(

                "ultimoPedidoNotificadoId",

                String(ultimoPedido.id)

            );

        }

    }

}

document.addEventListener("DOMContentLoaded", iniciarPedidosAdmin);

function mostrarPedidos(){

    if(!tabla){

        return;

    }

    tabla.innerHTML="";

    if(historial.length==0){

        tabla.innerHTML=`

        <tr>

            <td colspan="6">

                No existen pedidos.

            </td>

        </tr>

        `;

        return;
    }

    historial.forEach((pedido,indice)=>{

        tabla.innerHTML+=`

        <tr>

            <td>${pedido.id}</td>

            <td>${pedido.cliente}</td>

            <td>${pedido.fecha}</td>

            <td>$${pedido.total}</td>

            <td>

                <span class="estado">

                ${pedido.estado}

                </span>

            </td>

            <td>

                <select onchange="cambiarEstado(${indice}, this.value)">

                <option value="Pedido recibido"
                ${pedido.estado=="Pedido recibido"?"selected":""}>

                    Pedido recibido

                </option>

                <option value="Preparando pedido"
                ${pedido.estado=="Preparando pedido"?"selected":""}>

                    Preparando

                </option>

                <option value="Empacado"
                ${pedido.estado=="Empacado"?"selected":""}>

                    Empacado

                </option>

                <option value="En camino"
                ${pedido.estado=="En camino"?"selected":""}>

                    En camino

                </option>

                <option value="Entregado"
                ${pedido.estado=="Entregado"?"selected":""}>

                    Entregado

                </option>

            </select>

        </td>

        <td>

            <button
            class="btnVer"
            onclick="verPedido(${indice})">

                👁

            </button>
            </td>

        </tr>

        `;

    });

}

//==============================
// CAMBIAR ESTADO
//==============================

function cambiarEstado(indice,nuevoEstado){

    historial[indice].estado = nuevoEstado;

    const notificaciones =

    JSON.parse(

    localStorage.getItem("notificaciones")

    ) || [];

    notificaciones.push({

        correo: historial[indice].correo,

        pedido: historial[indice].id,

        estado: nuevoEstado,

        leida: false,

        fecha: new Date().toLocaleString()

    });

    localStorage.setItem(

        "notificaciones",

        JSON.stringify(notificaciones)

    );

    localStorage.setItem(

        "pedidos",

        JSON.stringify(historial)

    );

    mostrarToast(

        "✅ Estado actualizado correctamente.",

        "exito"

    );

    mostrarPedidos();

}

//==============================
// VER PEDIDO
//==============================

function verPedido(indice){

    const pedido = historial[indice];

    const estados = [
        "Pedido recibido",
        "Preparando pedido",
        "Empacado",
        "En camino",
        "Entregado"
    ];

    const indiceEstado = estados.indexOf(pedido.estado);
    const progreso = indiceEstado >= 0 ? ((indiceEstado + 1) / estados.length) * 100 : 0;

    let productos = "";

    pedido.productos.forEach(producto=>{

        productos += `

        • ${producto.nombre}

        x${producto.cantidad}

        - $${producto.precio}

        \n`;

    });

    mostrarToast(

        `
        <div style="max-width:380px; width:100%; padding:14px; border:1px solid #e5e7eb; border-radius:16px; background:#ffffff; box-shadow:0 10px 24px rgba(0,0,0,0.14); font-family:Arial, sans-serif;">
            <div style="font-weight:bold; font-size:16px; margin-bottom:8px; color:#111827;">📦 Pedido #${pedido.id}</div>
            <div style="font-size:13px; color:#4b5563; margin-bottom:6px;"><strong>Cliente:</strong> ${pedido.cliente}</div>
            <div style="font-size:13px; color:#4b5563; margin-bottom:6px;"><strong>Fecha:</strong> ${pedido.fecha}</div>
            <div style="font-size:13px; color:#4b5563; margin-bottom:10px;"><strong>Estado:</strong> ${pedido.estado}</div>
            <div style="margin-bottom:10px;">
                <div style="height:8px; background:#e5e7eb; border-radius:999px; overflow:hidden;">
                    <div style="height:100%; width:${progreso}%; background:linear-gradient(90deg, #0ea5e9, #22c55e); border-radius:999px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:#6b7280; margin-top:4px;">
                    <span>Recibido</span>
                    <span>Preparando</span>
                    <span>Empacado</span>
                    <span>En camino</span>
                    <span>Entregado</span>
                </div>
            </div>
            <div style="border-top:1px solid #e5e7eb; padding-top:8px; margin-bottom:8px;">
                <div style="font-size:13px; font-weight:bold; margin-bottom:6px; color:#111827;">Productos:</div>
                <div style="font-size:12px; color:#374151; white-space:pre-line;">${productos}</div>
            </div>
            <div style="font-size:14px; font-weight:bold; color:#0f766e; text-align:right;">Total: $${pedido.total}</div>
        </div>
        `,

        "info"

    );

}