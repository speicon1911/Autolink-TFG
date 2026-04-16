# Manual de Uso de Docker para Autolink

Este proyecto cuenta con dos configuraciones de Docker Compose diseñadas para diferentes momentos del ciclo de vida del desarrollo.

---

## 🛠️ OPCIÓN 1: Modo Desarrollo (Programación Local)
**Archivo utilizado:** `docker-compose.yml`

Este modo es el que debes usar **mientras estás escribiendo código**. Docker lee tus carpetas locales (`autolink-backend` y `autolink-frontend`), las compila y levanta la aplicación.

### ¿Cuándo usarlo?
* En tu ordenador personal de trabajo.
* Cuando has modificado código en Java o Angular y quieres probarlo.
* Después de hacer un `git pull` para bajarte los cambios de un compañero o de otro de tus ordenadores.

### Comandos de uso:
1. **Arrancar y compilar (Viendo los logs de errores):**
   ```bash
   docker-compose up --build
   ```
   *(Nota: `--build` fuerza a Docker a leer tu código nuevo y recompilarlo. Si no lo pones, usará la versión compilada de la última vez).*

2. **Arrancar en segundo plano (Para que la terminal quede libre):**
   ```bash
   docker-compose up --build -d
   ```

3. **Apagar los contenedores:**
   ```bash
   docker-compose down
   ```

---

## 🚀 OPCIÓN 2: Modo Producción (Despliegue Rápido)
**Archivo utilizado:** `docker-compose.prod.yml`

Este modo **ignora por completo tu código fuente**. Simplemente descarga las imágenes (versiones cerradas de tu programa) directamente desde tu repositorio en Docker Hub.

### ¿Cuándo usarlo?
* Cuando vas a enseñar el proyecto en otro ordenador (por ejemplo, el de la universidad).
* Si quieres levantar la aplicación en 5 segundos sin esperar a que Maven y Angular compilen.
* En un servidor final de despliegue.

### 🔄 CÓMO ACTUALIZAR TUS IMÁGENES EN DOCKER HUB

Antes de que te vayas a otro ordenador a enseñar la web, **tienes que subir tus últimos cambios a la nube**. Puedes actualizar solo el backend, solo el frontend, o ambos. 

Hazlo desde la terminal, en la raíz de tu proyecto:

> [!NOTE]
> **Para actualizar el Backend (Java):**
> Copia y pega este bloque en tu terminal:
> ```bash
> cd autolink-backend
> docker build -t speicon1911/autolink-tfg:backend .
> docker push speicon1911/autolink-tfg:backend
> cd ..
> ```

> [!NOTE]
> **Para actualizar el Frontend (Angular):**
> Copia y pega este bloque en tu terminal:
> ```bash
> cd autolink-frontend
> docker build -t speicon1911/autolink-tfg:frontend .
> docker push speicon1911/autolink-tfg:frontend
> cd ..
> ```


### Comandos de uso (En la máquina destino donde vas a ejecutarlo):
1. **Descargar y arrancar (En segundo plano):**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Actualizar a la última versión (Si has subido cambios a Docker Hub):**
   ```bash
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Apagar los contenedores:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

---

## ⚠️ NOTAS IMPORTANTES PARA AMBOS MODOS

### Los Datos de la Base de Datos
Independientemente del modo que uses, los datos insertados en MariaDB (usuarios, coches, etc.) **se guardan en tu disco duro local** (en un volumen administrado por Docker). 
* Si cambias de ordenador físico, la base de datos estará vacía. 
* Si necesitas mover datos entre ordenadores, debes hacer una exportación de la base de datos desde phpMyAdmin y luego importarla en el nuevo ordenador.

### El Archivo `.env`
Ambos modos necesitan que exista el archivo `.env` en la raíz del proyecto para leer las contraseñas y configuraciones sensibles. NUNCA subas este archivo a GitHub de forma pública.

### Accesos:
* **Frontend:** http://localhost:4200
* **Backend:** http://localhost:8082
* **phpMyAdmin:** http://localhost:8080 (Usuario: `root`, Contraseña: la que pusieras en el `.env`)
