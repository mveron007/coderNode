import { userModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const registerUser = async (user) =>{
    try {
        if (!user) {
            throw new Error("Error al ingresar usuario");
        }
        let newUser = await userModel.create(user);
        return newUser;
    } catch (error) {
        console.error(error.message);
    }
}


const loginUser = async (email, password) => {
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        console.log(`Comparacion pwd: ${isMatch}`);

        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }
        return user;
    } catch (error) {
        console.error(error.message);
    }

};
export { registerUser, loginUser };