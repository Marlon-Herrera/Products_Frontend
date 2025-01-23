import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; // Importar Location

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  product: any = { name: '', description: '', price: 0, quantity: 0 };
  productId: number | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location // Inyectar Location
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe((data) => {
        this.product = data;
      });
    }
  }

  onSubmit(): void {
    // Validaciones
    if (!this.product.name || this.product.name.length < 3) {
      alert('Please enter a valid name with at least 3 characters.');
      return;
    }

    if (this.product.price <= 0) {
      alert('Please enter a price greater than 0.');
      return;
    }

    if (!Number.isInteger(this.product.quantity) || this.product.quantity < 0) {
      alert('Quantity must be a non-negative integer.');
      return;
    }

    // Si la validación es exitosa, enviar el formulario
    if (this.productId) {
      this.productService
        .updateProduct(this.productId, this.product)
        .subscribe(() => this.router.navigate(['/']));
    } else {
      this.productService.createProduct(this.product).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
