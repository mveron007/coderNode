import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';


export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async loadFromFile() {
    try {
      const data = await fsPromises.readFile(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar carritos:', error);
      this.carts = [];
    }
  }

  async saveToFile() {
    try {
      const dataToFile = JSON.stringify(this.carts, null, 2);
      await fsPromises.writeFile(this.path, dataToFile, 'utf8');
      console.log('Carritos guardados en', this.path);
    } catch (error) {
      console.error('Error al guardar carritos:', error);
    }
  }

  async createCart() {
    const newCart = { id: uuidv4(), products: [] };
    this.carts.push(newCart);
    await this.saveToFile();
    return newCart;
  }
}
