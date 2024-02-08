// const fs = require('fs');
import { log } from 'console';
import { promises as fsPromises } from 'fs';
// const { v4: uuidv4 } = require('uuid');
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    getProducts() {
        let productsCopy = [...this.products];
        return productsCopy;
    }

    // async addProduct(title, description, price, thumbnails, code, stock) {
        
    //     const newProduct = {
    //         id: uuidv4(),
    //         title: title,
    //         description: description,
    //         price: price,
    //         thumbnails: thumbnails,
    //         code: code,
    //         status: true,
    //         stock: stock
    //     };

    //     let codeCheck = this.products.find(product => product.code === code) ? true : false;
 
    //     try {
    //         if (codeCheck == true ||
    //             this.validateField(title) ||
    //             this.validateField(description) ||
    //             this.validateField(price) ||
    //             this.validateField(thumbnails) ||
    //             this.validateField(stock)) {
    //                 console.log(this.path);
    //             throw new Error("Error al crear producto");
    //         } else {
    //             this.products.push(newProduct);
    //             console.log();
    //             await this.saveToFile(this.path, this.products);
    //             console.log(`Este es el nuevo prod: ${newProduct}`);
    //             return newProduct;
    //         }
                
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }

    async addProduct(title, description, price, thumbnails, code, stock) {
        const newProduct = {
            id: uuidv4(),
            title: title,
            description: description,
            price: price,
            thumbnails: thumbnails,
            code: code,
            status: true,
            stock: stock
        };
    
        const codeExists = this.products.some(product => product.code === code);
    
        if (codeExists || !title || !description || !price || !thumbnails || !stock) {
            throw new Error("Error al crear producto: Campos inválidos o código duplicado.");
        }
    
        this.products.push(newProduct);
        await this.saveToFile(this.path, this.products);
        return newProduct;
    }
    

    async updateProduct(id, updateFields) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            const product = this.products[productIndex];

            if (typeof updateFields === 'object') {
                Object.keys(updateFields).forEach(key => {
                    if (key !== 'id') {
                        product[key] = updateFields[key];
                    }
                });
            }

            await this.saveToFile(this.path, this.products);
        } else {
            console.error(`Producto con ID ${id} no encontrado`);
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            await this.saveToFile(this.path, this.products);
        } else {
            console.error(`Producto con ID ${id} no encontrado`);
        }
    }


    getProductById(productId) {
        try {
            let result = this.products.find(prod => prod.id === productId);
            return result;    
        } catch (error) {
            console.error(`Producto con ID ${productId} no encontrado`);
        }
        
    }

    validateField(field) {
        return field == undefined || field == "" || field == null;
    }

    async saveToFile(path, data) {
        try {
            const dataToFile = JSON.stringify(data, null, 2);
            await fsPromises.writeFile(path, dataToFile);
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    async loadFromFile() {
        try {
          const data = await fsPromises.readFile(this.path, 'utf-8');
          this.products= JSON.parse(data);
          return this.products;
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }
    }
}