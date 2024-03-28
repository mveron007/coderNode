import express from "express";
import ProductManager from '../dao/managerFs/ProductManager.js';
import path from 'path';
import {__dirname }from '../config/utils.js';
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


router.put('/:pid', async (req, res) => {
    let { pid } = req.params;
    let productToReplace = req.body
    res.send({ result: "success", payload: updateProduct(pid, productToReplace) });

});

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params;
    res.send({status: "success", payload: deleteProduct(pid)});
});

export default router;