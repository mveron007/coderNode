import express from "express";
import ProductManager from '../dao/managerFs/ProductManager.js';
import path from 'path';
import __dirname from '../utils.js';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../dao/controller/product.controller.js";

let productManager = new ProductManager(path.join(__dirname, 'products.json'));

const router = express.Router();

router.get('/', async (req, res) => {
    let prods = getAllProducts();
    prods.then(function(products){
        res.render('home', { products });
    })
});

router.get('/:pid', async (req, res) => {
    let {pid} = req.params;

    let prod = getProductById(pid);

    prod.then(function(product){
        res.send({status:"success", product});
    })
});

router.post('/', async (req, res) =>{
    let { title, description, price, thumbnails, code, status, stock } = req.body;
    let product = {
        title,
        description,
        price,
        thumbnails,
        code,
        status: status !== "" ? status : true,
        stock
    };
    res.send({ status: "success", payload: createProduct(product) });
});
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
    res.send({ result: "success", payload: updateProduct(pid, productToReplace) });
    // if (!productToReplace) {
    //     res.send({ result: "error", error: "Faltan datos" });
    // }
    // let result = await productModel.updateOne({ id: pid }, productToReplace);
    // res.send({ result: "success", payload: result })

    // console.log(`El id es: ${pid}`);

});

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params;
    res.send({status: "success", payload: deleteProduct(pid)});
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