import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor() { }

    private errorMessage = new BehaviorSubject<string>("");
    public errorMessageObservable = this.errorMessage.asObservable();

    updateErrorMessage(msg: string) {
        this.errorMessage.next(msg);
    }
}