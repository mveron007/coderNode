import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: ObjectId,
    rol: String,
});

export const userModel = mongoose.model(userCollection, userSchema);