# 🎵 SoundJam

---

## ✨ Descripción
SoundJam es una aplicacion de musica que permite a usuarios registrados (o invitados) escuchar su musica y artistas favoritos, asi como tambien crear sus listas de reproduccion. Los usuarios admin, pueden cargar nuevos artistas, nuevos albums y nuevas canciones.

Este proyecto está compuesto por un **backend con Node.js y Express** y un **frontend con Vue.js**

---

## 📦 Características

### Backend
- **Autenticacion JWT.**
- **Carga de archivos al servidor** para subir la musica que deseen(usuarios admin).
- **Creacion de listas de reproduccion** para los usuario.

### Frontend
- **Reproductor personalizado.**
- **Visualizacion de artistas, albums y musica previamente cargada** sobre el uso de los enlaces creados.
- **Responsive** para su uso en dispositivos móviles y escritorios.

---

## 🛠️ Tecnologías utilizadas
### Backend
- **Node.js**
- **Express.js**
- **MongoDB** para almacenamiento de datos.

### Frontend
- **Vue.js**
- **Tailwind CSS** para el diseño responsivo.

---

## 🖥️ Instalación y uso

### 1. Clona el repositorio
```bash
git clone https://github.com/julitoo14/soundjam-app.git
cd soundjam-app
```

### 2. Configura el backend
En la carpeta backend instala las dependencias:
```bash
cd backend
npm install
```
Crea tu archivo .env con las configuraciones necesarias:
```bash
# Variables de entorno para el servidor
# Puerto del servidor
PORT=3910

# JWT SECRET
SECRET=tuLlaveSecretaJWT

# URL Base del servidor
BASE_URL=http://localhost:3000

# Nombre de la base de datos por defecto
DATABASE_NAME=Soundjam

# Base de datos para pruebas
TEST_DATABASE_NAME=testdb

# URI de la base de datos
DB_URI_BASE=<tu_conexion_a_mongo>

```

Inicia el servidor
```bash
npm start
```

### 3. Configura el frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Ejecuta la aplicación
Con el servidor backend ejecutándose y el frontend en modo desarrollo, abre tu navegador en:

`http://localhost:3910`

¡Listo! Ahora puedes empezar a usar SoundJam.

# 🧰 Endpoints disponibles

## Albums

`POST /api/album/save`

Guarda un nuevo album en la base de datos

| Parámetro     | Tipo        | Obligatorio | Descripción                                       |
|---------------|-------------|-------------|---------------------------------------------------|
| `artist`      | `ObjectId`  | Sí          | ID del artista al que pertenece el álbum.         |
| `title`       | `String`    | Sí          | Título del álbum.                                 |
| `description` | `String`    | No          | Breve descripción del álbum.                     |
| `year`        | `Number`    | Sí          | Año de lanzamiento del álbum.                    |
| `image`       | `String`    | No          | Nombre de la imagen asociada al álbum (por defecto: `default.png`). |
| `created_at`  | `Date`      | No          | Fecha de creación del álbum (por defecto: fecha actual). |



### 📥 Crear enlace corto
`POST /api/shorten`

Datos requeridos:
```json
{
  "longUrl": "https://ejemplo.com",
  "customAlias": "prueba"
}
```
🚩 el url es obligatorio, sin embargo el alias es opcional

Datos esperados:
```json
{
  "message": "URL successfully shortened",
  "shortUrl": "https://localhost:3000/prueba",
}
```

### 🔗 Redirección de enlace corto

`GET /:id`

Al acceder a ese endpoint, el sistema redirigirá automáticamente al enlace correspondiente.

### 📑 Consulta estadisticas de enlace corto

`GET /api/metrics/:id` debe buscarse por el alias personalizado o el id asignado automaticamente

Datos esperados:
```json
{
  "_id": "B1vRcpBEJl",
  "longUrl": "https://prueba.com",
  "shortUrl": "https://localhost:3000/prueba",
  "customAlias": "prueba",
  "clicks": "10",
  "created_at": "date",
  "dailyClicks": [],
  "clicksByCountry": [],
  "clicksByCity": [],
}
```

## 📽️ Demo en produccion 
Puedes probar la aplicación aquí: [URL Demo](https://short.juliangarciasuarez.tech)


## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras un error, deseas agregar una funcionalidad o mejorar la documentación, abre un Issue o un Pull Request en el repositorio.




