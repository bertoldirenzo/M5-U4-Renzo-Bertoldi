var express = require('express');
var router = express.Router();
var trabajosModel = require('./../models/trabajosModels');
var cloudinary = require('cloudinary').v2;

router.get('/trabajos', async function (req, res, next){
    let trabajos = await trabajosModel.getTrabajos();

    trabajos = trabajos.map(trabajos => {
        if (trabajos.img_id) {
            const imagen = cloudinary.url(trabajos.img_id, {
                width: 400,
                height: 500,
                crop: 'pad'
            });
            return{
                ...trabajos,
                imagen
            }
        } else {
            return {
                ...trabajos,
                imagen: ''
            }
        }
    });

    res.json(trabajos);
});

module.exports = router;