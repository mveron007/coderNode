import mongoose from "mongoose";
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { createProduct, deleteProduct, getAllProducts } from "../dao/controller/product.controller.js";
import messageModel from "../dao/models/messages.model.js";

dotenv.config();

const dbName = process.env.DB_NAME
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const clusterName = process.env.CLUSTER_NAME;
const urlDb = `mongodb+srv://${dbUsername}:${dbPassword}@${clusterName}.kyipzwi.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);


mongoose.connect(urlDb)
  .then(() => {
    console.log("DB Conectada");
  })
  .catch(error => {
    console.error("Ha sucedido un error", error);
  });


const dbPromise = mongoose.connection;

dbPromise.on('error', console.error.bind(console, 'connection error:'));
dbPromise.once('open', function () {
  console.log('Connected to MongoDB Atlas');
});

socketServer.on('connection', socket => {
  console.log("Cliente conectado");

  socket.on('productUpdated', () => {
    socketServer.emit('updateRealTimeProducts');
  });

  socket.on('addProduct', async (data) => {
    let { title, description, price, code, stock } = data.product;
  
    try {
      if (!data) {
        throw new Error("Error al ingresar producto");
      }

      createProduct({
        id: uuidv4(),
        title: title,
        description: description,
        price: price,
        thumbnails: [],
        code: code,
        status: true,
        stock: stock
      });
      let updatedProducts = getAllProducts();

      updatedProducts.then(function (products) {
        socketServer.emit('updateRealTimeProducts', products);
      })

    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

  socket.on('deleteProduct', async ({ productId }) => {
    try {
      if (!productId) {
        throw new Error("Error al ingresar producto");
      }
      deleteProduct(productId);
      let updatedProducts = getAllProducts();

      updatedProducts.then(function (products) {
        socketServer.emit('updateRealTimeProducts', products);
      })
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });


  socket.on('message', async (data) => {
    let user = data.user;
    let message = data.message;
    try {
      if (message == '') {
        throw new Error("El mensaje es invalido");
      }
      const newMessage = await messageModel.create({ user, message });
      socketServer.emit('message', newMessage);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

})

export { app, server, urlDb, dbPromise };

