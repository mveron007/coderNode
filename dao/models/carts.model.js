import mongoose from "mongoose";
import { productSchema } from "./product.model.js";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [{
        qty:{ type: Number, required: true, default: 1 },
        product: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
}]
});

export const cartModel = mongoose.model(cartCollection, cartSchema);