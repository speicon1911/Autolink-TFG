# Guía de Arquitectura de Despliegue Seguro con Nginx para Autolink (TFG)

Este documento detalla la justificación teórica, los beneficios de seguridad, la configuración técnica y los pasos prácticos para desplegar la plataforma **Autolink** de forma segura en un Servidor Privado Virtual (VPS) utilizando **Nginx** como Proxy Inverso. 

Esta guía ha sido diseñada específicamente para la arquitectura actual de tu TFG (Angular en Frontend, Spring Boot en Backend, MariaDB en Base de Datos y phpMyAdmin como panel de administración).

---

## 1. Nginx vs Despliegue Directo (Sin Nginx): ¿Por qué es fundamental?

Cuando despliegas una aplicación en producción sin un Proxy Inverso (Nginx), tus servicios internos (Angular en el puerto `4000`, Spring Boot en el `8082`, MariaDB en el `3306` y phpMyAdmin en el `80`) tienen que **exponerse directamente al internet público**. Esto introduce graves riesgos de seguridad, rendimiento y escalabilidad.

A continuación, se detalla un análisis comparativo en formato tabla que demuestra por qué un cliente/empresa exigiría Nginx (o similar) antes de adquirir tu software:

| Característica / Aspecto | Despliegue Directo (Sin Nginx) ❌ | Despliegue con Nginx (Proxy Inverso) |
| :--- | :--- | :--- |
| **Exposición de Puertos** | Todos los puertos internos (`8080`, `8082`, `3306`) quedan abiertos a escaneos y ataques de fuerza bruta. | **Aislamiento Total.** Solo los puertos `80` (HTTP) y `443` (HTTPS) están expuestos. El resto de servicios están en una red interna privada. |
| **Gestión de SSL/TLS (HTTPS)** | Debes configurar certificados SSL individualmente en Spring Boot (usando Keystores `.p12`) y en Angular. Complejo y difícil de renovar. | **Terminación SSL Centralizada.** Nginx gestiona todo el cifrado SSL. Spring Boot y Angular se comunican de forma ultra-rápida en HTTP interno. |
| **Cabeceras de Seguridad** | Tienes que programarlas manualmente en Java/Spring Security y Angular una por una. | **Centralizado y Homogéneo.** Nginx inyecta cabeceras de seguridad globales (`HSTS`, `CSP`, `X-Frame-Options`) a todas las peticiones. |
| **Mitigación de Ataques (DDoS)** | Una oleada de peticiones maliciosas satura directamente la JVM de Spring Boot, tirando el servidor por completo. | **Rate Limiting.** Nginx filtra y limita la frecuencia de peticiones antes de que toquen tu backend Java, actuando como escudo. |
| **Soporte de WebSockets** | Las conexiones persistentes WebSocket se conectan directo a la app, consumiendo hilos de ejecución rápidamente. | Nginx maneja las conexiones WebSocket concurrentes de forma altamente eficiente mediante su modelo asíncrono y no bloqueante. |
| **Gestión de phpMyAdmin** | Expuesto públicamente en un puerto alternativo (ej. `8081`), propenso a ataques automatizados de inyección de contraseñas. | Oculto tras el proxy. Se puede configurar bajo una sub-ruta privada (ej. `/admin-pma`) con protección de contraseña adicional. |

---

## 2. Configuración Práctica para Autolink

Para implementar esta arquitectura en tu TFG, crearemos una carpeta de configuración para Nginx y actualizaremos tu configuración de Docker.

### 2.1. Arquitectura de Red con Docker y Nginx
En lugar de abrir puertos públicos para cada contenedor, utilizaremos la red interna de Docker (`bridge`). **Solo Nginx tendrá sus puertos abiertos al mundo exterior.**

```mermaid
graph TD
    Cliente[Cliente Web / Móvil] -->|Puerto 80 / 443 | Nginx{Nginx Proxy Inverso}
    
    subgraph Red Interna Privada de Docker (Segura)
        Nginx -->|http://frontend:4000| Frontend[Angular SSR]
        Nginx -->|http://backend:8082| Backend[Spring Boot API]
        Nginx -->|ws://backend:8082/ws| WebSockets[Servicio WebSocket]
        Nginx -->|http://phpmyadmin:80| phpMyAdmin[Panel MariaDB]
        Backend -->|Puerto 3306| DB[(MariaDB)]
        phpMyAdmin -->|Puerto 3306| DB
    end
    
    style Cliente fill:#f9f,stroke:#333,stroke-width:2px
    style Nginx fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style Red Interna Privada de Docker (Segura) fill:#f5f5f5,stroke:#7f8c8d,stroke-width:2px,stroke-dasharray: 5 5
```

---

### 2.2. El Archivo de Configuración de Nginx (`nginx.conf`)

Crea un archivo llamado `nginx.conf` en una nueva carpeta `/nginx` en la raíz de tu proyecto. Este archivo realiza las siguientes tareas cruciales:
1. **Redirección Forzada a HTTPS**: Todo tráfico HTTP (puerto 80) se redirige a HTTPS (puerto 443).
2. **Terminación SSL**: Carga los certificados SSL generados por Certbot/Let's Encrypt.
3. **Cabeceras de Seguridad**: Añade políticas HSTS, anti-clickjacking y prevención de sniffing.
4. **Configuración de Rutas (Reverse Proxy)**:
   - `/` redirige al Frontend (Angular).
   - `/auth/`, `/personas/`, `/vehiculos/`, `/ventas/`, `/marcas/`, `/mensajes/`, `/error` y `/api/contacto` al Backend (Spring Boot).
   - `/ws/` gestiona de forma segura los WebSockets.
   - `/admin-pma/` sirve phpMyAdmin de manera oculta y segura.
5. **Rate Limiting**: Limita las peticiones a un máximo de 10 peticiones por segundo por IP, con ráfagas de 20, para evitar ataques de denegación de servicio (DoS).

A continuación tienes el archivo completo de configuración:

```nginx
# nginx/nginx.conf

# Definición de límites de peticiones (Rate Limiting)
# 10 megabytes de zona (almacena ~160,000 IPs) a 10 peticiones/segundo
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Configuración del servidor
server {
    listen 80;
    listen [::]:80;
    server_name autolink-tfg.duckdns.org www.autolink-tfg.duckdns.org;

    # Redirección de HTTP a HTTPS de forma permanente (301)
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name autolink-tfg.duckdns.org www.autolink-tfg.duckdns.org;

    # Rutas a los certificados SSL (Let's Encrypt se encargará de crearlos en esta ruta del VPS)
    ssl_certificate /etc/letsencrypt/live/autolink-tfg.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/autolink-tfg.duckdns.org/privkey.pem;

    # Parámetros de Seguridad SSL recomendados por Mozilla
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Cabeceras de Seguridad Globales (Security Headers)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self';" always;

    # Tamaño máximo permitido para subida de imágenes (ej. fotos de vehículos)
    client_max_body_size 10M;

    # Gzip para comprimir archivos estáticos y hacer la web más rápida
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # --- RUTA 1: FRONTEND (Angular) ---
    location / {
        proxy_pass http://frontend:4000; # Nombre del servicio en docker-compose
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # --- RUTA 2: BACKEND (Spring Boot API) ---
    # Capturamos todas las rutas de endpoints de Spring Boot
    location ~ ^/(auth|personas|vehiculos|ventas|marcas|mensajes|error|api/contacto) {
        # Aplicamos límite de peticiones para proteger el backend de saturación
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://backend:8082; # Puerto real expuesto dentro del contenedor Spring Boot
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Desactivamos el buffering para respuestas de streaming rápidas
        proxy_buffering off;
    }

    # --- RUTA 3: WEBSOCKETS (/ws) ---
    # Soporte específico para mensajería y chat interactivo WebSocket en tu backend
    location /ws {
        proxy_pass http://backend:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s; # Mantiene la conexión abierta 24h sin cerrarse por timeout
    }

    # --- RUTA 4: phpMyAdmin Seguro (/admin-pma) ---
    # Cambiamos la ruta pública para que los bots no puedan adivinar el login de base de datos
    location /admin-pma/ {
        proxy_pass http://phpmyadmin/; # El "/" final reescribe la URL eliminando "/admin-pma"
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### 2.3. Actualización de `docker-compose.prod.yml` Seguro

Para incorporar Nginx, modificaremos el archivo de producción de forma que **ninguno** de los contenedores exponga puertos al exterior (eliminamos o comentamos las líneas de `ports:` vulnerables) excepto Nginx. 

Aquí tienes cómo debe quedar tu `docker-compose.prod.yml`:

```yaml
services:
  # SERVICIO DE BASE DE DATOS (MariaDB)
  db:
    image: speicon1911/autolink-tfg:mariadb
    container_name: autolink-db
    restart: always
    # ELIMINADO EL PUERTO HASTA EL EXTERIOR ("3306:3306")
    # De esta manera la base de datos queda inaccesible desde el exterior del VPS.
    # Solo es accesible internamente por el Backend y phpMyAdmin.
    expose:
      - "3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
    volumes:
      - mariadb_data:/var/lib/mysql

  # SERVICIO DE ADMINISTRACIÓN (phpMyAdmin)
  phpmyadmin:
    image: speicon1911/autolink-tfg:phpmyadmin
    container_name: autolink-pma
    restart: always
    # ELIMINADO EL PUERTO EXTERNO ("8081:80")
    # phpMyAdmin queda protegido tras el Nginx bajo el path privado "/admin-pma/".
    expose:
      - "80"
    environment:
      - PMA_HOST=db
      - PMA_PORT=3306
    depends_on:
      - db

  # SERVICIO BACKEND (Spring Boot)
  backend:
    image: speicon1911/autolink-tfg:backend
    container_name: autolink-backend
    restart: always
    # ELIMINADO EL PUERTO EXTERNO ("8080:8082")
    # El API queda protegido y solo responde a través del Reverse Proxy.
    expose:
      - "8082"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mariadb://db:3306/${MYSQL_DATABASE}?createDatabaseIfNotExist=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - MAIL_HOST=${MAIL_HOST}
      - MAIL_PORT=${MAIL_PORT}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - CORS_ALLOWED_ORIGIN=${CORS_ALLOWED_ORIGIN} # Ej: https://autolink-tfg.duckdns.org
    depends_on:
      - db

  # SERVICIO FRONTEND (Angular SSR)
  frontend:
    image: speicon1911/autolink-tfg:frontend
    container_name: autolink-frontend
    restart: always
    # ELIMINADO EL PUERTO EXTERNO ("80:4000")
    expose:
      - "4000"
    environment:
      - PORT=4000
    depends_on:
      - backend

  # NUEVO SERVICIO: NGINX (PROXY INVERSO Y SEGURIDAD)
  nginx:
    image: nginx:alpine
    container_name: autolink-nginx
    restart: always
    # ÚNICOS PUERTOS EXPUESTOS AL EXTERIOR EN TODO EL VPS 🛡️
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Mapeamos nuestro archivo de configuración
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      # Mapeamos los certificados de Let's Encrypt generados en el VPS
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
      - phpmyadmin

volumes:
  mariadb_data:
```

---

## 3. Guía de Despliegue en el VPS en 4 Pasos

Si vas a vender tu software a un cliente, este es el protocolo oficial y profesional para instalarlo en su servidor (por ejemplo, Ubuntu Server 20.04/22.04 LTS):

### Paso 1: Instalar Docker, Docker Compose y Certbot
En la consola del VPS del cliente:
```bash
sudo apt update && sudo apt upgrade -y
# Instalar Docker
sudo apt install docker.io docker-compose -y
# Instalar Certbot (para generar los certificados SSL de forma gratuita)
sudo apt install certbot -y
```

### Paso 2: Apuntar el Dominio
El cliente debe configurar en su proveedor de dominios (GoDaddy, Namecheap, etc.) un registro de tipo **A** apuntando la IP pública del VPS (o mediante DuckDNS):
* `autolink-tfg.duckdns.org` -> `IP_DEL_VPS`

### Paso 3: Generar los Certificados SSL Gratuitos (Certbot)
Antes de levantar Nginx por primera vez, necesitamos crear los certificados. Ejecutamos Certbot en modo standalone (temporalmente levanta un puerto web para validar el dominio con Let's Encrypt):
```bash
sudo certbot certonly --standalone -d autolink-tfg.duckdns.org
```
*Esto generará automáticamente los archivos `.pem` en la ruta `/etc/letsencrypt/live/autolink-tfg.duckdns.org/` del VPS, la cual mapeamos directamente a nuestro contenedor de Nginx.*

> [!TIP]
> **Renovación automática**: Let's Encrypt dura 90 días. Certbot instala un servicio systemd que se ejecuta dos veces al día y renovará automáticamente cualquier certificado que esté a menos de 30 días de expirar. Solo tendrás que configurar una tarea programada (cron job) para recargar Nginx después de una renovación exitosa:
> ```bash
> 0 3 * * * docker exec autolink-nginx nginx -s reload
> ```

### Paso 4: Levantar la Aplicación
Copia los archivos de tu proyecto al VPS (incluyendo la carpeta `nginx` con tu `nginx.conf`, tu `.env` configurado con las credenciales de producción y el nuevo `docker-compose.prod.yml`).

Levanta la plataforma en segundo plano de manera robusta y aislada:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

¡Listo! Tu aplicación estará corriendo en **HTTPS** de forma segura, rápida y blindada ante ataques, lista para ser utilizada comercialmente de forma profesional.

---

## 4. ¿Cómo acceder de forma segura a la base de datos si los puertos están bloqueados?

Es completamente normal que durante el ciclo de vida del software en producción necesites consultar datos, realizar auditorías o hacer copias de seguridad de la base de datos MariaDB. Si bloqueamos el puerto `3306` al exterior, **¿cómo podemos conectarnos de forma segura?**

Tienes **tres métodos profesionales e industriales** para hacerlo. A continuación se detallan sus pros y contras para que puedas decidir cuál se adapta mejor al cliente y a ti:

### Método A: A través de phpMyAdmin bajo el proxy seguro (Recomendado para visualización rápida)
Como ya hemos configurado Nginx, puedes acceder a la base de datos de manera visual desde cualquier navegador web:
* **URL de acceso:** `https://autolink-tfg.duckdns.org/admin-pma/`
* **Cómo funciona:** Nginx recibe la petición en el puerto `443` cifrado, valida las cabeceras de seguridad y la redirige internamente al contenedor de phpMyAdmin en el puerto `80`. Desde ahí inicias sesión con tu usuario `root` y la contraseña del archivo `.env`.
* **Pros:** No requiere instalar programas adicionales, funciona desde cualquier ordenador con navegador, cifrado total por HTTPS.
* **Contras:** Si la base de datos es gigantesca (de gigabytes), las subidas/descargas de copias de seguridad por navegador pueden fallar por timeout de HTTP.

---

### Método B: Túnel SSH / Port Forwarding (El estándar de oro para desarrolladores)
Si prefieres usar gestores de bases de datos de escritorio potentes (como **DBeaver**, **HeidiSQL**, **TablePlus** o **DataGrip**), el estándar de oro en ciberseguridad es abrir un **Túnel SSH**. 

En lugar de abrir el puerto `3306` al internet público, abrimos un "túnel privado" seguro que viaja cifrado a través de tu conexión SSH hacia el VPS.

#### 1. Configuración de Docker Compose:
Para que esto funcione de forma robusta, podemos mapear el puerto de MariaDB **únicamente a la dirección de loopback (localhost) del VPS**, impidiendo que cualquier IP externa se conecte directamente, pero permitiendo conexiones locales y túneles SSH:

```yaml
  db:
    image: speicon1911/autolink-tfg:mariadb
    container_name: autolink-db
    restart: always
    ports:
      # Enlazamos el puerto 3306 ÚNICAMENTE a la IP 127.0.0.1 (Localhost) del propio VPS.
      # Sigue estando 100% blindado de cara a internet, pero el VPS lo ve de forma local.
      - "127.0.0.1:3306:3306" 
```

#### 2. Conectarse desde tu gestor de base de datos (ej. DBeaver o TablePlus):
Todos los clientes modernos de base de datos tienen una pestaña llamada **"SSH"** o **"SSH Tunnel"** en la configuración de la conexión:
1. **Configuración de SSH (Pestaña SSH):**
   * **Host/IP:** La IP pública de tu VPS.
   * **Puerto:** `22` (puerto SSH estándar).
   * **Usuario:** `root` (u otro usuario con permisos en el VPS).
   * **Método de autenticación:** Tu clave privada SSH (`.pem`/`.pub`) o contraseña de SSH.
2. **Configuración Principal de MariaDB (Pestaña General):**
   * **Server Host:** `127.0.0.1` (se refiere al localhost *dentro* del VPS).
   * **Puerto:** `3306`.
   * **Database:** `autolink` (o el nombre de tu BD).
   * **Username:** `root` (de la base de datos).
   * **Password:** La contraseña de MariaDB definida en tu archivo `.env`.

* **Pros:** La seguridad es insuperable. Puedes usar tus herramientas de análisis favoritas directamente desde tu máquina local con tráfico 100% cifrado.
* **Contras:** Requiere configurar la conexión SSH en tu cliente de base de datos.

---

### Método C: Acceso y Copias de Seguridad por Consola (CLI)
Si estás en la terminal del VPS y necesitas exportar la base de datos (backup) o interactuar con ella sin interfaz gráfica, puedes "entrar" directamente al contenedor Docker usando comandos nativos:

#### 1. Entrar a la consola de MariaDB dentro del contenedor:
```bash
docker exec -it autolink-db mysql -u root -p
```
*(Te pedirá la contraseña configurada en el `.env` y entrarás directamente a la consola interactiva de SQL).*

#### 2. Hacer una copia de seguridad (Exportar base de datos a `.sql`):
No necesitas abrir puertos ni usar herramientas externas para crear un backup. Ejecuta este comando en la terminal de tu VPS para volcar la base de datos a un archivo local:
```bash
docker exec autolink-db mysqldump -u root -p"tu_contraseña_db" autolink > backup_autolink.sql
```

#### 3. Restaurar una copia de seguridad (Importar base de datos desde `.sql`):
Si necesitas restaurar unos datos desde un archivo local del VPS hacia el contenedor:
```bash
docker exec -i autolink-db mysql -u root -p"tu_contraseña_db" autolink < backup_autolink.sql
```

* **Pros:** Ultra-rápido, excelente para automatizar copias de seguridad diarias en producción usando tareas programadas (Cron jobs).
* **Contras:** Es en modo texto por terminal de comandos.

---

## 5. Conclusión y Recomendación para tu TFG

> [!IMPORTANT]
> **Mi recomendación para tu despliegue:**
> 1. **Mantén phpMyAdmin tras Nginx (`/admin-pma`)** para que tengas un acceso rápido y cómodo desde cualquier lugar.
> 2. **Implementa el Túnel SSH (Método B)** enlazando a `127.0.0.1:3306:3306` en tu `docker-compose.prod.yml`. Te dará la flexibilidad de usar DBeaver/HeidiSQL de forma 100% segura sin arriesgar la seguridad de los datos de tus clientes.

---

## 6. Despliegue sin Dominio (Solo con la IP Pública del VPS)

Es muy común que para la defensa de tu TFG o durante la fase de pruebas con el cliente **no dispongas de un dominio registrado** (como `autolink.com`), sino únicamente de la **IP pública del VPS** (por ejemplo, `123.45.67.89`).

Si te encuentras en este caso, tienes **tres alternativas técnicas** para resolverlo:

---

### Alternativa A: Despliegue en HTTP (Sin SSL) - *La más rápida para pruebas*
Es la opción idónea si solo quieres validar que los contenedores docker se comunican correctamente y que Nginx enruta el tráfico sin preocuparte por certificados.

#### 1. Configuración de Nginx (`nginx/nginx.conf` sin HTTPS)
Debemos eliminar la redirección HTTPS y meter todas nuestras rutas (Angular, Spring Boot, WebSockets y phpMyAdmin) dentro del bloque de escucha del puerto `80`.

```nginx
# nginx/nginx.conf (HTTP - Solo IP)

# Definición de límites de peticiones (Rate Limiting)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    listen 80;
    listen [::]:80;
    server_name _; # Acepta cualquier petición dirigida a la IP del VPS

    # Cabeceras de seguridad adaptadas (sin Directiva HTTPS de HSTS para evitar problemas en navegadores sin SSL)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    client_max_body_size 10M;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # --- RUTA 1: FRONTEND (Angular) ---
    location / {
        proxy_pass http://frontend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # --- RUTA 2: BACKEND (Spring Boot API) ---
    location ~ ^/(auth|personas|vehiculos|ventas|marcas|mensajes|error|api/contacto) {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    # --- RUTA 3: WEBSOCKETS (/ws) ---
    location /ws {
        proxy_pass http://backend:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
    }

    # --- RUTA 4: phpMyAdmin Seguro (/admin-pma) ---
    location /admin-pma/ {
        proxy_pass http://phpmyadmin/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 2. Modificación de `docker-compose.prod.yml`
Dado que no usamos SSL, **no necesitamos generar certificados Let's Encrypt ni mapear volúmenes de `/etc/letsencrypt`**. Nginx solo necesita mapear el puerto `80` y su archivo de configuración:

```yaml
  # NUEVO SERVICIO: NGINX (PROXY INVERSO Y SEGURIDAD HTTP)
  nginx:
    image: nginx:alpine
    container_name: autolink-nginx
    restart: always
    ports:
      - "80:80" # Solo exponemos el puerto HTTP
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend
      - phpmyadmin
```

---

### Alternativa B: Certificado Auto-firmado (HTTPS sobre IP) - *Seguridad local*
Si el tribunal del TFG te exige HTTPS sí o sí pero no tienes dominio, puedes generar tu propio certificado SSL encriptado en el VPS usando **OpenSSL**.

> [!WARNING]
> Los navegadores web marcarán el sitio como **No seguro** y mostrarán una pantalla de advertencia ("La conexión no es privada"). El usuario tendrá que hacer clic en "Configuración Avanzada" y "Acceder a [IP] (no seguro)" para entrar. Aun así, el tráfico de red estará cifrado.

#### 1. Generar el certificado auto-firmado en la consola del VPS:
```bash
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private
# Generamos un certificado válido por 365 días para la IP del VPS
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt \
  -subj "/C=ES/ST=Autolink/L=Autolink/O=Autolink/OU=TFG/CN=TU_IP_PUBLICA_VPS"
```

#### 2. Configurar Nginx para usar el certificado auto-firmado (`nginx/nginx.conf`):
En el archivo de configuración, sustituimos las rutas de Let's Encrypt por las del certificado local generado:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;
    return 301 https://$host$request_uri; # Redirección HTTP a HTTPS
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name _;

    # Rutas al certificado auto-firmado
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # ... Resto de la configuración idéntica a la sección 2.2 (Cabeceras, locations, etc.) ...
}
```

#### 3. Mapear los certificados en tu `docker-compose.prod.yml`:
Debemos pasar los certificados locales desde el VPS hacia el contenedor de Nginx:

```yaml
  nginx:
    image: nginx:alpine
    container_name: autolink-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      # Mapeamos los certificados auto-firmados en lugar de Let's Encrypt
      - /etc/ssl/certs/nginx-selfsigned.crt:/etc/ssl/certs/nginx-selfsigned.crt:ro
      - /etc/ssl/private/nginx-selfsigned.key:/etc/ssl/private/nginx-selfsigned.key:ro
    depends_on:
      - frontend
      - backend
      - phpmyadmin
```

---

### Alternativa C: Subdominio Gratuito con DuckDNS - *La opción recomendada para tu TFG* 🌟
Si quieres que tu despliegue luzca **100% impecable**, con el candado verde de HTTPS oficial en el navegador sin ninguna advertencia, la mejor solución es utilizar un proveedor gratuito de DNS dinámico como **DuckDNS**.

#### ¿Cómo implementarlo paso a paso?
1. **Regístrate en [DuckDNS](https://www.duckdns.org/)** (puedes iniciar sesión de forma segura con tu cuenta de GitHub o Google).
2. **Crea un subdominio gratuito** (ejemplo: `autolink-tfg.duckdns.org`).
3. **Apunta el dominio a tu VPS:** Introduce la IP pública de tu VPS en la celda correspondiente del dominio dinámico en la web de DuckDNS y dale a "update IP".
4. **Genera tu certificado Let's Encrypt real y gratuito:**
   En la consola de tu VPS ejecuta:
   ```bash
   sudo certbot certonly --standalone -d autolink-tfg.duckdns.org
   ```
5. **Configura tu `nginx.conf` y `docker-compose.prod.yml` original:**
   Sustituye todas las apariciones de `tu-dominio.com` por `autolink-tfg.duckdns.org` en la configuración original de esta guía.
6. ¡Listo! Tu plataforma estará desplegada bajo un **dominio web real con HTTPS SSL oficial sin coste alguno**. Esta opción es la idónea porque ofrece una experiencia de usuario perfecta y demuestra que sabes gestionar nombres de dominio reales en el mundo profesional.

