import express from "express";
import { registerUser, loginUser } from "../dao/controller/user.controller.js";
import bcryptjs from "bcryptjs";
import { authToken, generateToken } from "../config/utils.js";

const userRouter = express.Router();


const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};

const isAuthorized = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.rol)) {
            return res.redirect('/profile');
        }

        next();
    };
};


userRouter.get('/', async (req, res) => {
    res.render('login');

});

userRouter.get('/register', async (req, res) => {
    res.render('register');

});

userRouter.post('/register',
    async (req, res) => {
        let { first_name, last_name, email, age, password, rol } = req.body;

        const hashedPassword = await bcryptjs.hash(password, 10);

        let user = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            rol
        };
        const createdUser = await registerUser(user);
        const access_token = generateToken(createdUser);
        // res.send({ status: "success", payload: registerUser(user) });
        res.cookie('authToken', access_token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Set secure only in production
            maxAge: 3600000,
        });
        res.render('login', {
            success: true,
            access_token: "El token fue guardado exitosamente"
        });

    });

userRouter.post('/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(`El email ${email}-${password}`);
    let getUser = loginUser(email, password);
    console.log("USER: ");
    console.log(JSON.stringify(getUser));
    // console.log(`session user: ${JSON.stringify(req.session.user)}`);
    const access_token = generateToken(getUser);
    res.cookie('authToken', access_token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Set secure only in production
        maxAge: 3600000,
    });
    res.render('profile', {
        success: true,
        access_token: "El token fue guardado exitosamente"
    });
});

userRouter.get('/current', authToken, (req, res) => {
    res.send({ status: "success", access_token });
});

userRouter.get('/admin', (req, res) => {
    res.render('admin', { user: req.session.user });
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user');
});

export default userRouter;