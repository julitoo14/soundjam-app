//importar dependencias
const express = require('express');
const check = require('../middlewares/auth');

//cargar router
const router = express.Router();
// importar controlador
const artistController = require('../controllers/artist');
//configuracion de subida de archivos
const multer= require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/artists/")
    },
    filename: (req, file, cb) =>{
        cb(null, "artist-"+Date.now()+"-"+file.originalname);
    }
});
const uploads = multer({storage});
//definir ruta
router.get('/prueba', artistController.prueba);
router.post('/save', check.auth, artistController.save);
router.get('/one/:id', check.auth, artistController.one);
router.get('/list/:page?', check.auth, artistController.list);
router.get('/search/:term', check.auth, artistController.search)
router.put('/update/:id', check.auth, artistController.update);
router.delete('/remove/:id', check.auth, artistController.remove);
router.put('/upload/:id', [check.auth, uploads.single('file0')], artistController.upload)
router.get('/image/:file' , artistController.image);

//exportar ruta
module.exports = router;