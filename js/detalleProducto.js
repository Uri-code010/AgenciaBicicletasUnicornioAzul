function obtenerParametroNombre() {
    return new URLSearchParams(window.location.search).get("nombre");
}

function obtenerImagenesProducto(producto) {
    const imagenes = [];

    if (Array.isArray(producto.imagenes)) {
        producto.imagenes.forEach((imagen) => {
            if (typeof imagen === "string" && imagen.trim()) {
                imagenes.push(imagen.trim());
            }
        });
    } else if (typeof producto.imagenes === "string" && producto.imagenes.trim()) {
        producto.imagenes
            .split(",")
            .map((imagen) => imagen.trim())
            .filter(Boolean)
            .forEach((imagen) => imagenes.push(imagen));
    }

    if (imagenes.length === 0 && typeof producto.imagen === "string" && producto.imagen.trim()) {
        imagenes.push(producto.imagen.trim());
    }

    return imagenes;
}

function mostrarProducto(producto) {
    const detalleImagen = document.getElementById("detalleImagen");
    const detalleInfo = document.getElementById("detalleInfo");
    const imagenes = obtenerImagenesProducto(producto);
    const imagenPrincipal = imagenes[0] || "img/bici16.avif";

    detalleImagen.innerHTML = `
        <img id="imagenPrincipalDetalle" src="${imagenPrincipal}" alt="${producto.nombre}">
        ${imagenes.length > 1 ? `
            <div class="miniaturas">
                ${imagenes.map((imagen, index) => `
                    <img
                        src="${imagen}"
                        alt="${producto.nombre} ${index + 1}"
                        class="miniaturaProducto ${index === 0 ? "miniaturaActiva" : ""}"
                        data-imagen="${imagen}">
                `).join("")}
            </div>
        ` : ""}
    `;

    detalleImagen.querySelectorAll(".miniaturaProducto").forEach((miniatura) => {
        miniatura.addEventListener("click", () => {
            const imagenPrincipalDetalle = document.getElementById("imagenPrincipalDetalle");
            if (imagenPrincipalDetalle) {
                imagenPrincipalDetalle.src = miniatura.dataset.imagen;
            }

            detalleImagen.querySelectorAll(".miniaturaProducto").forEach((item) => {
                item.classList.remove("miniaturaActiva");
            });

            miniatura.classList.add("miniaturaActiva");
        });
    });

    detalleInfo.innerHTML = `
        <h2>${producto.nombre}</h2>
        <div class="estrellas">
            ⭐⭐⭐⭐⭐ <span>(4.8)</span>
        </div>
        <h1 class="precio">$${producto.precio}</h1>
        <p class="stock">${producto.estado === "Agotado" ? "✖ Agotado" : "✔ Disponible"}</p>
        <p>${producto.descripcion || "Descripción no disponible."}</p>
        <div class="especificaciones">
            <h3>Detalles del producto</h3>
            <ul>
                <li><strong>Categoría:</strong> ${producto.categoria || "N/A"}</li>
                <li><strong>Existencia:</strong> ${producto.existencia ?? "0"}</li>
                <li><strong>Etiqueta:</strong> ${producto.etiqueta || "Ninguna"}</li>
                <li><strong>Estado:</strong> ${producto.estado || "Desconocido"}</li>
            </ul>
        </div>
        <button ${producto.estado === "Agotado" ? "disabled class=\"btnAgotado\"" : "onclick=\"agregarCarrito('" + producto.nombre + "', " + producto.precio + ", '" + producto.categoria + "')\""}>
            ${producto.estado === "Agotado" ? "Agotado" : "🛒 Agregar al carrito"}
        </button>
        ${
            producto.estado === "Agotado"
            ? ""
            : `<button onclick="comprarAhora('${producto.nombre}', ${producto.precio}, '${producto.categoria}')">Comprar ahora</button>`
        }
        <br><br>
        <a href="catalogo.html" class="botonVolver">← Regresar al catálogo</a>
    `;
}

function mostrarError() {
    const container = document.getElementById("detalleProductoContainer");
    container.innerHTML = `
        <div style="width:100%; text-align:center; padding:40px;">
            <h2>Producto no encontrado</h2>
            <p>No se encontró el producto solicitado. Regresa al catálogo y selecciona otro.</p>
            <a href="catalogo.html" class="botonVolver">← Volver al catálogo</a>
        </div>
    `;
}

function inicializarDetalleProducto() {
    const nombreProducto = obtenerParametroNombre();

    if (!nombreProducto) {
        mostrarError();
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.nombre === nombreProducto);

    if (!producto) {
        mostrarError();
        return;
    }

    mostrarProducto(producto);
}

inicializarDetalleProducto();
