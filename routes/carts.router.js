import express from "express";
import CartManager from '../CartManager.js';
const router = express.Router();

const cartManager = new CartManager('../carts.json');

router.post('/', async (req, res) => {
    try {
        await cartManager.loadFromFile();
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        await cartManager.loadFromFile();

        const cart = cartManager.carts.find(cart => cart.id === cartId);

        if (cart) {
            res.json({ products: cart.products });
        } else {
            res.status(204).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.loadFromFile();

        const cart = cartManager.carts.find(cart => cart.id === cartId);

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await cartManager.saveToFile();

        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;