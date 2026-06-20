import { Product } from "@/types/product";
import { products as initialProducts } from "@/data/products";

// Interface for DB Operations
export interface DatabaseProvider {
  getProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: number): Promise<void>;
  updateProduct(id: number, product: Partial<Product>): Promise<void>;
}

// LocalStorage Fallback Provider (Default)
class LocalStorageProvider implements DatabaseProvider {
  private key = "arwani_products";

  private getLocal(): Product[] {
    if (typeof window === "undefined") return initialProducts;
    const data = localStorage.getItem(this.key);
    if (!data) {
      localStorage.setItem(this.key, JSON.stringify(initialProducts));
      return initialProducts;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialProducts;
    }
  }

  private saveLocal(prods: Product[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.key, JSON.stringify(prods));
  }

  async getProducts(): Promise<Product[]> {
    return this.getLocal();
  }

  async saveProduct(product: Product): Promise<void> {
    const prods = this.getLocal();
    const index = prods.findIndex(p => p.id === product.id);
    if (index > -1) {
      prods[index] = product;
    } else {
      prods.push(product);
    }
    this.saveLocal(prods);
  }

  async deleteProduct(id: number): Promise<void> {
    const prods = this.getLocal();
    const filtered = prods.filter(p => p.id !== id);
    this.saveLocal(filtered);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    const prods = this.getLocal();
    const index = prods.findIndex(p => p.id === id);
    if (index > -1) {
      prods[index] = { ...prods[index], ...product };
      this.saveLocal(prods);
    }
  }
}

// -------------------------------------------------------------
// Boilerplate code for Supabase connection
// To use Supabase:
// 1. Run: npm install @supabase/supabase-js
// 2. Add environment variables:
//    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
// 3. Set NEXT_PUBLIC_DATABASE_PROVIDER=supabase
// -------------------------------------------------------------
/*
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

class SupabaseProvider implements DatabaseProvider {
  async getProducts(): Promise<Product[]> {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async saveProduct(product: Product): Promise<void> {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from('products').upsert(product);
    if (error) throw error;
  }

  async deleteProduct(id: number): Promise<void> {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from('products').update(product).eq('id', id);
    if (error) throw error;
  }
}
*/

// -------------------------------------------------------------
// Boilerplate code for Firebase Connection
// To use Firebase:
// 1. Run: npm install firebase
// 2. Add environment variables:
//    NEXT_PUBLIC_FIREBASE_API_KEY=...
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
//    NEXT_PUBLIC_FIREBASE_APP_ID=...
// 3. Set NEXT_PUBLIC_DATABASE_PROVIDER=firebase
// -------------------------------------------------------------
/*
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const hasFirebase = Object.values(firebaseConfig).every(v => !!v);
const app = hasFirebase ? initializeApp(firebaseConfig) : null;
const firestore = app ? getFirestore(app) : null;

class FirebaseProvider implements DatabaseProvider {
  async getProducts(): Promise<Product[]> {
    if (!firestore) throw new Error("Firebase is not configured");
    const querySnapshot = await getDocs(collection(firestore, "products"));
    const list: Product[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Product);
    });
    return list.sort((a, b) => a.id - b.id);
  }

  async saveProduct(product: Product): Promise<void> {
    if (!firestore) throw new Error("Firebase is not configured");
    await setDoc(doc(firestore, "products", String(product.id)), product);
  }

  async deleteProduct(id: number): Promise<void> {
    if (!firestore) throw new Error("Firebase is not configured");
    await deleteDoc(doc(firestore, "products", String(id)));
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    if (!firestore) throw new Error("Firebase is not configured");
    await updateDoc(doc(firestore, "products", String(id)), product);
  }
}
*/

// Factory for getting the active DB provider
export const getDbProvider = (): DatabaseProvider => {
  const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;
  
  // You can uncomment and load Supabase/Firebase classes once libraries are installed
  /*
  if (provider === 'supabase' && supabase) {
    return new SupabaseProvider();
  }
  if (provider === 'firebase' && firestore) {
    return new FirebaseProvider();
  }
  */
  
  return new LocalStorageProvider();
};
