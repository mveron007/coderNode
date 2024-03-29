import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number,
    status: Boolean
});

const productModel = mongoose.model(productCollection, productSchema);

export { productSchema, productModel };