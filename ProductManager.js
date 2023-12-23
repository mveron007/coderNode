class ProductManager{
    constructor(){
        this.products = [];
    }

    getProducts(){
        console.log("Lista: ");
        console.log(this.products);
        return this.productos;
    }

    addProduct(title, description, price, thumbnail, code, stock){
        const newProduct = {
            id: this.products.length + 1,
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
            this.validateField(stock) ) {
            console.log("Error");
            return "Error"
        }else{
            this.products.push(newProduct);
            console.log("Producto: ");
            console.log(newProduct);
            return newProduct;
        }
    }

    getProductById(productId){
        let result = this.products.find(prod => prod.id === productId);
        console.log(`Result:`);
        console.log(result);
        return result ? result : "Not found";
    }

    validateField(field){
        return field == undefined || field == "" || field == null;
    }
}


// TEST
const prod = new ProductManager();
// Array vacio
prod.getProducts();
// Se agrega un producto
prod.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25);
// Array cargado
prod.getProducts();
// Compruebo validaciones
prod.addProduct("Producto prueba", "Es un producto prueba", 200, "Sin imagen", "abc123", 25);
// Comprobacion de busqueda por Id
prod.getProductById(1);
prod.getProductById(2);