import { productModel } from './dao/models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

const getAllProducts = async (req, res)=>{
    const products = await productModel.find();
    res.json(products);
}

const createProduct = async (product, res)=>{
    let { title, description, price, thumbnails, code, status, stock } = product;
    try {
        if (!title || !description || !price || !thumbnails || !code || !status || !stock) {
            throw new Error('Datos de producto no válidos');
        }

        let newProduct = await productModel.create({
            id: uuidv4(),
            title,
            description,
            price,
            thumbnails,
            code,
            status: status !== "" ? status : true,
            stock
        });

        res.send({ status: "success", payload: newProduct });
    } catch (error) {
        console.error('Error al agregar nuevo producto:', error.message);
        res.status(400).json({ error: error.message });
    }
}

const getProductById = async (pid, res) =>{
    try {
        let product = await productModel.findOne({id: pid});

        if (!product) {
            throw new Error("Producto no encontrado");
        }
        // res.send({status:"success", product});
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error.message);
    }
}

const updateProduct = async (pid, prod, res) =>{
    let productToReplace = prod;
    
    if (!productToReplace) {
        res.send({ result: "error", error: "Faltan datos" });
    }
    let result = await productModel.updateOne({ id: pid }, productToReplace);
    res.send({ result: "success", payload: result })

    console.log(`El id es: ${pid}`);
}

const deleteProduct = async (pid, res) =>{
    try {
        let product = await productModel.deleteOne({id:pid});

        if (!product) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }

        res.send({result:"success",payload: product});
    } catch (error) {
        res.send({result:"error", error: error.message});
    }

}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct};