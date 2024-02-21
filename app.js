import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewRouter from './routes/views.router.js';
// import dbPromise from './db.js';
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbName= process.env.DB_NAME
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const clusterName = process.env.CLUSTER_NAME;
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`${PORT}`));
const socketServer = new Server(httpServer);

app.engine(
    'handlebars', 
    handlebars.engine({runtimeOptions: {allowProtoPropertiesByDefault: true}}));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.use('/', viewRouter);

socketServer.on('connection', socket => {
    console.log("Cliente conectado");

    socket.on('productUpdated', () => {
        socketServer.emit('updateRealTimeProducts');
    });

    // Manejar evento de agregar un nuevo producto
    socket.on('addProduct', (newProductData) => {
        
        socketServer.emit('updateRealTimeProducts');
    });

    // Manejar evento de eliminar un producto
    socket.on('deleteProduct', ({ productId }) => {
        socketServer.emit('updateRealTimeProducts');
    });

})


mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@${clusterName}.kyipzwi.mongodb.net/${dbName}?retryWrites=true&w=majority`)
.then(()=>{
    console.log("DB Conectada");
})
.catch(error=>{
    console.error("Ha sucedido un error", error);
});


const dbPromise = mongoose.connection;

dbPromise.on('error', console.error.bind(console, 'connection error:'));
dbPromise.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});
