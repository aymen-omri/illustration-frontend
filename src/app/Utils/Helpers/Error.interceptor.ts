import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../Services/Shared.service';
import { UserService } from '../Services/User.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private share: SharedService, private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !err.error || err.error.error == "Authentication failed") {
                // auto logout if 401 response returned from api
                this.userService.logout();
                location.reload();
            }
            var error = err.error;
            console.log(err);
            this.share.updateErrorMessage(error);
            return throwError(() => {
                return new Error();
            });
        }));
    }
}

export const errorInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];

