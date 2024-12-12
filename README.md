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

# Documentación del modelo y rutas: Album

## Modelo: Album
El modelo **Album** representa los álbumes musicales que forman parte de la aplicación. Está definido en MongoDB utilizando Mongoose.

### Esquema del modelo
```javascript
const AlbumSchema = Schema({
    artist: {
        type: Schema.ObjectId, // Relación con el modelo Artist
        ref: "Artist"
    },
    title: {
        type: String,
        required: true // El título del álbum es obligatorio
    },
    description: {
        type: String, // Descripción opcional del álbum
    },
    year: {
        type: Number,
        required: true // Año de lanzamiento del álbum
    },
    image: {
        type: String,
        default: "default.png" // Imagen predeterminada si no se sube ninguna
    },
    created_at: {
        type: Date,
        default: Date.now // Fecha de creación del álbum
    }
});
```

### Propiedades del modelo
| Propiedad     | Tipo             | Requerido | Descripción                                |
|---------------|------------------|-----------|--------------------------------------------|
| `artist`      | ObjectId         | Sí        | Referencia al modelo **Artist**.          |
| `title`       | String           | Sí        | Título del álbum.                         |
| `description` | String           | No        | Descripción opcional del álbum.           |
| `year`        | Number           | Sí        | Año de lanzamiento del álbum.             |
| `image`       | String           | No        | Ruta de la imagen del álbum.              |
| `created_at`  | Date             | No        | Fecha de creación. Valor por defecto: `Date.now`. |

---

## Rutas del controlador: Album
### Prefijo de las rutas: `/api/album`

### 1. **Prueba**
**Descripción:** Ruta de prueba para verificar que el controlador funciona correctamente.
- **Método:** `GET`
- **URL:** `/api/album/prueba`
- **Autenticación:** No

**Respuesta de ejemplo:**
```json
{
    "message": "Prueba de controlador Album."
}
```

---

### 2. **Guardar un álbum**
**Descripción:** Crear un nuevo álbum.
- **Método:** `POST`
- **URL:** `/api/album/save`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "artist": "<ID del artista>",
        "title": "<Título del álbum>",
        "description": "<Descripción opcional>",
        "year": <Año de lanzamiento>
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "album": {
        "_id": "<ID del álbum>",
        "artist": "<ID del artista>",
        "title": "<Título>",
        "description": "<Descripción>",
        "year": 2024,
        "image": "default.png",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 3. **Obtener un álbum por ID**
**Descripción:** Obtener información de un álbum por su ID.
- **Método:** `GET`
- **URL:** `/api/album/one/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "album": {
        "_id": "<ID del álbum>",
        "artist": {
            "_id": "<ID del artista>",
            "name": "<Nombre del artista>"
        },
        "title": "<Título>",
        "description": "<Descripción>",
        "year": 2024,
        "image": "default.png",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 4. **Buscar álbumes**
**Descripción:** Buscar álbumes por un término.
- **Método:** `GET`
- **URL:** `/api/album/search/:term`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "albums": [
        {
            "_id": "<ID del álbum>",
            "title": "<Título>",
            "description": "<Descripción>",
            "year": 2024,
            "image": "default.png"
        }
    ]
}
```

---

### 5. **Listar álbumes de un artista**
**Descripción:** Obtener una lista de álbumes asociados a un artista.
- **Método:** `GET`
- **URL:** `/api/album/list/:artistId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "albums": [
        {
            "_id": "<ID del álbum>",
            "title": "<Título>",
            "year": 2024
        }
    ]
}
```

---

### 6. **Actualizar un álbum**
**Descripción:** Actualizar los datos de un álbum por su ID.
- **Método:** `PUT`
- **URL:** `/api/album/update/:id`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "title": "<Nuevo título>",
        "description": "<Nueva descripción>",
        "year": <Nuevo año>
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "album": {
        "_id": "<ID del álbum>",
        "title": "<Nuevo título>",
        "description": "<Nueva descripción>",
        "year": 2025
    }
}
```

---

### 7. **Subir una imagen para un álbum**
**Descripción:** Subir una imagen asociada a un álbum.
- **Método:** `PUT`
- **URL:** `/api/album/upload/:id`
- **Autenticación:** Sí
- **Archivo:** Enviar un archivo en el campo `file0`.

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "image": "album-1234567890.png"
}
```

---

### 8. **Eliminar un álbum**
**Descripción:** Eliminar un álbum por su ID.
- **Método:** `DELETE`
- **URL:** `/api/album/remove/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "Álbum eliminado correctamente."
}
```
# Documentación del modelo y rutas: Artist

## Modelo: Artist
El modelo **Artist** representa a los artistas musicales dentro de la aplicación. Está definido en MongoDB utilizando Mongoose.

### Esquema del modelo
```javascript
const ArtistSchema = Schema({
    name: {
        type: String,
        required: true // El nombre del artista es obligatorio
    },
    description: {
        type: String, // Descripción opcional del artista
    },
    image: {
        type: String,
        default: "default.png" // Imagen predeterminada si no se sube ninguna
    }
});
```

### Propiedades del modelo
| Propiedad     | Tipo   | Requerido | Descripción                                |
|---------------|--------|-----------|--------------------------------------------|
| `name`        | String | Sí        | Nombre del artista.                        |
| `description` | String | No        | Descripción opcional del artista.           |
| `image`       | String | No        | Ruta de la imagen del artista.             |

---

## Rutas del controlador: Artist
### Prefijo de las rutas: `/api/artist`

### 1. **Prueba**
**Descripción:** Ruta de prueba para verificar que el controlador funciona correctamente.
- **Método:** `GET`
- **URL:** `/api/artist/prueba`
- **Autenticación:** No

**Respuesta de ejemplo:**
```json
{
    "message": "Prueba de controlador Artist."
}
```

---

### 2. **Guardar un artista**
**Descripción:** Crear un nuevo artista.
- **Método:** `POST`
- **URL:** `/api/artist/save`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "name": "<Nombre del artista>",
        "description": "<Descripción opcional>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "Se ha guardado el artista",
    "artist": {
        "_id": "<ID del artista>",
        "name": "<Nombre>",
        "description": "<Descripción>",
        "image": "default.png"
    }
}
```

---

### 3. **Obtener un artista por ID**
**Descripción:** Obtener información de un artista por su ID.
- **Método:** `GET`
- **URL:** `/api/artist/one/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message":"Accion de sacar un artista",
    "artist": {
        "_id": "<ID del artista>",
        "name": "<Nombre>",
        "description": "<Descripción>",
        "image": "default.png"
    }
}
```

---

### 4. **Listar todos los artistas**
**Descripción:** Obtener una lista de todos los artistas, paginados.
- **Método:** `GET`
- **URL:** `/api/artist/list/:page?`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "artists": [
        {
            "_id": "<ID del artista>",
            "name": "<Nombre>",
            "description": "<Descripción>",
            "image": "default.png"
        }
    ],
    "page": 1,
    "total": 10
}
```

---

### 5. **Actualizar un artista**
**Descripción:** Actualizar los datos de un artista por su ID.
- **Método:** `PUT`
- **URL:** `/api/artist/update/:id`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "name": "<Nuevo nombre>",
        "description": "<Nueva descripción>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "artist": {
        "_id": "<ID del artista>",
        "name": "<Nuevo nombre>",
        "description": "<Nueva descripción>",
        "image": "default.png"
    }
}
```

---

### 6. **Subir una imagen para un artista**
**Descripción:** Subir una imagen asociada a un artista.
- **Método:** `PUT`
- **URL:** `/api/artist/upload/:id`
- **Autenticación:** Sí
- **Archivo:** Enviar un archivo en el campo `file0`.

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "artist": {
        "_id": "<ID del artista>",
        "name": "<nombre del artista>",
        "description": "<descripcion del artista>",
        "image": "artist-1234567890.png" //nueva imagen
    }
    "image": "artist-1234567890.png"
}
```

---

### 7. **Eliminar un artista**
**Descripción:** Eliminar un artista por su ID.
- **Método:** `DELETE`
- **URL:** `/api/artist/remove/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "Artista eliminado correctamente.",
    "artistDeleted": {
        "_id": "<ID del artista>",
        "name": "<nombre del artista>",
        "description": "<descripcion del artista>",
        "image": "artist-1234567890.png" 
    },
    "albumDeleted": [],
    "songDeleted": []
}
```

---

### 8. **Mostrar imagen de un artista**
**Descripción:** Obtener una imagen asociada a un artista por su nombre de archivo.
- **Método:** `GET`
- **URL:** `/api/artist/image/:file`
- **Autenticación:** No

**Respuesta de ejemplo:**
La imagen se devuelve como contenido binario o un error si no existe.




## 📽️ Demo en produccion 
Puedes probar la aplicación aquí: [URL Demo](https://soundjam.juliangarciasuarez.tech)


## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras un error, deseas agregar una funcionalidad o mejorar la documentación, abre un Issue o un Pull Request en el repositorio.




