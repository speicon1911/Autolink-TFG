# Guion para la Exposición del Proyecto Autolink

Este documento está diseñado como una guía de apoyo para tu presentación. En cada diapositiva encontrarás un resumen de los puntos clave y una sección de **"Qué explicar"**, que es una propuesta de lo que puedes decir en voz alta.

---

## Diapositiva 1: Introducción y Justificación del Proyecto
*   **Contenido visual:** Título "Autolink", tu nombre, y un resumen del objetivo en viñetas.
*   **Qué explicar:** 
    > "Buenos días. Os presento Autolink, una plataforma digital diseñada para conectar a compradores y vendedores de vehículos. La motivación detrás de este proyecto nace de la necesidad de ofrecer un entorno de compraventa de coches cómodo, rápido y, sobre todo, seguro. El objetivo no es procesar el pago monetario del coche, sino facilitar el escaparate, la reserva y el contacto comercial, todo ello bajo la supervisión de un administrador que previene los fraudes."

---

## Diapositiva 2: Tecnologías y Arquitectura del Sistema
*   **Contenido visual:** Logos de las tecnologías (Angular, Spring Boot, Java, MariaDB, Docker) y un pequeño esquema de los 3 bloques (Frontend, Backend, Base de Datos).
*   **Qué explicar:** 
    > "Para llevar a cabo este proyecto, he implementado una arquitectura de Microservicios desacoplados. 
    > * Como **Backend** he utilizado Java 21 con el framework Spring Boot 3, creando una API REST robusta.
    > * En el **Frontend**, he desarrollado una Single Page Application (SPA) con Angular 21, utilizando 'Signals' para lograr una interfaz moderna, rápida y reactiva.
    > * La persistencia de datos está montada sobre **MariaDB**, y todo el ecosistema está contenedorizado y orquestado mediante **Docker**, lo que permite un despliegue rápido y seguro en cualquier servidor o VPS."

---

## Diapositiva 3: Historias de Usuario Principales
*   **Contenido visual:** Tres columnas o bloques (Comprador, Vendedor, Administrador).
*   **Qué explicar:** 
    > "Toda esta tecnología se ha puesto al servicio de 3 perfiles de usuario distintos:
    > *   **El Cliente o Comprador**, cuya necesidad principal es poder filtrar un catálogo inmenso para encontrar su coche ideal y llevar un registro de sus intenciones de compra.
    > *   **El Vendedor**, que necesita un panel de control intuitivo para gestionar su stock y revisar qué clientes están interesados en sus vehículos.
    > *   **El Administrador**, que es el auditor de la plataforma. Su trabajo es verificar que los anuncios publicados sean legítimos, otorgándoles un sello de confianza."

---

## Diapositiva 4: Diagrama de Casos de Uso
*   **Contenido visual:** El diagrama de Casos de Uso.
*   **Qué explicar:** 
    > "En este diagrama reflejamos el control de acceso según el rol. Las acciones básicas como ver el catálogo público no requieren registro. Sin embargo, al iniciar sesión, las capacidades cambian: el Cliente inicia una reserva; el Vendedor recibe esa solicitud en su panel y decide aceptarla o anularla; y el Administrador se centra en casos de uso de moderación, como verificar la veracidad de los vehículos anunciados."

---

## Diapositiva 5: Diagrama de Clases
*   **Contenido visual:** El diagrama de Clases del backend.
*   **Qué explicar:** 
    > "Pasando a la estructura interna del Backend, nuestro diseño orientado a objetos tiene como núcleo la clase `Persona`, que engloba los datos de acceso y de la cual se derivan los permisos. 
    > Un vendedor gestiona una lista de objetos `Vehiculo`, y cada vehículo delega sus fotos en la clase `ImagenVehiculo`. Por último, la clase `Venta` es fundamental: actúa como el contrato o reserva, vinculando al `Cliente` (el comprador), con un `Vehiculo` y su `Vendedor`."

---

## Diapositiva 6: Modelo Entidad-Relación (E/R)
*   **Contenido visual:** Diagrama E/R de la Base de Datos.
*   **Qué explicar:** 
    > "A nivel de base de datos relacional, el diseño asegura la integridad referencial. Es decir, evitamos a toda costa que existan 'datos huérfanos'. 
    > Apoyándonos en claves foráneas estrictas, garantizamos que un vehículo no pueda existir si no está asociado a un ID de vendedor real y a una Marca predefinida del catálogo. La tabla de ventas registra el histórico relacionando a nivel de base de datos el ID del comprador con el ID del coche."

---

## Diapositiva 7: Retos del Código - Autenticación JWT y Stateless
*   **Contenido visual:** Esquema o fragmento de código sobre JWT y el AuthInterceptor.
*   **Qué explicar:** 
    > "Uno de los mayores retos fue implementar un sistema de seguridad avanzado. En lugar de usar sesiones tradicionales, implementé una **arquitectura Stateless (sin estado) usando JWT (JSON Web Tokens)**.
    > Cuando el usuario hace login, Spring Boot valida sus credenciales y genera un Token firmado algorítmicamente que contiene el ID y su Rol. El servidor no guarda ninguna sesión. 
    > A partir de ahí, en Angular programé un **Interceptor** que atrapa cada petición saliente y le pega el Token en la cabecera automáticamente. Al llegar al servidor, un **Filtro de Intercepción** verifica la firma del token. Si es correcto, da acceso; si no, lo deniega. Esto hace que la API sea increíblemente rápida y segura."

---

## Diapositiva 8: Retos del Código - Prevención de Fraudes y Nube (ImgBB)
*   **Contenido visual:** Código o esquema conceptual de validación de propiedad y guardado de imágenes.
*   **Qué explicar:** 
    > "Otro gran reto fue evitar fraudes, como que alguien modificara un coche que no es suyo manipulando la URL. La solución fue aplicar **Lógica de Propiedad** cruzando datos: antes de permitir editar un anuncio, el servidor extrae el ID directamente del token seguro del usuario, y comprueba que ese ID coincide exactamente con el dueño del vehículo en la base de datos.
    > Además, para evitar que el disco de mi servidor se llenara con fotos de coches, integré la API de **ImgBB**. Cuando un vendedor sube una foto, mi servidor backend la convierte a Base64 y la manda a la nube mediante una llamada REST. Mi base de datos solo guarda el enlace de la foto (URL), optimizando radicalmente el rendimiento de la aplicación."

---

## Diapositiva 9: Conclusiones
*   **Contenido visual:** Resumen breve (100% completado, 500 horas, etc.)
*   **Qué explicar:** 
    > "En conclusión, tras aproximadamente 500 horas de desarrollo, el proyecto ha cumplido sus objetivos al 100%. He logrado construir una plataforma robusta, que usa tecnologías de vanguardia (como Signals en Angular) y patrones de diseño reales (Microservicios, DTOs). Todo el sistema está desplegado de forma profesional utilizando Docker. 
    > 
    > Con esto termina la parte teórica y de arquitectura del proyecto."

---

## ENLACE: Transición a la Demostración Práctica (Aplicación)
*(Esta sección es para ti, para saber cómo pivotar de las diapositivas a enseñar la web real).*

*   **Paso 1: Cerrar la presentación.**
    > "A continuación, para que podáis ver cómo todos estos diagramas, seguridad y tecnologías funcionan en tiempo real, voy a pasar a realizar una demostración práctica de Autolink."
*   **Paso 2: Cambiar de pantalla.** Sal de PowerPoint/PDF y abre el navegador donde tengas Autolink funcionando (asegúrate de tenerlo abierto y cargado de antemano).
*   **Paso 3: Guion de la Demostración (Qué enseñar y en qué orden):**
    1.  **Vista Pública:** Muestra la página principal (catálogo) sin estar logueado. Enseña los filtros de búsqueda y los vehículos con el sello de "Verificado". Menciona el diseño Responsive y la fluidez.
    2.  **Rol Vendedor:** Haz login con una cuenta de vendedor. Ve a su panel de control, enseña cómo crear un nuevo anuncio subiendo una imagen, y muestra cómo el anuncio aparece como "No verificado" por seguridad.
    3.  **Rol Administrador:** Haz login (o usa otro navegador en incógnito) con el admin. Ve al panel de verificación de vehículos. Muestra cómo apruebas el vehículo que acaba de subir el vendedor.
    4.  **Rol Comprador:** Inicia sesión con un cliente. Busca el coche recién verificado, haz clic en "Comprar" o "Reservar". Muestra el panel de "Mis Compras" donde aparece "En progreso".
    5.  **Cierre de la Demo:** Vuelve a la pantalla del Vendedor, muestra cómo le ha llegado esa solicitud y pulsa en "Aceptar venta" o "Marcar como realizada" para cerrar el ciclo. 
    6.  **Despedida:** "Como habéis podido comprobar, el flujo de compra, la restricción de vistas por roles y la inyección de los tokens de seguridad funcionan perfectamente de principio a fin. Quedo a vuestra disposición para cualquier duda o pregunta."
