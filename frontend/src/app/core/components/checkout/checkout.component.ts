import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  formService = inject(FormService);
  checkoutForm: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor() {
    this.checkoutForm = this.fb.group({
      customer: this.fb.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.fb.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.fb.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.fb.group({
        cartType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    this.populateCreditCardMonthsAndYears();

  }

  submitOrder(form: FormGroup) {
    if (form.valid) {
      console.log('Order submitted:', form.value);
      // Here you would typically send the order data to your backend API
    } else {
      console.log('Form is invalid');
    }
  }
  sameAsShipping(e: any) {
    const billingAddress = this.checkoutForm.get('billingAddress');
    const shippingAddress = this.checkoutForm.get('shippingAddress');

    if (e.target.checked) {
      billingAddress?.setValue(shippingAddress?.value);
    } else {
      this.checkoutForm.controls['billingAddress'].reset();
    }
  }

  populateCreditCardMonthsAndYears() {
    const startMonth = new Date().getMonth() + 1;
    this.creditCardMonths = this.formService.getCrediCardMonths(startMonth);
    this.creditCardYears = this.formService.getCreditCardYears();
  }

  onChangeExpiationYear(event: any) {
    const selectedYear = +event.target.value;
    const currentYear = new Date().getFullYear();
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formService.getCrediCardMonths(startMonth);
  }

}