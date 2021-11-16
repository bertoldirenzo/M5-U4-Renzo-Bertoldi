var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');
var trabajosModel = require('../../models/trabajosModels');

/* GET home page. */
router.get('/', async function (req, res, next) {

  var trabajos = await trabajosModel.getTrabajos();

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
    if (req.body.titulo !="" && req.body.subtitulo !="" && req.body.cuerpo !=""){ 
  await trabajosModel.insertTrabajos(req.body);
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

router.get ('/eliminar/:id', async (req, res, next) =>{
  var id = req.params.id;
  await trabajosModel.deleteTrabajosById(id);
  res.redirect('/admin/trabajos')
})

router.get ('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  console.log(req.params.id);
  var trabajos = await trabajosModel.getTrabajosById(id);

  res.render('admin/modificar',{
    layout: 'admin/layout',
    trabajos
  })
  
});

router.post('/modificar', async (req,res, next) => {
  try {
    var obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo
    }
    console.log(obj)

    await trabajosModel.modificarTrabajosById(obj, req.body.id);
    res.redirect('/admin/trabajos');

  } catch (error) {
    console.log(error)
    res.render('admin/modificar',{
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico el trabajo'
    })
  }
})

module.exports = router;
