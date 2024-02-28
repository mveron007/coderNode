import { cartModel } from "../models/carts.model";

const getCartById = async (cid, res) =>{
    try {
        let cart = await cartModel.findOne({_id:cid});

        if (!cart) {
            throw new Error("Error al cargar el carrito");
        }
        res.send({status:"success", products: cart.products});
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error.message);
    }
}

const createCart = async (qty, product, res) =>{
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
}

const updateCart = async (cid, pid, res)=>{
    
};