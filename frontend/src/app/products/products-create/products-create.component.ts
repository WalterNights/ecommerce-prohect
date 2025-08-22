import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.scss']

})
export class ProductCreateComponent {
  productForm: FormGroup;
  submitting = false;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      batch_number: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      date_in: [new Date(), Validators.required]
    });
  }

  submit() {
    if (this.productForm.invalid) return;
    console.log(this.productForm.value)
    this.submitting = true;
    this.http.post(`${environment.apiUrl}/products`, this.productForm.value).subscribe({
      next: (res: any) => {
        this.message = 'Producto creado correctamente!';
        this.submitting = false;
        this.productForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error al crear el producto';
        this.submitting = false;
      }
    });
  }
}