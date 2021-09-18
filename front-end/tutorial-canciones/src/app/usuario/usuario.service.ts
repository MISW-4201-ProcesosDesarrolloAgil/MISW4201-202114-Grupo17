import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class UsuarioService {

    private backUrl: string = environment.baseUrl;

    constructor(private http: HttpClient) { }

    userLogIn(nombre: string, contrasena: string):Observable<any>{
        return this.http.post<any>(`${this.backUrl}/logIn`, {"nombre": nombre, "contrasena": contrasena });
    }

    userSignUp(nombre: string, contrasena: string): Observable<any>{
        return this.http.post<any>(`${this.backUrl}/signIn`, {"nombre": nombre, "contrasena": contrasena})
    }

    userLogOut(token:string,userid:string):Observable<any>
    {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          })
        return this.http.post<any>(`${this.backUrl}/usuario/${userid}/logOut`,{},{headers:headers})
    }
}
