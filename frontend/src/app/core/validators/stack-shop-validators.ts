import { FormControl, ValidationErrors } from "@angular/forms";

export class StackShopValidators {
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        if (control.value != null && control.value.trim().length === 0) {
            // invalid, only whitespace return error object
            return { 'notOnlyWhitespace': true };
        } else {

            // valid, return null
            return null;
        }
    }
}