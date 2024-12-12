# 🎵 SoundJam

---

## Índice

- [Descripcion](#descripcion)
- [Caracteristicas](#caracteristicas)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Instalacion y uso](#instalacion-y-uso)
- [Demo en produccion](#️demo-en-produccion)
- [Contribuciones](#contribuciones)


Modelos:
- [Artist](#modelo-artist)
- [Album](#modelo-album)
- [Song](#modelo-song)
- [User](#modelo-user)
- [Playlist](#modelo-playlist)

Endpoints:
- [Artist](#rutas-del-controlador-artist)
- [Album](#rutas-del-controlador-album)
- [Song](#rutas-del-controlador-song)
- [User](#rutas-del-controlador-user)
- [Playlist](#rutas-del-controlador-playlist])










---

## Descripcion
SoundJam es una aplicacion de musica que permite a usuarios registrados (o invitados) escuchar su musica y artistas favoritos, asi como tambien crear sus listas de reproduccion. Los usuarios admin, pueden cargar nuevos artistas, nuevos albums y nuevas canciones.

Este proyecto está compuesto por un **backend con Node.js y Express** y un **frontend con Vue.js**

---

## Caracteristicas

### Backend
- **Autenticacion JWT.**
- **Carga de archivos al servidor** para subir la musica que deseen(usuarios admin).
- **Creacion de listas de reproduccion** para los usuario.

### Frontend
- **Reproductor personalizado.**
- **Visualizacion de artistas, albums y musica previamente cargada** sobre el uso de los enlaces creados.
- **Responsive** para su uso en dispositivos móviles y escritorios.

---

## Tecnologias utilizadas
### Backend
- **Node.js**
- **Express.js**
- **MongoDB** para almacenamiento de datos.

### Frontend
- **Vue.js**
- **Tailwind CSS** para el diseño responsivo.

---

## Instalacion y uso

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


# Documentación del modelo y rutas: Playlist

## Modelo: Playlist
El modelo **Playlist** representa una lista de reproducción musical creada por los usuarios en la aplicación. Está definido en MongoDB utilizando Mongoose.

### Esquema del modelo
```javascript
const PlaylistSchema = Schema({
    name: {
        type: String,
        required: true // El nombre de la playlist es obligatorio
    },
    description: {
        type: String // Descripción opcional de la playlist
    },
    songs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Song" // Referencia a las canciones incluidas en la playlist
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Usuario que creó la playlist
        required: true
    }
});
```

### Propiedades del modelo
| Propiedad     | Tipo              | Requerido | Descripción                                |
|---------------|-------------------|-----------|--------------------------------------------|
| `name`        | String            | Sí        | Nombre de la playlist.                    |
| `description` | String            | No        | Descripción opcional de la playlist.       |
| `songs`       | Array de ObjectId | No        | Lista de canciones incluidas.             |
| `user`        | ObjectId          | Sí        | Referencia al usuario que creó la playlist.|

---

## Rutas del controlador: Playlist
### Prefijo de las rutas: `/api/playlist`


### 1. **Crear una playlist**
**Descripción:** Crear una nueva playlist.
- **Método:** `POST`
- **URL:** `/api/playlist/save`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "name": "<Nombre de la playlist>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlist": {
        "_id": "<ID de la playlist>",
        "name": "<Nombre>",
        "songs": ["<ID de la canción>"],
        "user": "<ID del usuario>"
    }
}
```

---

### 2. **Agregar una canción a la playlist**
**Descripción:** Agregar una canción existente a una playlist específica.
- **Método:** `POST`
- **URL:** `/api/playlist/addSong`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "song": "<ID de la canción>",
        "playlistId": "<ID de la playlist>"   
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlist": {
        "_id": "<ID de la playlist>",
        "name": "<Nombre>",
        "description": "<Descripción>",
        "songs": ["<ID de la canción>"],
        "user": "<ID del usuario>"
    }
}
```

---

### 3. **Obtener una playlist por ID**
**Descripción:** Obtener información de una playlist por su ID.
- **Método:** `GET`
- **URL:** `/api/playlist/songlist/:playlistId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlist": {
        "songs": ["<ID de la canción>"],
    }
}
```

---

### 4. **Listar todas las playlists del usuario**
**Descripción:** Obtener una lista de todas las playlists creadas por el usuario.
- **Método:** `GET`
- **URL:** `/api/playlist/list/userId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlists": [
        {
            "_id": "<ID de la playlist>",
            "name": "<Nombre>",
            "description": "<Descripción>",
            "songs": ["<ID de la canción>"],
            "user": "<ID del usuario>"
        }
    ]
}
```

---

### 5. **Listar todas las playlists**
**Descripcion:** Listar todas las playlists creadas
- **Método:** `GET`
- **URL:** `/api/playlist/list`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlists": []
}
```

---

### 6. **Eliminar una playlist**
**Descripción:** Eliminar una cancion por su ID.
- **Método:** `DELETE`
- **URL:** `/api/playlist/removeSong/:songId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "playlist":[],
    "message": "Se ha eliminado la cancion de la playlist."
}
```

---

### 7. **Eliminar una playlist**
**Descripción:** Eliminar una playlist por su ID.
- **Método:** `DELETE`
- **URL:** `/api/playlist/remove/:playlistId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "Playlist eliminada correctamente."
}
```

# Documentación del modelo y rutas: Song

## Modelo: Song
El modelo **Song** representa una canción dentro de la aplicación de música. Está definido en MongoDB utilizando Mongoose.

### Esquema del modelo
```javascript
const SongSchema = Schema({
    album: {
        type: Schema.ObjectId,
        ref: "Album"
    },
    track: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: 'default.mp3'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
```

### Propiedades del modelo
| Propiedad     | Tipo       | Requerido | Descripción                                |
|---------------|------------|-----------|--------------------------------------------|
| `album`       | ObjectId   | No        | Referencia al álbum al que pertenece la canción. |
| `track`       | Number     | Sí        | Número de pista en el álbum.               |
| `name`        | String     | Sí        | Nombre de la canción.                      |
| `duration`    | String     | Sí        | Duración de la canción.                    |
| `file`        | String     | No        | Nombre del archivo de la canción. Por defecto: `default.mp3`. |
| `created_at`  | Date       | No        | Fecha de creación de la canción. Por defecto: fecha actual. |

---

## Rutas del controlador: Song
### Prefijo de las rutas: `/api/song`

### 1. **Prueba**
**Descripción:** Ruta de prueba para verificar que el controlador funciona correctamente.
- **Método:** `GET`
- **URL:** `/api/song/prueba`
- **Autenticación:** No

**Respuesta de ejemplo:**
```json
{
    "message": "Prueba de controlador Song."
}
```

---

### 2. **Crear una canción**
**Descripción:** Crear una nueva canción. el archivo se carga mediante otro endpoint
- **Método:** `POST`
- **URL:** `/api/song/save`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "album": "<ID del álbum>",
        "track": 1,
        "name": "<Nombre de la canción>",
        "duration": "3:45"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "savedSong": {
        "_id": "<ID de la canción>",
        "album": "<ID del álbum>",
        "track": 1,
        "name": "<Nombre de la canción>",
        "duration": "3:45",
        "file": "default.mp3",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 3. **Obtener una canción por ID**
**Descripción:** Obtener información de una canción por su ID.
- **Método:** `GET`
- **URL:** `/api/song/one/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "song": {
        "_id": "<ID de la canción>",
        "album": "<ID del álbum>",
        "track": 1,
        "name": "<Nombre de la canción>",
        "duration": "3:45",
        "file": "<Nombre del archivo>",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 4. **Listar canciones por álbum**
**Descripción:** Obtener una lista de todas las canciones de un álbum.
- **Método:** `GET`
- **URL:** `/api/song/listByAlbum/:albumId`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "songs": [
        {
            "_id": "<ID de la canción>",
            "track": 1,
            "name": "<Nombre de la canción>",
            "duration": "3:45",
            "file": "<Nombre del archivo>",
            "created_at": "<Fecha de creación>"
        }
    ]
}
```

---

### 5. **Actualizar una canción**
**Descripción:** Actualizar los datos de una canción por su ID.
- **Método:** `PUT`
- **URL:** `/api/song/update/:id`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "track": 2,
        "name": "<Nuevo nombre de la canción>",
        "duration": "4:00",
        "file": "<Nuevo nombre del archivo>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "updatedSong": {
        "_id": "<ID de la canción>",
        "album": "<ID del álbum>",
        "track": 2,
        "name": "<Nuevo nombre de la canción>",
        "duration": "4:00",
        "file": "<Nuevo nombre del archivo>",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 6. **Eliminar una canción**
**Descripción:** Eliminar una canción por su ID.
- **Método:** `DELETE`
- **URL:** `/api/song/remove/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "removedSong": {
      "_id": "<ID de la canción>",
        "album": "<ID del álbum>",
        "track": 2,
        "name": "<nombre de la canción>",
        "duration": "4:00",
        "file": "<nombre del archivo>",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 7. **Subir un archivo de canción**
**Descripción:** Subir un archivo para una canción existente.
- **Método:** `PUT`
- **URL:** `/api/song/upload/:id`
- **Autenticación:** Sí
- **Archivo:** Enviar un archivo en el campo `file0`.

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "songUpdated": {
        "_id": "<ID de la canción>",
        "album": "<ID del álbum>",
        "track": 2,
        "name": "<nombre de la canción>",
        "duration": "4:00",
        "file": "<Nuevo nombre del archivo>",
        "created_at": "<Fecha de creación>"
    },
    "file": "nombre del archivo de audio"

}
```

---

### 8. **Descargar un archivo de canción**
**Descripción:** Descargar el archivo de audio de una canción.
- **Método:** `GET`
- **URL:** `/api/song/file/:file`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
El archivo de audio se devuelve como contenido binario.

---

### 9. **Buscar canciones por término**
**Descripción:** Buscar canciones por un término en su nombre.
- **Método:** `GET`
- **URL:** `/api/song/search/:term`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "songs": [
        {
            "_id": "<ID de la canción>",
            "name": "<Nombre de la canción>",
            "duration": "3:45",
            "file": "<Nombre del archivo>"
        }
    ]
}
```

# Documentación del modelo y rutas: User

## Modelo: User
El modelo **User** representa un usuario dentro de la aplicación. Está definido en MongoDB utilizando Mongoose.

### Esquema del modelo
```javascript
const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: 'role_user',
        select: false
    },
    image: {
        type: String,
        default: 'default.png'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
```

### Propiedades del modelo
| Propiedad     | Tipo     | Requerido | Descripción                                |
|---------------|----------|-----------|--------------------------------------------|
| `name`        | String   | Sí        | Nombre del usuario.                        |
| `surname`     | String   | Sí        | Apellido del usuario.                      |
| `nick`        | String   | Sí        | Apodo o nombre de usuario.                 |
| `email`       | String   | Sí        | Dirección de correo electrónico.           |
| `password`    | String   | Sí        | Contraseña cifrada del usuario.            |
| `role`        | String   | No        | Rol del usuario (por defecto: `role_user`). |
| `image`       | String   | No        | Imagen de perfil del usuario.              |
| `created_at`  | Date     | No        | Fecha de creación del usuario.             |

---

## Rutas del controlador: User
### Prefijo de las rutas: `/api/user`

### 1. **Prueba**
**Descripción:** Ruta de prueba para verificar que el controlador funciona correctamente.
- **Método:** `GET`
- **URL:** `/api/user/prueba`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "message": "Prueba de controlador User."
}
```

---

### 2. **Registro de usuario**
**Descripción:** Registrar un nuevo usuario.
- **Método:** `POST`
- **URL:** `/api/user/register`
- **Autenticación:** No
- **Cuerpo (JSON):**
    ```json
    {
        "name": "<Nombre>",
        "surname": "<Apellido>",
        "nick": "<Apodo>",
        "email": "<Correo electrónico>",
        "password": "<Contraseña>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "User <nick> has been registered successfully.",
    "user": {
        "_id": "<ID del usuario>",
        "name": "<Nombre>",
        "surname": "<Apellido>",
        "nick": "<Apodo>",
        "email": "<Correo electrónico>"
    }
}
```

---

### 3. **Inicio de sesión**
**Descripción:** Iniciar sesión con un usuario registrado.
- **Método:** `POST`
- **URL:** `/api/user/login`
- **Autenticación:** No
- **Cuerpo (JSON):**
    ```json
    {
        "email": "<Correo electrónico>",
        "password": "<Contraseña>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "User logged successfully, Welcome <Nombre>!",
    "user": {
        "_id": "<ID del usuario>",
        "name": "<Nombre>",
        "surname": "<Apellido>",
        "nick": "<Apodo>",
        "email": "<Correo electrónico>"
    },
    "token": "<Token JWT>"
}
```

---

### 4. **Obtener perfil de usuario**
**Descripción:** Obtener los datos de un usuario por su ID.
- **Método:** `GET`
- **URL:** `/api/user/profile/:id`
- **Autenticación:** Sí

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "user": {
        "_id": "<ID del usuario>",
        "name": "<Nombre>",
        "surname": "<Apellido>",
        "nick": "<Apodo>",
        "email": "<Correo electrónico>",
        "image": "default.png",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 5. **Actualizar datos del usuario**
**Descripción:** Actualizar los datos de un usuario autenticado.
- **Método:** `PUT`
- **URL:** `/api/user/update`
- **Autenticación:** Sí
- **Cuerpo (JSON):**
    ```json
    {
        "name": "<Nuevo nombre>",
        "surname": "<Nuevo apellido>",
        "nick": "<Nuevo apodo>",
        "email": "<Nuevo correo electrónico>",
        "password": "<Nueva contraseña>"
    }
    ```

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "message": "User updated",
    "user": {
        "_id": "<ID del usuario>",
        "name": "<Nuevo nombre>",
        "surname": "<Nuevo apellido>",
        "nick": "<Nuevo apodo>",
        "email": "<Nuevo correo electrónico>",
        "image": "default.png",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 6. **Subir avatar**
**Descripción:** Subir un archivo de avatar para el usuario autenticado.
- **Método:** `PUT`
- **URL:** `/api/user/upload`
- **Autenticación:** Sí
- **Archivo:** Enviar un archivo en el campo `file0`.

**Respuesta de ejemplo:**
```json
{
    "status": "success",
    "user": {
        "_id": "<ID del usuario>",
        "name": "<Nuevo nombre>",
        "surname": "<Nuevo apellido>",
        "nick": "<Nuevo apodo>",
        "email": "<Nuevo correo electrónico>",
        "image": "<nombre de archivo Avatar>",
        "created_at": "<Fecha de creación>"
    }
}
```

---

### 7. **Obtener avatar**
**Descripción:** Obtener el archivo de avatar de un usuario.
- **Método:** `GET`
- **URL:** `/api/user/avatar/:file`
- **Autenticación:** No

**Respuesta de ejemplo:**
El archivo de avatar se devuelve como contenido binario.



## Demo en produccion 
Puedes probar la aplicación aquí: [Demo](https://soundjam.juliangarciasuarez.tech)


## Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras un error, deseas agregar una funcionalidad o mejorar la documentación, abre un Issue o un Pull Request en el repositorio.




