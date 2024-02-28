import express from "express";
import ProductManager from '../ProductManager.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import __dirname from '../utils.js';
import { productModel } from "../dao/models/product.model.js";

const viewRouter = express.Router();

let productManager = new ProductManager(path.join(__dirname, 'products.json'));


viewRouter.get('/realtimeproducts', async (req, res) => {
    try {
        let productsToReturn = await productModel.find();

        if (!productsToReturn) {
            throw new Error("Error al cargar productos");
        }

        res.render('realTimeProducts',{ products: productsToReturn });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.render('home',{
            msg: "No hay productos disponibles"
        });
    }
});

viewRouter.get('/chat', async (req, res)=>{
    res.render('chat',{});
})

export default viewRouter;