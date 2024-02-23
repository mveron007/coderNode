import express from "express";
import sanitizeHtml from 'sanitize-html';
import ProductManager from '../ProductManager.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import __dirname from '../utils.js';
import { productModel } from "../dao/models/product.model.js";

let productManager = new ProductManager(path.join(__dirname, 'products.json'));

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let products = await productModel.find();

        let limit = sanitizeHtml(req.params.limit);
        if (limit > 0 && Number.isInteger(limit)) {
            products = products.slice(0, limitValue);
        }
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        // res.status(500).json({ error: 'Error interno del servidor' });
        // res.render('home',{
        //     msg: "No hay productos disponibles"
        // });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        await productManager.loadFromFile();

        const product = productManager.products.find(product => product.id === productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    let { title, description, price, thumbnails, code, status, stock } = req.body;
    try {
        if (!title || !description || !price || !thumbnails || !code || !status || !stock) {
            throw new Error('Datos de producto no válidos');
        }

        let newProduct = await productModel.create({
            id: uuidv4(),
            title,
            description,
            price,
            thumbnails,
            code,
            status: status !== "" ? status : true,
            stock
        });

        res.send({ status: "success", payload: newProduct });
    } catch (error) {
        console.error('Error al agregar nuevo producto:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    let { pid } = req.params;
    let productToReplace = req.body

    if (!productToReplace) {
        res.send({ result: "error", error: "Faltan datos" });
    }
    let result = await productModel.updateOne({ id: pid }, productToReplace);
    res.send({ result: "success", payload: result })

    console.log(`El id es: ${pid}`);

});

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params;
    try {
        let product = await productModel.deleteOne({id:pid});

        if (!product) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }

        res.send({result:"success",payload: product});
    } catch (error) {
        res.send({result:"error", error: error.message});
    }

});

export default router;