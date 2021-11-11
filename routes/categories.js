/*almacenar la rutas*/
const {Category} = require('../modules/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
/*metodo de lectura*/
router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: true, message:'datos mal ingresados'})
    } 
    res.status(200).send(categoryList).json({success:true, message:'datos correctos'})
})
/*leer la categoria por id*/
router.get('/:id', async(req,res) =>{

    const category= await Category.findById(req.params.id);
if(!category){
    res.status(500).json({message:'no se pudo visualizar la cateogria por id'})
}
res.status(200).send(category);
})

/*metodo de almacenar*/
router.post('/', async (req, res)  => {


    if(!req.body.name || !req.body.color) {
        category = {
         error: true,
         codigo: 502,
         mensaje: 'Estos campos son requeridos'
         
        };
        res.send(category);
       }

    console.log("POST");
    console.log(req.body);
  
    var category = new Category({
     
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
  
    category.save(function (err, category) {
      if (err) return res.status(404).send({success:false, message:'error al registrar está categoria'});
      res.status(200).json({success:true, message:'se registro correctamente está categoria'});
    });


  
       
});
/*actualizando la categoria*/
router.put('/:id',async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404).send({success:true, message:'comuniquese con soporte'});
    }
    if(!req.body.name || !req.body.color) {
        respuesta = {
         codigo: 502,
         mensaje: 'Estos campos son requeridos'
         
        };
        res.send(respuesta);
       }
  
const category = await Category.findByIdAndUpdate(
    req.params.id,{
        name: req.body.name,
        icon: req.body.icon,
        color:req.body.color
    },{
        new:true
    }
)
category.save(function (err, category) {
    if (err) return res.status(404).send({success:false, message:'error al registrar está categoria', err});
    res.status(200).json({success:true, message:'se registro correctamente está categoria', category});
  });


});





    

/*metodo de eliminar*/

router.delete('/:id', (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404).send({success:true, message:'comuniquese con soporte'});
    }
Category.findByIdAndRemove(req.params.id).then(category =>{
    if(category){
        return res.status(200).json({success:true, message:'se elimino correctamente'})

    }else{
        return res.status(500).json({success:false, message:'error al eliminar esta categoria'})
    }
}).catch(err=>{
    return res.status(400).json({success:false, error:err, message:'estos datos no existen en la base de datos'});
})
})
module.exports =router;