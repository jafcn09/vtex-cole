/*almacenar la rutas*/
const {Product} = require('../modules/product');
const express = require('express');
const { Category } = require('../modules/category');
const router = express.Router();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
/*metodo de lectura*/
router.get(`/`, async (req, res) =>{
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category').select(' description price')

    if(!productList) {
        res.status(500).json({success: true, message:'producto no visible'})
    } 
    res.status(200).send(productList).json({success:true, message:'producto visible'})
})
/*leer el producto por id por id*/
router.get('/:id', async(req,res) =>{

    const product= await Product.findById(req.params.id);
if(!product){
    res.status(500).json({message:'no se pudo visualizar el producto  por id'}).populate('category')
}
res.status(200).send(product);
})
/*leer el producto por contador*/
router.get(`/get/count`, async (req, res) =>{
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})




    /*metodo de almacenar*/
    router.post(`/`, async (req, res) =>{



       
/*la categoria , traera la información de cada uno de los productos, sea la categoria , 
    stock, es una llave foranea que devuelve informacion al key del producto*/

        if(!req.body.name || !req.body.description || !req.body.richDescription || !req.body.brand
             || !req.body.price || !req.body.price || !req.body.rating || !req.body.countInStock || !req.body.numReviews || !req.body.isFeatured)
              {
                respuesta = {
                    error: true,
                    codigo: 502,
                    mensaje: 'Estos campos son requeridos'
                    
                   };
                   res.send(respuesta);
           }

           
           var category =  Category.findById(req.body.category);
           if(!category) return res.status(400).send('Categoria Invalida')
    
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        })
    
        product = await  product.save(function (err, product) {
            if (err) return res.status(404).send({success:false, message:'error al registrar esta producto', err});
            res.status(200).json({success:true, message:'se registro correctamente este producto', product});
          });
        });
/*metodo de actualizar usuario*/

    router.put('/:id',async(req,res) =>
    
    {
        if(!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send({success:true, message:'error al actualizar este producto'});
        }
        if(!req.body.name || !req.body.description || !req.body.richDescription || !req.body.brand
            || !req.body.price || !req.body.price || !req.body.rating || !req.body.countInStock || !req.body.numReviews || !req.body.isFeatured)
             {
               respuestasss = {
                   error: true,
                   codigo: 502,
                   mensaje: 'Estos campos son requeridos'
                   
                  };
                  res.send(respuestasss);
          }
          const product =  await Product.findByIdAndUpdate(
              req.params.id,{
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
              },{
                new:true
            });
         
            product.save(function (err, product) {
                res.status(200).json({success:true, message:'se registro correctamente este producto'});
              });      
    })
    /*eliminar productos por id*/
    router.delete('/:id', async(req, res) => {
        if(!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send({success:true, message:'error al actualizar este producto'});
        }
        Product.findByIdAndRemove(req.params.id).then(product =>{
            if(product){
                return res.status(200).json({success:true, message:'se elimino correctamente'})
        
            }else{
                return res.status(500).json({success:false, message:'error al eliminar este producto'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err, message:'estos datos no existen en la base de datos'});
        })


        })
    module.exports = router;