import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Buffer } from 'buffer';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    userUrl: string = "http://localhost:8080/api/v1/user";

    public register(request: any) {
        return this.http.post<any>(this.userUrl + "/auth/register", request);
    }
    public login(request: any) {
        return this.http.post<any>(this.userUrl + "/auth/login", request);
    }
    public storeToken(jwt: string) {
        localStorage.setItem('auth', jwt);
    }

    public logout() {
        localStorage.removeItem("auth");
    }

    public isLoggedIn() {
        return localStorage.getItem('auth') ? true : false;
    }

    decodeJwtToken() {
        let token = localStorage.getItem("auth")!;
        const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
        const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString());
        const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString());
        const signature = Buffer.from(signatureEncoded, 'base64');
        return { header, payload, signature }
    }

    extractUsername() {
        return this.decodeJwtToken().payload.sub;
    }

    sendToken(email: string) {
        const params = new HttpParams().set('email', email);
        return this.http.post(this.userUrl + "/auth/send-token", params);
    }

    verifToken(obj: any) {
        return this.http.post(this.userUrl + "/auth/verify-token", obj);
    }

    changePassword(obj: any) {
        return this.http.post(this.userUrl + "/auth/reset-password", obj);
    }

    getByUsername(username: string) {
        return this.http.get(this.userUrl + "/username/" + username);
    }

    updateUser(user: any, username: string) {
        return this.http.put(this.userUrl + "/" + username, user)
    }

    getAll() {
        return this.http.get(this.userUrl + "/all");
    }

    enableDisable(id : number){
        return this.http.post(this.userUrl+"/enable-disable/"+ id ,{});
    }


}