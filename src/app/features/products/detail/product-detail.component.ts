import { Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  @Input() id!: string;

  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly isSavingEdit = signal(false);
  readonly isSavingStock = signal(false);

  stockAdjustment = 0;

  readonly editForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.productService.getById(this.id).subscribe({
      next: product => {
        this.product.set(product);
        this.editForm.patchValue(product);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Product not found');
        this.router.navigate(['/products']);
      }
    });
  }

  submitEdit(): void {
    if (this.editForm.invalid) return;
    this.isSavingEdit.set(true);
    this.productService.update(this.id, this.editForm.getRawValue() as any).subscribe({
      next: () => {
        this.isSavingEdit.set(false);
        this.toast.success('Product updated');
        this.product.update(p => p ? { ...p, ...this.editForm.getRawValue() as any } : p);
      },
      error: err => {
        this.isSavingEdit.set(false);
        this.toast.error('Update failed', err.userMessage);
      }
    });
  }

  submitStockAdjustment(): void {
    if (!this.stockAdjustment) return;
    this.isSavingStock.set(true);
    this.productService.adjustStock(this.id, { quantity: this.stockAdjustment }).subscribe({
      next: () => {
        this.isSavingStock.set(false);
        const newQty = (this.product()?.stockQuantity ?? 0) + this.stockAdjustment;
        this.product.update(p => p ? { ...p, stockQuantity: newQty } : p);
        this.toast.success(`Stock ${this.stockAdjustment > 0 ? 'added' : 'removed'}`, `New quantity: ${newQty}`);
        this.stockAdjustment = 0;
      },
      error: err => {
        this.isSavingStock.set(false);
        this.toast.error('Stock adjustment failed', err.userMessage);
      }
    });
  }
}
