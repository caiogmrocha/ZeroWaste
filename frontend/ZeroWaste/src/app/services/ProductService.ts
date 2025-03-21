import { Injectable } from "@angular/core";
import { Product } from "../pages/products/product";
import { API_URL } from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public async getAllProducts(daysToExpire: number | null = null): Promise<Product[]> {
    const url = `${API_URL}/products${daysToExpire ? `?daysToExpire=${daysToExpire}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const { products } = await response.json();
    return products ?? [];
  }

  public async getProductById(id: number): Promise<Product> {
    const response = await fetch(API_URL + '/products/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const { product } = await response.json();
    return product ?? {};
  }

  public async deleteProduct(id: number): Promise<void> {
    const response = await fetch(API_URL + '/products/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.json();

      throw new Error('Error deleting product', {
        cause: body,
      });
    }
  }
}
