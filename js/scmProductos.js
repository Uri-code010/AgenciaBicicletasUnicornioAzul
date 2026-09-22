//=========================================
// SCM - PRODUCTOS
//=========================================

const API_BASE = "http://127.0.0.1:4000/api";

const tabla = document.getElementById("tablaProductos");
const formProducto = document.getElementById("formProducto");
const mensajeProducto = document.getElementById("mensajeProducto");
const selectProveedor = document.getElementById("proveedorProducto");
const tituloFormulario = document.getElementById("tituloFormulario");
const botonGuardarProducto = document.getElementById("botonGuardarProducto");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!respuesta.ok) {
            window.location.href = "adminLogin.html";
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return false;
    }
}

async function cargarProveedoresEnSelect() {
    try {
        const respuesta = await fetch(`${API_BASE}/proveedores`, { credentials: "include" });
        if (!respuesta.ok) return;

        const proveedores = await respuesta.json();

        proveedores.forEach(p => {
            selectProveedor.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
        });

    } catch (error) {
        console.error(error);
    }
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(`${API_BASE}/productos`, { credentials: "include" });

        if (!respuesta.ok) {
            tabla.innerHTML = `<tr><td colspan="7">No se pudieron cargar los productos.</td></tr>`;
            return;
        }

        const productos = await respuesta.json();

        if (productos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="7">Aún no hay productos registrados.</td></tr>`;
            return;
        }

        tabla.innerHTML = "";

        productos.forEach(p => {
            const stockBajo = p.stock_actual <= p.stock_minimo;
            const claseStock = stockBajo ? "stockBajo" : "stockOk";
            const iconoStock = stockBajo ? "⚠️" : "✅";

            tabla.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.categoria || "Sin categoría"}</td>
                    <td class="${claseStock}">${iconoStock} ${p.stock_actual}</td>
                    <td>${p.stock_minimo}</td>
                    <td>${p.proveedor_nombre || "Sin proveedor"}</td>
                    <td>$${Number(p.costo_unitario).toFixed(2)}</td>
                    <td>
                        <button class="btnEditar" data-id="${p.id}">✏️</button>
                        <button class="btnEliminar" data-id="${p.id}">🗑️</button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll(".btnEditar").forEach(b => b.addEventListener("click", cargarParaEditar));
        document.querySelectorAll(".btnEliminar").forEach(b => b.addEventListener("click", eliminarProducto));

    } catch (error) {
        console.error(error);
        tabla.innerHTML = `<tr><td colspan="7">No se pudo conectar con el servidor.</td></tr>`;
    }
}

async function cargarParaEditar(e) {
    const id = e.target.dataset.id;

    try {
        const respuesta = await fetch(`${API_BASE}/productos/${id}`, { credentials: "include" });
        if (!respuesta.ok) return;

        const producto = await respuesta.json();

        document.getElementById("productoIdEditando").value = producto.id;
        document.getElementById("nombreProducto").value = producto.nombre;
        document.getElementById("categoriaProducto").value = producto.categoria || "";
        document.getElementById("descripcionProducto").value = producto.descripcion || "";
        document.getElementById("stockActualProducto").value = producto.stock_actual;
        document.getElementById("stockMinimoProducto").value = producto.stock_minimo;
        document.getElementById("costoProducto").value = producto.costo_unitario;
        selectProveedor.value = producto.proveedor_id || "";

        tituloFormulario.textContent = `Editando: ${producto.nombre}`;
        botonGuardarProducto.textContent = "Guardar cambios";
        botonCancelarEdicion.style.display = "inline-block";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error(error);
    }
}

function cancelarEdicion() {
    formProducto.reset();
    document.getElementById("productoIdEditando").value = "";
    tituloFormulario.textContent = "Registrar nuevo producto";
    botonGuardarProducto.textContent = "Agregar producto";
    botonCancelarEdicion.style.display = "none";
}

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

async function eliminarProducto(e) {
    const id = e.target.dataset.id;

    if (!confirm("¿Eliminar este producto?")) return;

    try {
        const respuesta = await fetch(`${API_BASE}/productos/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!respuesta.ok && respuesta.status !== 204) {
            alert("No se pudo eliminar el producto.");
            return;
        }

        cargarProductos();

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor.");
    }
}

formProducto.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("productoIdEditando").value;

    const datos = {
        nombre: document.getElementById("nombreProducto").value.trim(),
        categoria: document.getElementById("categoriaProducto").value.trim(),
        descripcion: document.getElementById("descripcionProducto").value.trim(),
        stock_actual: Number(document.getElementById("stockActualProducto").value),
        stock_minimo: Number(document.getElementById("stockMinimoProducto").value),
        costo_unitario: Number(document.getElementById("costoProducto").value),
        proveedor_id: selectProveedor.value ? Number(selectProveedor.value) : null
    };

    const url = id ? `${API_BASE}/productos/${id}` : `${API_BASE}/productos`;
    const metodo = id ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            const detalle = resultado.errores ? resultado.errores.map(err => err.msg).join(" ") : resultado.message;
            mensajeProducto.innerHTML = `❌ ${detalle}`;
            return;
        }

        mensajeProducto.innerHTML = id ? "✅ Producto actualizado." : "✅ Producto agregado.";
        cancelarEdicion();
        cargarProductos();

    } catch (error) {
        console.error(error);
        mensajeProducto.innerHTML = "❌ No se pudo conectar con el servidor.";
    }
});

async function iniciar() {
    const haySesion = await verificarSesion();
    if (haySesion) {
        cargarProveedoresEnSelect();
        cargarProductos();
    }
}

iniciar();