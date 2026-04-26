# Guion para la Exposición del Proyecto Autolink (TFG)

Este documento está adaptado **estrictamente a la rúbrica oficial** de evaluación, garantizando un mínimo de 15 diapositivas que cubren todas las competencias de 1º y 2º de DAW (Bases de datos, Programación, Frontend, Backend, Sistemas y Despliegue). La exposición está calculada para durar entre 10 y 15 minutos.

---

## Diapositiva 1: Portada e Introducción
*   **Contenido visual:** Título "Autolink", tu nombre, curso académico 2025-26 y una captura bonita de la portada de la web.
*   **Qué explicar:** 
    > "Buenos días al tribunal. Mi nombre es [Tu Nombre] y vengo a presentaros 'Autolink', mi Proyecto Intermodular. Se trata de una plataforma web diseñada para revolucionar y dotar de seguridad la compraventa de vehículos entre particulares y profesionales."

## Diapositiva 2: Justificación y Objetivos
*   **Contenido visual:** Puntos clave (Problema vs Solución).
*   **Qué explicar:** 
    > "La necesidad de este proyecto surge al detectar la falta de seguridad y el exceso de fraude en portales de clasificados tradicionales. El objetivo principal ha sido crear un entorno seguro, donde las reservas y el contacto se realicen entre usuarios registrados de forma privada, contando con la figura de un administrador encargado de dar un 'sello de legitimidad' a los vehículos verificados para evitar engaños."

## Diapositiva 3: Metodología y Ciclo de Vida
*   **Contenido visual:** Fases de desarrollo (Análisis, Diseño, Desarrollo, Pruebas, Despliegue).
*   **Qué explicar:** 
    > "En cuanto a la metodología, en lugar de utilizar herramientas externas complejas, he seguido un desarrollo iterativo y autónomo marcado por el propio ritmo de los módulos del curso. Comencé sentando las bases con el diseño relacional de la base de datos, para luego programar el backend, conectarle el frontend reactivo y finalizar con el despliegue del sistema."

## Diapositiva 4: Análisis del Sistema (Casos de Uso)
*   **Contenido visual:** Tu Diagrama de Casos de Uso (mostrando la herencia de roles).
*   **Qué explicar:** 
    > "A nivel de ingeniería de software, el sistema se basa en un Control de Acceso Basado en Roles (RBAC). El usuario Invitado tiene acceso al catálogo. El Comprador puede, además, iniciar reservas y contactar. El Vendedor gestiona su propio inventario de coches (CRUD); y el Administrador obtiene permisos especiales exclusivamente para revisar la información de los vehículos anunciados y verificarlos."

## Diapositiva 5: Stack Tecnológico
*   **Contenido visual:** Logos de Angular 21, Spring Boot 3, MariaDB, Tailwind CSS y Docker.
*   **Qué explicar:** 
    > "En cuanto a tecnología, he optado por una arquitectura de microservicios. En el Frontend utilizo Angular 21 y Tailwind CSS para el diseño. El Backend es una API REST robusta construida con Java 21 y Spring Boot 3. Los datos persisten en MariaDB y todo el ecosistema está orquestado con Docker."

## Diapositiva 6: Diseño de Base de Datos (Modelo E/R)
*   **Contenido visual:** Diagrama Entidad-Relación.
*   **Qué explicar:** 
    > "Aplicando los conocimientos de Bases de Datos, diseñé un modelo relacional normalizado. Destaca la tabla transaccional de 'Ventas', que actúa como entidad asociativa conectando al Vendedor, al Cliente y al Vehículo. Además, he garantizado la integridad de datos definiendo claves únicas (UK) estrictas para campos como el DNI o el correo."

## Diapositiva 7: Arquitectura del Software (Diagrama de Clases)
*   **Contenido visual:** Diagrama de Clases.
*   **Qué explicar:** 
    > "Aquí observamos el Modelo de Dominio de la aplicación. Para estructurar este modelo he utilizado JPA e Hibernate. Aunque este diagrama representa las entidades reales de la base de datos, internamente mi aplicación utiliza el patrón DTO (Data Transfer Object). Esto impide que datos sensibles como las contraseñas viajen a la capa de presentación."

## Diapositiva 8: Desarrollo Backend (Lógica de Negocio)
*   **Contenido visual:** Ejemplo breve de código de un Servicio en Java o estructura de carpetas REST.
*   **Qué explicar:** 
    > "El desarrollo en el entorno servidor ha sido uno de los pilares del proyecto. He programado la lógica para asegurar que solo los dueños legítimos puedan editar o eliminar sus propios coches. Toda la comunicación entre el servidor y el cliente se realiza mediante Endpoints RESTful con manejo centralizado de excepciones."

## Diapositiva 9: Implementación de Seguridad y Autenticación
*   **Contenido visual:** Diagrama de flujo de JWT o el código del Filtro de Spring.
*   **Qué explicar:** 
    > "La seguridad de acceso funciona bajo una arquitectura 'Stateless' pura. Cuando un usuario hace login, se genera un JSON Web Token (JWT). El servidor no almacena sesiones en memoria; en cada petición, un Filtro de Spring intercepta la cabecera, verifica el token y extrae el rol en tiempo real, bloqueando cualquier acceso no autorizado."

## Diapositiva 10: Desarrollo Frontend e Interfaces Web
*   **Contenido visual:** Captura de la web mostrando el diseño de componentes.
*   **Qué explicar:** 
    > "Para el entorno cliente, el diseño de la interfaz ha sido Mobile-First. En lugar de escribir CSS tradicional, he utilizado el framework Tailwind CSS. Este enfoque basado en clases de utilidad me ha permitido diseñar de forma muy rápida una interfaz completamente responsiva, que además reacciona de forma inmediata a la interacción del usuario gracias al sistema Signals de Angular."

## Diapositiva 11: Consumo de APIs y Almacenamiento en Nube
*   **Contenido visual:** Logotipo de ImgBB y flujo de subida de imágenes.
*   **Qué explicar:** 
    > "Para optimizar el rendimiento del servidor y no saturar el disco con fotos de vehículos, integré la API externa de ImgBB. Al subir un vehículo, el Backend codifica la imagen, realiza una petición REST a la nube, y guarda en MariaDB únicamente la URL generada. Esto agiliza enormemente los tiempos de respuesta de la base de datos."

## Diapositiva 12: Entornos de Despliegue (Docker)
*   **Contenido visual:** Captura de tu archivo `docker-compose.yml`.
*   **Qué explicar:** 
    > "Cubriendo las competencias de despliegue, he contenedorizado toda la aplicación. A través de Docker Compose, he configurado contenedores independientes para la Base de Datos, el Backend en Java y el Frontend, vinculándolos en una red interna privada para que puedan comunicarse entre sí."

## Diapositiva 13: Sistemas Informáticos y Servidor VPS
*   **Contenido visual:** Captura de pantalla de la terminal de Ubuntu / entorno real web.
*   **Qué explicar:** 
    > "Para la puesta en producción, he alojado este sistema en un servidor VPS con Ubuntu. La ventaja de haber usado Docker es que no tuve que realizar complejas configuraciones de red o apertura de puertos directamente en el sistema operativo; únicamente tuve que mapear los puertos en mi archivo Docker Compose, logrando un despliegue rápido y seguro hacia el exterior."

## Diapositiva 14: Conclusiones y Tiempos
*   **Contenido visual:** Resumen de las ~500 horas invertidas y grado de cumplimiento.
*   **Qué explicar:** 
    > "Llegando a la recta final, estimo que el proyecto ha requerido una dedicación de aproximadamente unas 500 horas a lo largo del curso. A pesar de los retos técnicos, el grado de cumplimiento de los objetivos fijados inicialmente ha sido total, logrando un sistema funcional de principio a fin."

## Diapositiva 15: Propuestas de Futuro y Despedida
*   **Contenido visual:** Lista de mejoras (Chat, Pagos, Favoritos).
*   **Qué explicar:** 
    > "De cara al futuro, la estructura del proyecto está preparada para escalar. Entre las ampliaciones que tengo documentadas destaco la adición de un chat en tiempo real, un sistema de Favoritos para el usuario y la integración de una pasarela de pagos. 
    > 
    > Muchas gracias por vuestra atención. Con esto doy paso a la demostración práctica y quedo a vuestra disposición para el turno de preguntas."

---

## ENLACE: Transición a la Demostración Práctica
*   **Paso 1: Cambio de pantalla.** "A continuación voy a mostrar el funcionamiento en vivo de la aplicación." Sal de la presentación y abre la web en el navegador.
*   **Paso 2: Mostrar el Frontend (Invitado).** Enseña el diseño responsive de la tienda (gracias a Tailwind CSS) y cómo buscar coches.
*   **Paso 3: Funciones de Vendedor.** Entra con cuenta de Vendedor. Sube un coche (así muestras la integración con ImgBB).
*   **Paso 4: Auditoría del Administrador.** Entra como Administrador y enséñales que el admin no revisa correos ni ventas, solo va a los vehículos y verifica la legitimidad de la información.
*   **Paso 5: Proceso de Compra.** Entra como Cliente y haz una reserva del coche verificado.
*   **Paso 6: Gestión de Venta.** Vuelve al Vendedor y muestra cómo acepta la reserva.
*   **Paso 7: Despedida:** Cierra la presentación esperando las preguntas del tribunal.
