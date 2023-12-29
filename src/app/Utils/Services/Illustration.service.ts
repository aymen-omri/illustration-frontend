import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class IllustrationService {
    constructor(private http: HttpClient) { }

    apiUrl: string = "http://localhost:8080/api/v1/illustration";

    addIllustration(formData: FormData, id: number) {
        return this.http.post<any>(this.apiUrl + "/add/user/" + id, formData);
    }

    getAll() {
        return this.http.get(this.apiUrl + "/all");
    }

    getById(id: number) {
        return this.http.get(this.apiUrl + '/by-id/' + id);
    }

    addTranslation(formData: FormData, id_user: number, id_illus: number) {
        return this.http.post(this.apiUrl + "/add-with-new-language/" + id_illus + "/user/" + id_user, formData);
    }

    fetchImage(link: string): Observable<Blob> {
        return this.http.get(link, { responseType: 'blob' });
    }

    deleteIllus(id: number) {
        return this.http.delete(this.apiUrl + "/delete/" + id);
    }

}