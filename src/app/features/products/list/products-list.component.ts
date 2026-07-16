import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, PagedList, CreateProductRequest } from '../../../core/models/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly Math = Math;
  readonly data = signal<PagedList<Product> | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly showModal = signal(false);
  readonly currentPage = signal(1);

  searchQuery = '';
  pageSize = '20';

  readonly pages = computed(() => {
    const total = this.data()?.totalPages ?? 0;
    const current = this.currentPage();
    const range: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  });

  readonly createForm = this.fb.group({
    name: ['', []], description: ['', []],
    price: [null as number | null, []], initialStock: [0, []]
  });

  ngOnInit(): void {
    this.load();

    // Debounced search
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage.set(1);
      this.load();
    });
  }

  load(): void {
    this.isLoading.set(true);
    this.productService.getAll({
      page: this.currentPage(),
      pageSize: +this.pageSize,
      search: this.searchQuery || undefined
    }).subscribe({
      next: data => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Failed to load products', err.userMessage);
      }
    });
  }

  onSearch(value: string): void { this.search$.next(value); }
  onPageSizeChange(_: any): void { this.currentPage.set(1); this.load(); }
  goToPage(page: number): void { this.currentPage.set(page); this.load(); }

  openCreateModal(): void { this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); this.createForm.reset({ initialStock: 0 }); }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    this.isSaving.set(true);
    const req = this.createForm.getRawValue() as CreateProductRequest;
    this.productService.create(req).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.toast.success('Product created', `"${req.name}" has been added.`);
        this.load();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.toast.error('Failed to create product', err.userMessage);
      }
    });
  }

  stockBadge(qty: number): string {
    if (qty === 0) return 'badge-danger';
    if (qty < 10) return 'badge-warning';
    return 'badge-success';
  }
}
