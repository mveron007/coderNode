import { cartModel } from "../models/carts.model.js";

const getCartById = async (cid) => {
    try {
        let cart = await cartModel.findOne({ _id: cid });

        if (!cart) {
            throw new Error("Error al cargar el carrito");
        }
        return cart;
        // res.send({ status: "success", products: cart.products });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error.message);
    }
}

const createCart = async (products) => {
    console.log(`Products: ${JSON.stringify(products)}`);
    try {
        if (!products) {
            throw new Error("La lista de productos es invalida");
        }
        let newCart = await cartModel.create({
            products
        });

        console.log("NUEVO CART: ");
        console.log(newCart);
        return newCart;
        // res.send({ status: "success", payload: newCart });
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error.message);
    }
}

const updateCart = async (cid, pid, quantity) => {
    try {
        const productIndex = 0;
        const filter = { _id: cid };
        const update = {
            $set: {
                [`products.${productIndex}.qty`]: quantity // Actualiza la cantidad del producto en el índice especificado a 4
            }
        };
        // let cart = await cartModel.findOne({ _id: cid });
        // const cart = await cartModel.updateOne(
        //     { _id: cid, "products.product": pid },
        //     { $set: { "products.0.qty":quantity} }
        // );
        let cartID = await cartModel.findById(cid);
        console.log(JSON.stringify(cartID ));
        let cart = await cartModel.findByIdAndUpdate(cid, products[0].qty = quantity);
        console.log(`Cart encontrado: ${JSON.stringify(cart)}`);
        if (!cart) {
            throw new Error("Error al cargar el carrito");
        }

        // console.log("Actualizado: ");
        // console.log(cart);
        return cart;

        // for (let index = 0; index < cart.products.length; index++) {
        //     let prod = cart.products[index];
        //     console.log(`PROD: ${prod}`);
        //     let quantity = prod.qty;
        //     console.log(`Cantiudad: ${quantity}`); 
        //     console.log(`LOG ID: ${typeof prod._id.toString()}`);
        //     console.log(`PID: ${typeof pid}`);
        //     console.log(`BOOLEAN ${prod._id === pid}`);
        //     if (prod._id.toString() === pid) {
        //         cartModel.updateOne(cart, cart.products[index].qty++);    
        //     }else{
        //         throw new Error("Error al actualizar el carrito");
        //     }

    } catch (error) {
        console.error('Error al agregar producto:', error.message);
    }
};

export { getCartById, createCart, updateCart };