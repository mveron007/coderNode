import express from "express";
import sanitizeHtml from 'sanitize-html';
import ProductManager from '../ProductManager.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import __dirname from '../utils.js';
import { productModel } from "../dao/models/product.model.js";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../dao/controller/product.controller.js";

let productManager = new ProductManager(path.join(__dirname, 'products.json'));

const router = express.Router();

router.get('/', async (req, res) => {
    let products = getAllProducts();
    res.render('home', { products });
    // try {
    //     let products = await productModel.find();

    //     let limit = sanitizeHtml(req.params.limit);
    //     if (limit > 0 && Number.isInteger(limit)) {
    //         products = products.slice(0, limitValue);
    //     }
    //     res.render('home', { products });
    // } catch (error) {
    //     console.error('Error al obtener productos:', error);
    // }
});

router.get('/:pid', async (req, res) => {
    let {pid} = req.params;

    let product = getProductById(pid);
    res.send({status:"success", product});

    // try {
    //     let product = await productModel.findOne({id: pid});

    //     if (!product) {
    //         throw new Error("Producto no encontrado");
    //     }
    //     res.send({status:"success", product});
    // } catch (error) {
    //     console.error('Error al obtener producto por ID:', error.message);
    // }
});

router.post('/', createProduct(req, res));
// async (req, res) => {


    // let { title, description, price, thumbnails, code, status, stock } = req.body;
    // try {
    //     if (!title || !description || !price || !thumbnails || !code || !status || !stock) {
    //         throw new Error('Datos de producto no válidos');
    //     }

    //     let newProduct = await productModel.create({
    //         id: uuidv4(),
    //         title,
    //         description,
    //         price,
    //         thumbnails,
    //         code,
    //         status: status !== "" ? status : true,
    //         stock
    //     });

    //     res.send({ status: "success", payload: newProduct });
    // } catch (error) {
    //     console.error('Error al agregar nuevo producto:', error.message);
    //     res.status(400).json({ error: error.message });
    // }
// });

router.put('/:pid', async (req, res) => {
    let { pid } = req.params;
    let productToReplace = req.body
    updateProduct(pid, productToReplace, res);
    // if (!productToReplace) {
    //     res.send({ result: "error", error: "Faltan datos" });
    // }
    // let result = await productModel.updateOne({ id: pid }, productToReplace);
    // res.send({ result: "success", payload: result })

    // console.log(`El id es: ${pid}`);

});

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params;
    deleteProduct(pid, res);
    // try {
    //     let product = await productModel.deleteOne({id:pid});

    //     if (!product) {
    //         throw new Error(`Error al eliminar el producto ${pid}`);
    //     }

    //     res.send({result:"success",payload: product});
    // } catch (error) {
    //     res.send({result:"error", error: error.message});
    // }

});

export default router;