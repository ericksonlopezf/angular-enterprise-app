import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  passwordStrength() {
    const pw = this.form.get('password')?.value ?? '';
    const strength = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{12,}/]
      .filter(r => r.test(pw)).length;

    if (strength === 0) return { percent: 20, color: 'bg-red-500', textColor: 'text-red-400', label: 'Weak' };
    if (strength === 1) return { percent: 40, color: 'bg-amber-500', textColor: 'text-amber-400', label: 'Fair' };
    if (strength === 2) return { percent: 65, color: 'bg-yellow-400', textColor: 'text-yellow-400', label: 'Good' };
    if (strength === 3) return { percent: 85, color: 'bg-emerald-400', textColor: 'text-emerald-400', label: 'Strong' };
    return { percent: 100, color: 'bg-emerald-500', textColor: 'text-emerald-400', label: 'Very Strong' };
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.toast.success('Account created!', 'Welcome to the Enterprise Portal.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Registration failed', err.userMessage);
      }
    });
  }
}
