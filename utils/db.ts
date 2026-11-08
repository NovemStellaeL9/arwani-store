// Local In-Memory & Database provider
import { Product } from "@/types/product";
import { products } from "@/data/products";

export interface DatabaseProvider {
  getProducts(): Promise<Product[]>;
  getProductById(id: number | string): Promise<Product | null>;
}

export class LocalDbProvider implements DatabaseProvider {
  async getProducts(): Promise<Product[]> {
    return products;
  }

  async getProductById(id: number | string): Promise<Product | null> {
    const found = products.find((p) => String(p.id) === String(id));
    return found || null;
  }
}

export const getDbProvider = (): DatabaseProvider => {
  return new LocalDbProvider();
};
