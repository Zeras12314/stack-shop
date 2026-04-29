import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { map, Observable } from "rxjs";
import { Country } from "../../common/country";
import { State } from "../../common/state";


interface CountryResponse {
    _embedded: {
        countries: Country[];
    };
}

interface StateResponse {
    _embedded: {
        states: State[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private countriesUrl = "http://localhost:8080/api/countries";
    private statesUrl = "http://localhost:8080/api/states";
    http = inject(HttpClient);

    constructor() { }

    getCountries(): Observable<Country[]> {
        return this.http.get<CountryResponse>(this.countriesUrl).pipe(
            map(({ _embedded }) => _embedded.countries)
        );
    }

    getStates(countryCode): Observable<State[]> {
        const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
        return this.http.get<StateResponse>(searchUrl).pipe(
            map(({ _embedded }) => _embedded.states)
        );
    }

    getCrediCardMonths(startMonth: number): number[] {
        const months: number[] = [];
        for (let i = startMonth; i <= 12; i++) {
            months.push(i);
        }
        return months;
    }

    getCreditCardYears(): number[] {
        const years: number[] = [];
        const startYear = new Date().getFullYear();
        for (let i = startYear; i < startYear + 10; i++) {
            years.push(i);
        }
        return years;
    }
}
