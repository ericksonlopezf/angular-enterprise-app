import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly theme = signal<Theme>('dark');

  constructor() {
    this.initializeTheme();
    
    // Automatically update the document class when the theme signal changes
    effect(() => {
      const current = this.theme();
      if (current === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('app_theme', current);
    });
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('app_theme') as Theme | null;
    if (savedTheme) {
      this.theme.set(savedTheme);
    } else {
      // Check OS preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.theme.set('light');
      } else {
        // Default to dark as per original design
        this.theme.set('dark');
      }
    }
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
