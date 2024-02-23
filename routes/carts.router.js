import express from "express";
import CartManager from '../CartManager.js';
import path from 'path';
import __dirname from '../utils.js';
import { cartModel } from "../dao/models/carts.model.js";

const router = express.Router();


const cartManager = new CartManager(path.join(__dirname, '..','products.json'));

router.post('/', async (req, res) => {
    console.log(req.body);
    let {qty, product} = req.body.products;
    console.log(`Cant: ${qty}`);
    console.log(`Prod: ${JSON.stringify(product)}`);
    try {
        if (!product) {
            throw new Error("La lista de productos es invalida");
        }
        let newCart = await cartModel.create({
            qty,
            product
        })
        res.send({status:"success", payload: newCart});
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error.message);
    }
});


router.get('/:cid', async (req, res) => {
    let {cid} = req.params;
    try {
        let cart = await cartModel.findOne({_id:cid});

        if (!cart) {
            throw new Error("Error al cargar el carrito");
        }
        res.send({status:"success", products: cart.products});
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    let {cid, pid} = req.params;

    try {

        let cart = await cartModel.findOne({_id:cid});

        if (!cart) {
            throw new Error("Error al cargar el carrito");
        }

        const existingProductIndex = cart.products.findIndex(product => product.id === pid);
        let quantity = cart.products[existingProductIndex].qty;
        if (existingProductIndex !== -1) {
            cartModel.updateOne(cart.products[existingProductIndex], quantity++);
            console.log(`LA nueva cantidad es: ${cart.products[existingProductIndex].qty}`);
        }

        res.send({status:"success", cart});
    } catch (error) {
        console.error('Error al agregar producto:', error.message);
    }
});

export default router;