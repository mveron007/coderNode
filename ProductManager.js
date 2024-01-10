const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    getProducts() {
        let productsCopy = [...this.products];
        return productsCopy;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const newProduct = {
            id: uuidv4(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        let codeCheck = this.products.find(product => product.code === code) ? true : false;

        if (codeCheck == true ||
            this.validateField(title) ||
            this.validateField(description) ||
            this.validateField(price) ||
            this.validateField(thumbnail) ||
            this.validateField(stock)) {
            return "Error"
        } else {
            this.products.push(newProduct);
            await this.saveToFile(this.path, this.products);
            return newProduct;
        }
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
            await fs.writeFileSync(path, dataToFile);
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }
}


// TEST
const prod = new ProductManager("./products.json");
// Array vacio
console.log(prod.getProducts());
// Se agrega un producto
console.log(prod.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25));
// Array cargado
console.log(prod.getProducts());
// Compruebo validaciones
prod.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25);
// Comprobacion de busqueda por Id => Aplique el id que haya generado en las pruebas anteriores
prod.getProductById("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0");
prod.getProductById(2);
// Cambio de campo => Aplique el id que haya generado en las pruebas anteriores
prod.updateProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0", {title:"Producto actualizado"});
// Elimino producto => Aplique el id que haya generado en las pruebas anteriores
// prod.deleteProduct("8b23ef7f-9ea5-4b8b-a704-a0bd937d7af0")