// const express = require('express');
import express from 'express';
import ProductManager from './ProductManager.js';
// const ProductManager = require('./ProductManager');
import sanitizeHtml from 'sanitize-html';
const app = express();
// const sanitizeHtml = require('sanitize-html');
let productManager = new ProductManager("./products.json");

app.get("/products", async (req, res)=>{
    try {
        let limit = sanitizeHtml(req.params.limit);
        let productsToReturn = await productManager.loadFromFile();
        
        console.log(productsToReturn);
        if (limit > 0 && Number.isInteger(limit)) {
            productsToReturn = productsToReturn.slice(0, limit);
        }
        res.json({ products: Array.isArray(productsToReturn) ? productsToReturn : [] })
    } catch (error) {
        console.error(`Error al cargar lista de productos ${error}`);
    }
})

app.get("/products/:pid", async(req, res)=>{
    try {
        let pid = req.params.pid;

        let productsToReturn = await productManager.loadFromFile();
        res.json({ product: productsToReturn.find(product => product.id === pid)})
    } catch (error) {
        console.error(`Error al cargar lista de productos ${error}`);
    }
})

app.listen(8080,()=>console.log("Servidor activo"));

// TEST
// Array vacio
console.log(productManager.getProducts());
// Se agrega un producto
console.log(productManager.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25));
// Array cargado
console.log(productManager.getProducts());
// Compruebo validaciones
productManager.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25);
// Comprobacion de busqueda por Id => Aplique el id que haya generado en las pruebas anteriores
productManager.getProductById("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0");
productManager.getProductById(2);
// Cambio de campo => Aplique el id que haya generado en las pruebas anteriores
productManager.updateProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0", {title:"Producto actualizado"});
// Elimino producto => Aplique el id que haya generado en las pruebas anteriores
// prod.deleteProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0")