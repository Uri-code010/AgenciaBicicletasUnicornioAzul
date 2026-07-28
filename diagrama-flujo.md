x
## 5) Fundamentacion

### 5.1 Analisis del problema

La gestion comercial de una agencia de bicicletas puede fragmentarse cuando los procesos de promocion, atencion al cliente, catalogo, ventas y seguimiento de pedidos se llevan de forma separada o manual. Esto provoca demoras, errores en la informacion de productos, poca trazabilidad del pedido y una experiencia de compra inconsistente.

En este proyecto, el problema central se aborda mediante una plataforma web que integra en un solo flujo:

1. Captacion inicial del usuario mediante anuncio de entrada.
2. Exploracion de catalogo con filtros y detalle de producto.
3. Compra en linea con carrito, checkout, confirmacion y detalle del pedido.
4. Gestion administrativa de productos, pedidos, clientes, promociones y reportes.
5. Participacion comunitaria para fortalecer confianza y fidelizacion.

### 5.2 Definicion del contexto

El sistema corresponde a una tienda digital de la Agencia de Bicicletas El Unicornio Azul, orientada a un modelo B2C con componentes C2C en la seccion de comunidad. La solucion esta implementada como aplicacion web de frontend (HTML, CSS y JavaScript), con persistencia local para simular operaciones de negocio.

Actores principales:

1. Visitante: navega contenido, ve anuncio y puede registrarse o iniciar sesion.
2. Cliente: consulta catalogo, administra carrito, compra, revisa historial y facturacion.
3. Administrador: gestiona catalogo, promociones, pedidos, clientes y estadisticas.

### 5.3 Alcance del sistema

Alcance incluido:

1. Flujo comercial completo desde anuncio hasta confirmacion de compra.
2. Gestion de sesion, registro, login, perfil e historial del cliente.
3. Modulo de carrito y checkout con validaciones, cupones y metodos de pago simulados.
4. Generacion de informacion de pedido, recibo descargable y consulta de detalle.
5. Panel administrativo con CRUD de productos y promociones.
6. Monitoreo de pedidos, cambio de estado y reportes de ventas.
7. Modulo de comunidad con reseñas e interaccion.

Fuera de alcance (version actual):

1. Integracion con pasarela de pago real.
2. Integracion con servicios logisticos externos.
3. Backend en servidor con base de datos persistente multiusuario.
4. Seguridad avanzada de autenticacion (OAuth, MFA, cifrado de credenciales).

### 5.4 Requerimientos funcionales

1. El sistema debe mostrar una pantalla de anuncio previa al acceso al inicio.
2. El sistema debe permitir registro, inicio de sesion, recuperacion de contrasena y cierre de sesion.
3. El sistema debe mostrar un menu dinamico segun estado de autenticacion.
4. El cliente debe poder buscar y filtrar productos por categoria y etiqueta.
5. El cliente debe poder consultar detalle de producto y agregar al carrito.
6. El sistema debe permitir actualizar cantidades, eliminar productos y vaciar carrito.
7. El checkout debe validar datos de envio, metodo de pago, terminos y politica.
8. El sistema debe permitir aplicar cupones de descuento validos.
9. Al confirmar compra, el sistema debe generar pedido, actualizar historial y redirigir a confirmacion.
10. El cliente debe poder consultar historial, detalle del pedido y facturacion.
11. El administrador debe poder gestionar productos y promociones (alta, edicion, eliminacion).
12. El administrador debe poder visualizar pedidos, cambiar estado y consultar reportes.
13. El sistema debe registrar notificaciones asociadas a cambios de estado de pedido.

### 5.5 Requerimientos no funcionales

1. Usabilidad: navegacion clara, mensajes de retroalimentacion y flujo de compra comprensible.
2. Rendimiento: tiempos de respuesta inmediatos para consultas locales y renderizado de vistas.
3. Disponibilidad: ejecucion en navegador moderno sin depender de infraestructura externa.
4. Mantenibilidad: estructura modular por paginas y scripts especializados.
5. Portabilidad: compatibilidad en dispositivos de escritorio y moviles.
6. Escalabilidad conceptual: arquitectura preparada para migrar a backend y base de datos.
7. Seguridad basica: validaciones de formularios y control de acceso por sesion en cliente.

### 5.6 Reglas de negocio

1. Un usuario debe iniciar sesion para agregar productos al carrito o comprar.
2. El carrito se almacena por usuario mediante llave asociada al correo.
3. Un pedido solo se confirma si se aceptan politica de devoluciones y terminos.
4. El total del pedido se calcula con formula:

$$
	ext{Total} = \text{Subtotal} - \text{Descuento} + \text{Envio}
$$

5. Los cupones solo aplican si pertenecen al conjunto definido por el sistema.
6. El estado inicial de todo pedido es Pedido recibido.
7. El administrador puede actualizar estados del pedido durante el ciclo de atencion.
8. La informacion de compra confirmada se guarda en historial y ultima compra para consulta posterior.

### 5.7 Justificacion del proyecto

La propuesta se justifica porque integra procesos comerciales clave en una experiencia digital unificada, lo cual mejora la atencion al cliente, incrementa la conversion de ventas y facilita la gestion operativa de la agencia.

Desde la perspectiva academica y tecnica, el proyecto permite:

1. Modelar un flujo e-commerce completo con roles diferenciados.
2. Aplicar principios de diseno modular en frontend.
3. Validar reglas de negocio reales en un entorno controlado.
4. Establecer una base funcional para evolucionar a una arquitectura con backend.

En consecuencia, el sistema es viable como prototipo funcional y como punto de partida para una solucion productiva de comercio digital para bicicletas y servicios relacionados.
