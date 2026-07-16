import { inject, Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  success(title: string, message?: string, duration = 4000): void {
    this.add({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration = 6000): void {
    this.add({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration = 5000): void {
    this.add({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration = 4000): void {
    this.add({ type: 'info', title, message, duration });
  }

  dismiss(id: string): void {
    this.toasts.update(ts => ts.filter(t => t.id !== id));
  }

  private add(toast: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    this.toasts.update(ts => [...ts, { ...toast, id }]);
    setTimeout(() => this.dismiss(id), toast.duration);
  }
}
