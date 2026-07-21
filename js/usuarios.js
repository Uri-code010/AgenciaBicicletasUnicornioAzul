
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

function esUsuarioAdmin(usuario) {
    return Boolean(usuario && usuario.rol === "admin");
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

    //===============================
    // PREFERENCIAS DE PRIVACIDAD
    //===============================

    const preferencias =

    JSON.parse(

        localStorage.getItem("preferenciasCookies")

    );

    if(preferencias && preferencias.sesion){

        localStorage.setItem(

            STORAGE_KEYS.sesionActiva,

            "true"

        );

    }

    else{

        sessionStorage.setItem(

            STORAGE_KEYS.sesionActiva,

            "true"

        );

    }
    localStorage.setItem(STORAGE_KEYS.sesionActiva, "true");

    const recordar = document.getElementById("recordar");

    
    if (recordar?.checked) {

        localStorage.setItem("correoRecordado", usuario.correo);
        localStorage.setItem("passwordRecordada", usuario.password);

    } else {

        localStorage.removeItem("correoRecordado");
        localStorage.removeItem("passwordRecordada");

    }
}

function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEYS.usuarioActual);
    //localStorage.removeItem(STORAGE_KEYS.sesionActiva);
    localStorage.removeItem(STORAGE_KEYS.usuarioLegacy);
    
    mostrarToast("✅ Sesión cerrada correctamente.", "exito");

    window.location.href = "login.html";
}

function estaAutenticado() {
        return (

        localStorage.getItem(STORAGE_KEYS.sesionActiva) === "true"

        ||

        sessionStorage.getItem(STORAGE_KEYS.sesionActiva) === "true"

    );
    }

    //creación de usuarios
    document.addEventListener("DOMContentLoaded", () => {
    
        const formulario = document.getElementById("formRegistro");

        // ============================
        // Recordar contraseña
        // ============================
        
    
        const correoGuardado = localStorage.getItem("correoRecordado");

        const passwordGuardada = localStorage.getItem("passwordRecordada");
        const correoLogin = document.getElementById("correoLogin");
        const passwordLogin = document.getElementById("passwordLogin");
        const recordar = document.getElementById("recordar");

        if (correoLogin && passwordLogin && recordar && correoGuardado) {

            correoLogin.value = correoGuardado;
            passwordLogin.value = passwordGuardada;
            recordar.checked = true;

        }
    

        // ============================
        // Registro
        // ============================



        if (formulario) {

            formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            const usuario = {
                nombre: document.getElementById("nombre").value.trim(),
                correo: document.getElementById("correo").value.trim(),
                password: document.getElementById("password").value,
                rol: "cliente"
            };

            
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
        const correoPerfil =

        document.getElementById("correoUsuario");

        if(correoPerfil){

            correoPerfil.innerHTML = usuario.correo;

        }

        const letra = nombre ? nombre.charAt(0).toUpperCase() : "?";

        if (avatar) {
            avatar.textContent = letra;
        }

        if (saludo) {
            saludo.innerHTML = `¡Bienvenido, ${nombre || "Usuario"}! 👋`;
        }

        
        const carrito =
        JSON.parse(localStorage.getItem("carrito")) || [];

        const productos =
        document.getElementById("productosCarrito");

        if(productos){

            productos.textContent = carrito.length;

        }

        const pedidos =
        JSON.parse(localStorage.getItem("pedidos")) || [];

        const comprasRealizadas =
        document.getElementById("comprasRealizadas");

        if(comprasRealizadas){

            comprasRealizadas.textContent = pedidos.length;

        }
        //==============================
        // FAVORITOS
        //==============================

        const favoritos =

        JSON.parse(

        localStorage.getItem(

        "favoritos_" +

        usuario.correo.toLowerCase()

        )

        ) || [];

        const favoritosUsuario =

        document.getElementById("favoritosUsuario");

        if(favoritosUsuario){

            favoritosUsuario.textContent =

            favoritos.length;

        }

        //==============================
        // RESEÑAS
        //==============================

        const resenas =

        JSON.parse(

        localStorage.getItem("resenas")

        ) || [];

        const totalResenas =

        resenas.filter(r=>{

            return r.usuario==usuario.nombre;

        }).length;

        const resenasUsuario =

        document.getElementById("resenasUsuario");

        if(resenasUsuario){

            resenasUsuario.textContent =

            totalResenas;

        }
        const fecha = new Date();

        const ultimoAcceso =
        document.getElementById("ultimoAcceso");

        if(ultimoAcceso){

            ultimoAcceso.innerHTML =
            "Último acceso: " +
            fecha.toLocaleDateString();
        }
    }
    });

    // ==========================
    // RECUPERAR CONTRASEÑA
    // ==========================

const formRecuperar = document.getElementById("formRecuperar");

if (formRecuperar) {

    formRecuperar.addEventListener("submit", function (e) {

        e.preventDefault();

        const correo = document
            .getElementById("correoRecuperar")
            .value
            .trim()
            .toLowerCase();

        const nuevaPassword = document
            .getElementById("nuevaPassword")
            .value
            .trim();

        const mensaje = document.getElementById("mensajeRecuperar");

        // Validar que escriba contraseña
        if (nuevaPassword.length < 4) {

            mensaje.innerHTML =
                "❌ La contraseña debe tener al menos 4 caracteres.";

            return;
        }

        let usuarios = obtenerUsuariosRegistrados();

        const indice = usuarios.findIndex(
            usuario => usuario.correo.toLowerCase() === correo
        );

        if (indice === -1) {

            mensaje.innerHTML =
                "❌ No existe un usuario con ese correo.";

            return;
        }

        // Actualizar contraseña
        usuarios[indice].password = nuevaPassword;

        guardarUsuariosRegistrados(usuarios);

        // Si ese usuario tenía marcada la opción Recordarme,
        // también actualizamos la contraseña recordada.
        const correoRecordado =
            localStorage.getItem("correoRecordado");

        if (
            correoRecordado &&
            correoRecordado.toLowerCase() === correo
        ) {

            localStorage.setItem(
                "passwordRecordada",
                nuevaPassword
            );

        }

        mensaje.innerHTML =
            "✅ Contraseña actualizada correctamente.";

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    });

}
