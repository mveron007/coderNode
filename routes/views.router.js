import express from "express";
import ProductManager from '../ProductManager.js';
import path from 'path';
import __dirname from '../utils.js';

const viewRouter = express.Router();

let productManager = new ProductManager(path.join(__dirname, 'products.json'));


viewRouter.get('/realtimeproducts', async (req, res) => {
    try {
        console.log(await productManager.loadFromFile());

        let productsToReturn = productManager.products;

        res.render('realTimeProducts',{ products: productsToReturn });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        res.render('home',{
            msg: "No hay productos disponibles"
        });
    }
});

export default viewRouter;