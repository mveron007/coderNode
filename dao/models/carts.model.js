import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: Array
});

//Export the model
module.exports = mongoose.model('User', userSchema);