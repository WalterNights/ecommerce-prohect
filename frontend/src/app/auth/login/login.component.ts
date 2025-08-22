import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../services/auth.services';
import { StorageMethodComponent } from '../../utils/storage-method/storage-method';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isStorage = false;
  storage: 'session' | 'local' = 'session';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageMethod: StorageMethodComponent
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
   }

   toggleStorage() {
      this.isStorage = !this.isStorage;
      if (this.isStorage) {
         localStorage.setItem('storage', 'true');
         this.storage = 'local';
      } else {
         localStorage.setItem('storage', 'false');
         this.storage = 'session';
      }
   }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/']);
        }, 1200);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales inválidas. Intentalo nuevamente.';
      }
    });
  }
}