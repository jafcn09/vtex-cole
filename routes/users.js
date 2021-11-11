/*declarando variables de la ruta*/
const {User} = require('../modules/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


/*metodo de lectura*/
router.get(`/`, async (req, res) =>{
    
    const userList = await User.find().select('name lastname email  calle ciudad pais phone passwordHash');

    if(!userList) {
        res.status(500).json({success: true, message:'usuario no encontrado'})
    } 
    res.status(200).send(userList).json({success:true, message:'usuario encontrado'})
})
/*metodo de lectura de usuario por id*/
router.get('/:id', async(req,res) =>{

    const user = await User.findById(req.params.id);
if(!user){
    res.status(500).json({message:'no se pudo visualizar el usuario por id'})
}
res.status(200).send(user);
})

/*metodo de almacenar de usuario*/



var BCRYPT_SALT_ROUNDS = 12;
router.post('/', async(req,res) =>{


    if( !req.body.name || !req.body.lastname || !req.body.email  || !req.body.phone || !req.body.calle || !req.body.apartamento || !req.body.postal || !req.body.ciudad||   !req.body.pais || !req.body.sexo || !req.body.fecha_nacimiento )
         {
           datooo = {
               error: true,
               codigo: 502,
               mensaje: 'Estos campos son requeridos'
               
              };
              res.send(datooo);
      }

  
      var  user = new User({
        name: req.body.name,
        lastname:req.body.lastname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        calle: req.body.calle,
        apartamento: req.body.apartamento,
        postal: req.body.apartamento,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        sexo: req.body.sexo,
        fecha_nacimiento: req.body.fecha_nacimiento
    })
    /*encriptando la contraseña*/
    

    user.save(function (err, user) {
        if (err) return res.status(404).send({success:false, message:'error al registrar este usuario', err});
        res.status(200).send({success:true, message:'se registro correctamente este usuario', user});
      });
});



/* metodo para logear a la app*/

router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password)
    {
      toma = {
          error: true,
          codigo: 502,
          mensaje: 'Estos campos son requeridos'
          
         };
         res.send(toma);
 }

    const user =  await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user){
        return     res.status(404).send({success:false, message:'no tiene permisos para acceder'});
    }
    if(user && bcrypt.compareSync(req.body.password,  user.passwordHash)) {
        const  token = jwt.sign({
            userId: user.id,
            isAdmin:user.isAdmin
        },
       secret,
       {expiresIn:'7d'}
     
        )
        
        res.status(200).send({success:true, message:'se logeo correctamente el usuario', user: user.email, token: token});
    }else{
        res.status(404).send({success:false, message:'usuario o contraseña erronea'});
    }


})

/*metodo de almacenar al registar usuario*/

router.post('/register', async(req,res) =>{


    if( !req.body.name || !req.body.lastname || !req.body.email  || !req.body.phone || !req.body.calle || !req.body.apartamento || !req.body.postal || !req.body.ciudad||   !req.body.pais || !req.body.sexo || !req.body.fecha_nacimiento )
         {
           reg = {
               error: true,
               codigo: 502,
               mensaje: 'Estos campos son requeridos'
               
              };
              res.send(reg);
      }

  
      var  user = new User({
        name: req.body.name,
        lastname:req.body.lastname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        calle: req.body.calle,
        apartamento: req.body.apartamento,
        postal: req.body.apartamento,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        sexo: req.body.sexo,
        fecha_nacimiento: req.body.fecha_nacimiento
    })
    /*encriptando la contraseña*/
    

    user.save(function (err, user) {
        if (err) return res.status(404).send({success:false, message:'error al registrar este usuario', err});
        res.status(200).send({success:true, message:'se registro correctamente este usuario', user});
      });

});

/*recibiendo sms en el registro*/

/*metodo de actualizar*/

router.put('/:id', async(req,res) =>
{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404).send({success:true, message:'comuniquese con soporte'});
    }
    
    if( !req.body.name || !req.body.lastname || !req.body.email  || !req.body.phone || !req.body.calle || !req.body.apartamento || !req.body.postal || !req.body.ciudad||   !req.body.pais || !req.body.sexo || !req.body.fecha_nacimiento )
         {
           respuesta = {
               error: true,
               codigo: 502,
               mensaje: 'Estos campos son requeridos'
               
              };
              res.send(respuesta);
      }
      const  user = await User.findByIdAndUpdate(
        req.params.id,{
        name: req.body.name,
        lastname:req.body.lastname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        calle: req.body.calle,
        apartamento: req.body.apartamento,
        postal: req.body.apartamento,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        sexo: req.body.sexo,
        fecha_nacimiento: req.body.fecha_nacimiento
    },{
        new:true
    });
    user.save(function (err, user) {
        res.status(200).json({success:true, message:'se registro correctamente este usuario'});
      }); 


      
})

    

/*metodo de elimiar usuario*/
router.delete('/:id', async(req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404).send({success:true, message:'comuniquese con soporte'});
    }
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
            return res.status(200).json({success:true, message:'se elimino correctamente este usuario'})
    
        }else{
            return res.status(500).json({success:false, message:'error al eliminar este usuario'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error:err, message:'estos datos no existen en la base de datos'});
    })

})
module.exports =router;