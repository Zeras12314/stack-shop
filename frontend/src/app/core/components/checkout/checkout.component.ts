import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Observable, take } from 'rxjs';
import { State } from '../../../common/state';
import { StackShopValidators } from '../../validators/stack-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../../common/order';
import { OrderItem } from '../../../common/order-item';
import { Purchase } from '../../../common/purchase';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CheckoutComponent implements OnInit {
  fb = inject(FormBuilder);
  formService = inject(FormService);
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  router = inject(Router);
  checkoutForm: FormGroup;
  isSameAsShipping = signal<boolean>(true);
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries$ = this.formService.getCountries();
  shippingAddressStates$!: Observable<State[]>;
  billingAddressStates$!: Observable<State[]>;

  constructor() {
    this.checkoutForm = this.fb.group({
      customer: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        email: ['', [Validators.required, Validators.email]]
      }),
      shippingAddress: this.fb.group({
        country: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]]
      }),
      billingAddress: this.fb.group({
        country: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]]
      }),
      creditCard: this.fb.group({
        cartType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), StackShopValidators.notOnlyWhitespace]],
        cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), StackShopValidators.notOnlyWhitespace, Validators.pattern('^[0-9]+$')]],
        securityCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4), StackShopValidators.notOnlyWhitespace, Validators.pattern('^[0-9]+$')]],
        expirationMonth: ['', [Validators.required]],
        expirationYear: ['', [Validators.required]],
      }),
    });

  }

  ngOnInit(): void {
    this.getCreditCardMonthsAndYears();
  }

  submitOrder() {
    const checkoutForm = this.checkoutForm

    if (checkoutForm.invalid) {
      checkoutForm.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.cartService.totalPrice();
    order.totalQauntity = this.cartService.totalQuantity();

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // setup up purchase
    let purchase = new Purchase();

    //populate purhase - customer
    purchase.customer = this.checkoutForm.controls['customer'].value;

    // populate purchase -shipping address
    const shippingAddress = this.checkoutForm.controls['shippingAddress'].value;
    purchase.shippingAddress = {
      ...shippingAddress,
      state: shippingAddress.state,
      country: shippingAddress.country
    };

    //populate purchase - billing address
    const billingAddress = this.checkoutForm.controls['billingAddress'].value;
    purchase.billingAddress = {
      ...billingAddress,
      state: billingAddress.state,
      country: billingAddress.country
    };



    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: data => {
        console.log("SUCCESS, tracking number:", data.orderTrackingNumber);
        this.resetCart();
      },
      error: err => {
        console.error("Checkout failed:", err);
        alert("There was an error placing your order. Please try again.");
      }
    });

  }
  

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.set(0);
    this.cartService.totalPrice.set(0);

    // reset the form
    this.checkoutForm.reset();

    // navifate to products page
    this.router.navigateByUrl("/products");

  }

  toggleBillingAddressForm(e: any) {
    const billingAddress = this.checkoutForm.get('billingAddress');
    const shippingAddress = this.checkoutForm.get('shippingAddress');

    if (e.target.checked) {
      // set the billing form value similar to shipping form value
      billingAddress?.setValue(shippingAddress?.value);
    } else {
      // reset the billing form but keep the country and state values to avoid unnecessary API calls to fetch states when the user checks the checkbox again
      billingAddress?.reset({
        country: billingAddress?.get('country')?.value,
        state: billingAddress?.get('state')?.value
      });
    }
    this.isSameAsShipping.set(!this.isSameAsShipping());
  }

  getCreditCardMonthsAndYears() {
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
    this.creditCardMonths = this.formService.getCrediCardMonths(startMonth);
  }

  onCountryChange(event: Event, target: 'shippingAddress' | 'billingAddress') {
    const country = (event.target as HTMLSelectElement).value;
    const states$ = this.formService.getStates(country);

    if (target === 'shippingAddress') {
      this.shippingAddressStates$ = states$;
    } else {
      this.billingAddressStates$ = states$;
    }

    // set the state input value to the first item of the states list, use take(1) to complete the observable after the first emission
    states$
      .pipe(take(1))
      .subscribe(states => {
        const stateControl = this.checkoutForm.get(`${target}.state`);
        if (stateControl) {
          stateControl.setValue(states[0]?.name || '');
        }
      });
  }

  get firstName() {
    return this.checkoutForm.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutForm.get('customer.lastName');
  }

  get email() {
    return this.checkoutForm.get('customer.email');
  }


  // SHIPPING FORM GETTER
  get shippingAddressCity() {
    return this.checkoutForm.get('shippingAddress.city');
  }

  get shippingAddressStreet() {
    return this.checkoutForm.get('shippingAddress.street');
  }

  get shippingAddressState() {
    return this.checkoutForm.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutForm.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutForm.get('shippingAddress.country');
  }


  // BILLING FORM GETTER
  get billingAddressCity() {
    return this.checkoutForm.get('billingAddress.city');
  }

  get billingAddressStreet() {
    return this.checkoutForm.get('billingAddress.street');
  }

  get billingAddressState() {
    return this.checkoutForm.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutForm.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutForm.get('billingAddress.country');
  }

  // CREDIT CARD FORM GETTER
  get creditCardCartType() {
    return this.checkoutForm.get('creditCard.cartType');
  }

  get creditCardNameOnCard() {
    return this.checkoutForm.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutForm.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutForm.get('creditCard.securityCode');
  }

  get creditCardExpirationMonth() {
    return this.checkoutForm.get('creditCard.expirationMonth');
  }

  get creditCardExpirationYear() {
    return this.checkoutForm.get('creditCard.expirationYear');
  }
}