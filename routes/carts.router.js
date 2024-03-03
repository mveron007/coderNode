import express from "express";
import CartManager from '../dao/managerFs/CartManager.js';
import path from 'path';
import __dirname from '../utils.js';
import {getCartById, createCart, updateCart} from "../dao/controller/carts.controller.js";

const router = express.Router();


const cartManager = new CartManager(path.join(__dirname, '..','products.json'));

router.post('/', async (req, res)=>{
    let {products} = req.body;

    console.log(req.body.products);
    console.log("BRRRRRRR");
    console.log(req.body.products[0]);

    let newCart = createCart(products);

    newCart.then(function(cart){
        res.send({status:"success", payload: cart});
    })
});


router.get('/:cid', async (req, res) => {
    let {cid} = req.params;
    let cart = getCartById(cid);

    cart.then(function(cartProd){
        res.send({status:"success", cart: cartProd});
    })
});

router.put('/:cid/product/:pid', async (req, res) => {
    let {cid, pid} = req.params;
    let {quantity} = req.body;
    console.log(quantity);
    let cart = await updateCart(cid, pid, quantity);

    // cart.then(function(cartUpdate){
    //     res.send({status:"success", cart: cartUpdate});
    // })
    res.send({ status: "success", cart });

});

export default router;