var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');
var trabajosModel = require('../../models/trabajosModels');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


/* GET home page. */
router.get('/', async function (req, res, next) {

  var trabajos = await trabajosModel.getTrabajos();

  trabajos = trabajos.map(trabajos => {
    if (trabajos.img_id){
      const imagen = cloudinary.image(trabajos.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
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

  res.render('admin/trabajos', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    trabajos
  });
});

router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  })
});

router.post('/agregar', async (req, res, next) => {
  try {

    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
      await trabajosModel.insertTrabajos({
        ...req.body, //titu,sub,cuerpo
        img_id
      });


      res.redirect('/admin/trabajos')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la novedad'
    })
  }
})

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let trabajos = await trabajosModel.getTrabajosById(id);
  if (trabajos.img_id) {
    await (destroy(trabajos.img_id));
  }

  await trabajosModel.deleteTrabajosById(id);
  res.redirect('/admin/trabajos')
})

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  console.log(req.params.id);
  var trabajos = await trabajosModel.getTrabajosById(id);

  res.render('admin/modificar', {
    layout: 'admin/layout',
    trabajos
  })

});

router.post('/modificar', async (req, res, next) => {
  try {

    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }

    var obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo,
      img_id
    }
    console.log(obj)

    await trabajosModel.modificarTrabajosById(obj, req.body.id);
    res.redirect('/admin/trabajos');

  } catch (error) {
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico el trabajo'
    })
  }
})

module.exports = router;
