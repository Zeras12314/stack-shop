import { Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FormService {
    creditCardMonths = signal<number[]>([]);
    creditCardYears = signal<number[]>([]);

    constructor() { }

    getCrediCardMonths(startMonth: number): number[] {
        const months: number[] = [];
        for (let i = startMonth; i <= 12; i++) {
            months.push(i);
        }
        this.creditCardMonths.set(months);
        return this.creditCardMonths();
    }

    getCreditCardYears(): number[] {
        const startYear = new Date().getFullYear();
        for (let i = startYear; i < startYear + 10; i++) {
            this.creditCardYears.update(years => [...years, i]);
        }
        return this.creditCardYears();
    }
}
