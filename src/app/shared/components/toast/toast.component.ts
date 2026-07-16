import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getClasses(toast: Toast): string {
    const base = 'bg-surface-800/95 border';
    const map: Record<Toast['type'], string> = {
      success: `${base} border-emerald-500/30`,
      error:   `${base} border-red-500/30`,
      warning: `${base} border-amber-500/30`,
      info:    `${base} border-blue-500/30`
    };
    return map[toast.type];
  }

  getIconBg(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: 'bg-emerald-500/15',
      error:   'bg-red-500/15',
      warning: 'bg-amber-500/15',
      info:    'bg-blue-500/15'
    };
    return map[toast.type];
  }
}
