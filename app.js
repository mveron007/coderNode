import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewRouter from './routes/views.router.js';
import { app, server } from './server.js';

const PORT = 8080;

app.engine(
    'handlebars', 
    handlebars.engine({runtimeOptions: {allowProtoPropertiesByDefault: true}}));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.use('/', viewRouter);

server.listen(PORT, () => console.log(`${PORT}`));
