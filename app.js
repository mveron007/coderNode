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
import messageModel from './dao/models/messages.model.js';
import { productModel } from './dao/models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

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
    socket.on('addProduct', async (product) => {
        let {title, description, price, code, stock} = product;
        console.log(JSON.stringify(product));

        try {
            if (!product) {
                throw new Error("Error al ingresar producto");
            }
            await productModel.create({
                id: uuidv4(),
                title,
                description,
                price,
                thumbnails: [],
                code,
                status: true,
                stock
            });
            let updatedProducts = await productModel.find();
        
            socketServer.emit('updateRealTimeProducts', updatedProducts);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });

    // Manejar evento de eliminar un producto
    socket.on('deleteProduct', async({ productId }) => {
        try {
            if (!productId) {
                throw new Error("Error al ingresar producto");
            }
            await productModel.deleteOne({id: productId});
            let updatedProducts = await productModel.find();
        
            socketServer.emit('updateRealTimeProducts', updatedProducts);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });


    socket.on('message', async (data) => {
        let user= data.user;
        let message = data.message;
        try {
            if (message == '') {
                throw new Error("El mensaje es invalido");
            }
            const newMessage = await messageModel.create({user, message});
            socketServer.emit('message', newMessage);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
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
