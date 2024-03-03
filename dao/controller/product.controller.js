import { productModel } from "../models/product.model.js";
import { v4 as uuidv4 } from 'uuid';

const getAllProducts = async ()=>{
    let products = await productModel.find();
    return products;
}

const createProduct = async (product)=>{
    let { title, description, price, thumbnails, code, status, stock } = product;
    console.log(`El producto ${title}-${description}: vale $ ${price}, codigo ${code}, status ${status}, stock ${stock}, thumb ${JSON.stringify(thumbnails)}`);
    try {
        if (!title || !description || !price || !code || !stock) {
            throw new Error('Datos de producto no válidos');
        }

        let newProduct = await productModel.create({
            id: uuidv4(),
            title,
            description,
            price,
            thumbnails: thumbnails.length > 0 ? thumbnails : [],
            code,
            status: status !== "" ? status : true,
            stock
        });
        return newProduct;
        // res.send({ status: "success", payload: newProduct });
    } catch (error) {
        console.error('Error al agregar nuevo producto:', error.message);
    }
}

const getProductById = async (pid) =>{
    try {
        let product = await productModel.findOne({id: pid});

        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
        // res.send({status:"success", product});
        // res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error.message);
    }
}

const updateProduct = async (pid, prod) =>{
    let productToReplace = prod;

    try {
        if (!productToReplace) {
            // res.send({ result: "error", error: "Faltan datos" });
            throw new Error("Error al actualizar producto");
        }
        let result = await productModel.updateOne({ id: pid }, productToReplace);
        console.log(`El id es: ${pid}`);
        return result;
        // res.send({ result: "success", payload: result })    
    } catch (error) {
        console.error(error.message);
    }
    
    
}

const deleteProduct = async (pid) =>{
    try {
        let product = await productModel.deleteOne({id:pid});

        if (!product) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }
        return product;
        // res.send({result:"success",payload: product});
    } catch (error) {
        console.error(error.message);
        // res.send({result:"error", error: error.message});
    }

}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct};