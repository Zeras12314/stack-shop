import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor() { }


    getProductImage(imageData: string) {
        // We tell the browser this string is an image/png
        return `data:image/png;base64,${imageData}`;
    }
}