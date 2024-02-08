import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewRouter from './routes/views.router.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`${PORT}`));
const socketServer = new Server(httpServer);



app.engine('handlebars', handlebars.engine());
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


// TEST
// Array vacio
// console.log(productManager.getProducts());
// // Se agrega un producto
// console.log(productManager.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25));
// // Array cargado
// console.log(productManager.getProducts());
// // Compruebo validaciones
// productManager.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25);
// // Comprobacion de busqueda por Id => Aplique el id que haya generado en las pruebas anteriores
// productManager.getProductById("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0");
// productManager.getProductById(2);
// // Cambio de campo => Aplique el id que haya generado en las pruebas anteriores
// productManager.updateProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0", {title:"Producto actualizado"});
// // Elimino producto => Aplique el id que haya generado en las pruebas anteriores
// // prod.deleteProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0")