import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewRouter from './routes/views.router.js';
import { app, server, dbPromise, urlDb } from './server.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import userRouter from './routes/user.router.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import sessionRouter from './routes/sessions.router.js';

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(session({
    store: new MongoStore({ 
        mongoUrl: urlDb,
        mongooseConnection: dbPromise,
        ttl:15
     }),
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
  }));
app.use(passport.initialize());

app.engine(
    'handlebars', 
    handlebars.engine({runtimeOptions: {allowProtoPropertiesByDefault: true}}));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.use('/', viewRouter);

app.use('/user', userRouter);

app.use('/api/sessions', sessionRouter);

server.listen(PORT, () => console.log(`${PORT}`));
