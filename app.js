/*declarando variables e importaciones*/
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors());
/*trayando la data de conexion*/
require('dotenv/config');
const api = process.env.API_URL;

/*el uso de los middlewares*/
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);


/*trayendo el token */


/*trayendo la rutas*/
const categoriesRoutes = require("./routes/categories");
const productRouter = require('./routes/products');
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");


app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);






/*Haciendo la conexion respectiva*/
mongoose.connect(process.env.conexion, {
   useNewUrlParser:true,
   useUnifiedTopology:true,
   dbName: 'e-shop'
}).then(()=>{
    console.log('se traera la conexion');
}).catch((err)=>{
    console.log(err);
})


/*levantando servidor*/

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' +process.env.PORT);
    console.log(api)
  })