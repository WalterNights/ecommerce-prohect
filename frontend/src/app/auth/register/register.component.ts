import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../services/auth.services';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  isStorage = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}:"<>?]).+$')
      ]],
      confirmPassword: ['', Validators.required],
      role: ['']
    }, { validators: [this.passwordMatchValidator()] });
  }

  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsDoNotMatch: true }
    };
  }

  toggleStorage() {
    this.isStorage = !this.isStorage;
    if (this.isStorage) {
      localStorage.setItem('role', 'admin');
      console.log(localStorage.getItem('role'), this.isStorage)
    } else {
      localStorage.setItem('role', 'client');
      console.log(localStorage.getItem('role'), this.isStorage)
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    const { username, email, password } = this.registerForm.value;
    const role = localStorage.getItem('role') ?? 'client';
    if (password === username || password === email) {
      this.errorMessage = 'La contraseña no puede ser igual al nombre de usuario o correo'
    }
    this.isLoading = true;
    this.authService.register({ username, email, password, role }).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/auth/login'])
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al registrar usuario. Intentelo nuevamente';
        console.error('ERROR AL REGISTRAR USUARIO:', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          message: err.error?.message || err.message,
          bodySent: { username, email, password, role }
        });
      }
    });
  }
}
