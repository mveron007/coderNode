import express from "express";
import { registerUser, loginUser } from "../dao/controller/user.controller.js";
import bcryptjs from "bcryptjs";

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
 async (req, res)=>{
    let {first_name, last_name, email, age, password, rol} = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    let user = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      rol
    };
    res.send({status: "success", payload:registerUser(user)});

});

userRouter.post('/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(`El email ${email}-${password}`);
    let getUser = loginUser(email, password);
    getUser.then(function (user) {
        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol,
        };
        console.log(`session user: ${JSON.stringify(req.session.user)}`);
        res.render('profile', { user: req.session.user });
    })
});

userRouter.get('/admin', (req, res) => {
    res.render('admin', { user: req.session.user });
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user');
  });

export default userRouter;