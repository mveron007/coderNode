import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const private_key = process.env.JWT_SECRET;

const generateToken = (user)=>{
    const token = jwt.sign({user},private_key,{expiresIn:'24h'});
    return token;
}

const authToken = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({
        error: "Not authenticated"
    })
    const token = authHeader.split(' ')[1];
    jwt.verify(token, private_key,(error, credentials)=>{
        if (error) return res.status(403).send({error:"Not authorized"})
        req.user = credentials.user;
        next();
    })
}

export  {generateToken, authToken, __dirname};