import express from "express";
import sanitizeHtml from 'sanitize-html';
import ProductManager from '../ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let productManager = new ProductManager(path.join(__dirname, '..','products.json'));

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await productManager.loadFromFile();

        let productsToReturn = productManager.products;

        let limit = sanitizeHtml(req.params.limit);
        if (limit > 0 && Number.isInteger(limit)) {
            productsToReturn = productsToReturn.slice(0, limitValue);
        }

        res.json({ products: productsToReturn });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
    const newProductData = req.body;
    console.log(`Nuevo: ${JSON.stringify(newProductData)}`);
    try {
        // let productsArray = await productManager.loadFromFile();
        const newProduct = await productManager.addProduct(newProductData);
        console.log(`EL PROD: ${newProduct}`);
        res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al agregar nuevo producto:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;
  
    try {
      await productManager.loadFromFile();
      const updatedProduct = await productManager.updateProduct(productId, updatedFields);
      res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
    } catch (error) {
      console.error('Error al actualizar producto:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      await productManager.loadFromFile();
      await productManager.deleteProduct(productId);
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

export default router;