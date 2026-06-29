
const STORAGE_KEYS = {
    usuarios: "usuariosRegistrados",
    usuarioActual: "usuarioActual",
    sesionActiva: "sesionActiva",
    usuarioLegacy: "usuario"
};

function obtenerUsuariosRegistrados() {
    try {
        const guardados = localStorage.getItem(STORAGE_KEYS.usuarios);
        if (guardados) {
            const usuariosParseados = JSON.parse(guardados);
            if (Array.isArray(usuariosParseados)) {
                return usuariosParseados;
            }
            if (usuariosParseados && usuariosParseados.correo) {
                return [usuariosParseados];
            }
        }
    } catch (error) {
        console.error("No se pudieron leer los usuarios guardados", error);
    }

    const usuarios = [];

    const usuarioActual = localStorage.getItem(STORAGE_KEYS.usuarioActual);
    if (usuarioActual) {
        try {
            const usuario = JSON.parse(usuarioActual);
            if (usuario && usuario.correo) {
                usuarios.push(usuario);
            }
        } catch (error) {
            console.error("No se pudo leer el usuario actual del almacenamiento", error);
        }
    }

    const usuarioLegacy = localStorage.getItem(STORAGE_KEYS.usuarioLegacy);
    if (usuarioLegacy) {
        try {
            const usuario = JSON.parse(usuarioLegacy);
            if (usuario && usuario.correo) {
                const yaExiste = usuarios.some((u) => u.correo.toLowerCase() === usuario.correo.toLowerCase());
                if (!yaExiste) {
                    usuarios.push(usuario);
                }
            }
        } catch (error) {
            console.error("No se pudo leer el usuario legado del almacenamiento", error);
        }
    }

    if (usuarios.length > 0) {
        guardarUsuariosRegistrados(usuarios);
    }

    return usuarios;
}

function guardarUsuariosRegistrados(usuarios) {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
}

function obtenerUsuarioActual() {
    try {
        const usuarioGuardado = localStorage.getItem(STORAGE_KEYS.usuarioActual);
        if (usuarioGuardado) {
            return JSON.parse(usuarioGuardado);
        }
    } catch (error) {
        console.error("No se pudo leer el usuario actual", error);
    }

    const usuarioLegacy = localStorage.getItem(STORAGE_KEYS.usuarioLegacy);
    if (usuarioLegacy) {
        try {
            const usuario = JSON.parse(usuarioLegacy);
            if (usuario && usuario.correo) {
                localStorage.setItem(STORAGE_KEYS.usuarioActual, usuarioLegacy);
                return usuario;
            }
        } catch (error) {
            console.error("No se pudo leer el usuario legado", error);
        }
    }

    return null;
}

//inicio de sesion 
function iniciarSesion(usuario) {
    if (!usuario || !usuario.correo) {
        return;      
    }

    const correoNormalizado = usuario.correo.toLowerCase();
    const usuarios = obtenerUsuariosRegistrados();
    const indice = usuarios.findIndex((u) => u.correo.toLowerCase() === correoNormalizado);

    const usuarioFinal = {
        ...usuario,
        correo: correoNormalizado
    };

    if (indice >= 0) {
        usuarios[indice] = usuarioFinal;
    } else {
        usuarios.push(usuarioFinal);
    }

    guardarUsuariosRegistrados(usuarios);
    localStorage.setItem(STORAGE_KEYS.usuarioActual, JSON.stringify(usuarioFinal));
    localStorage.setItem(STORAGE_KEYS.sesionActiva, "true");
}

function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEYS.usuarioActual);
    localStorage.removeItem(STORAGE_KEYS.sesionActiva);
    localStorage.removeItem(STORAGE_KEYS.usuarioLegacy);
    window.location.href = "login.html";
}

function estaAutenticado() {
    return localStorage.getItem(STORAGE_KEYS.sesionActiva) === "true";
}

//creación de usuarios
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formRegistro");

    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            const usuario = {
                nombre: document.getElementById("nombre").value.trim(),
                correo: document.getElementById("correo").value.trim(),
                password: document.getElementById("password").value
            };

            iniciarSesion(usuario);

            iniciarSesion(usuario);

            const mensajeRegistro = document.getElementById("mensajeRegistro");

            mensajeRegistro.innerHTML =
            "✅ Usuario registrado correctamente";

            this.reset();

            setTimeout(() => {

                window.location.href = "perfil.html";

            }, 1000);
        });
    }

    const login = document.getElementById("formLogin");

    if (login) {
        login.addEventListener("submit", function (e) {
            e.preventDefault();

            const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
            const password = document.getElementById("passwordLogin").value;
            const usuarios = obtenerUsuariosRegistrados();
            const usuarioGuardado = usuarios.find((u) => u.correo.toLowerCase() === correo && u.password === password);

            if (!usuarioGuardado) {
                const mensajeLogin = document.getElementById("mensajeLogin");
                if (mensajeLogin) {
                    mensajeLogin.innerHTML = "❌ No hay un usuario registrado con esas credenciales";
                }
                return;
            }

            iniciarSesion(usuarioGuardado);

            const mensajeLogin = document.getElementById("mensajeLogin");
            if (mensajeLogin) {
                mensajeLogin.innerHTML = "✅ Usuario ha accedido correctamente";
            }

            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 1000);
        });
    }

    const avatar = document.getElementById("avatarUsuario");
    const saludo = document.getElementById("saludoUsuario");

    if (avatar || saludo) {
        const usuario = obtenerUsuarioActual();

        if (!estaAutenticado() || !usuario) {
            if (avatar || saludo) {
                if (avatar) avatar.textContent = "?";
                if (saludo) saludo.innerHTML = "No hay sesión activa";
            }

            setTimeout(() => {
                window.location.href = "login.html";
            }, 800);
            return;
        }

        // Si existe sección de datos, la llenamos; si no, igual mostramos avatar/saludo.
        const datosPerfil = document.getElementById("datosPerfil");
        if (datosPerfil) {
            datosPerfil.innerHTML = `
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Correo:</strong> ${usuario.correo}</p>
            `;
        }

        const nombre = (usuario.nombre || "").trim();
        const letra = nombre ? nombre.charAt(0).toUpperCase() : "?";

        if (avatar) {
            avatar.textContent = letra;
        }

        if (saludo) {
            saludo.innerHTML = `¡Bienvenido, ${nombre || "Usuario"}! 👋`;
        }

        
        const carrito =
        JSON.parse(localStorage.getItem("carrito")) || [];

        document.getElementById("productosCarrito").textContent =
        carrito.length;

        const historial =
        JSON.parse(localStorage.getItem("historial")) || [];

        document.getElementById("comprasRealizadas").textContent =
        historial.length;

        const fecha = new Date();

        document.getElementById("ultimoAcceso").innerHTML =
        "Último acceso: " + fecha.toLocaleDateString();
    }
});

//recuperación de contraseseña
const recuperar =
document.getElementById("formRecuperar");

    if(recuperar){

        recuperar.addEventListener("submit",function(e){

        e.preventDefault();

        const correo =
        document.getElementById("correoRecuperar").value
        .toLowerCase();

        const nuevaPassword =
        document.getElementById("nuevaPassword").value;

        let usuarios =
        obtenerUsuariosRegistrados();

        const indice =
        usuarios.findIndex(
         u => u.correo.toLowerCase()==correo
        );

    if(indice==-1){

        document.getElementById("mensajeRecuperar").innerHTML=

        "❌ No existe un usuario con ese correo.";

        return;

    }
    

    usuarios[indice].password=
    nuevaPassword; 

    guardarUsuariosRegistrados(usuarios);

    document.getElementById("mensajeRecuperar").innerHTML=

    "✅ Contraseña actualizada correctamente.";

    setTimeout(()=>{

    window.location.href="login.html";

    },1500);

    });

}