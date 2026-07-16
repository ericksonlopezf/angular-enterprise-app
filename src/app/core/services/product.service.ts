import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product, CreateProductRequest, UpdateProductRequest,
  AdjustStockRequest, PagedList, PaginationParams
} from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  // Loading state signals
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);

  getAll(params: PaginationParams = {}): Observable<PagedList<Product>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PagedList<Product>>(this.base, { params: httpParams });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(request: CreateProductRequest): Observable<string> {
    return this.http.post<string>(this.base, request);
  }

  update(id: string, request: UpdateProductRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, request);
  }

  adjustStock(id: string, request: AdjustStockRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/stock`, request);
  }
}
