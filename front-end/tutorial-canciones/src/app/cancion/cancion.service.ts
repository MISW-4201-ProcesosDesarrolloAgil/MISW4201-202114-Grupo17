import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Cancion } from './cancion';
import { Album } from '../album/album';
import { Usuario } from '../usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class CancionService {

  private backUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCancionesAlbum(idAlbum: number, token: string, userId:number): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/usuario/${userId}/album/${idAlbum}/canciones`, {headers: headers})
  }
  getAlbumes(token: string, userId: number): Observable<Album[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Album[]>(`${this.backUrl}/usuario/${userId}/albumes`, {headers: headers})
  }
  getCanciones(token:string, userId:number): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/usuario/${userId}/canciones`,{headers:headers})
  }

  getAlbumesCancion(cancionId: number,userId:number,token:string): Observable<Album[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Album[]>(`${this.backUrl}/usuario/${userId}/cancion/${cancionId}/albumes`,{headers:headers})
  }

  crearCancion(cancion: Cancion,userId:number,token:string):Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cancion>(`${this.backUrl}/usuario/${userId}/canciones`, cancion, {headers:headers})
  }

  getCancion(cancionId: number,userId:number,token:string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion>(`${this.backUrl}/usuario/${userId}/cancion/${cancionId}`,{headers:headers})
  }

  editarCancion(cancion: Cancion, cancionId: number,userId:number,token:string):Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Cancion>(`${this.backUrl}/usuario/${userId}/cancion/${cancionId}`, cancion, {headers:headers})
  }

  eliminarCancion(cancionId: number,userId:number,token:string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Cancion>(`${this.backUrl}/usuario/${userId}/cancion/${cancionId}`,{headers:headers})
  }

  getUsers( token: string): Observable<Usuario[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Usuario[]>(`${this.backUrl}/usuarios`, {headers: headers})
  }

  compartirCancion(idUsuario: number, token: string, cancionId: number, usuarios_compartidos: Array<number>): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    const usuarios_compartidosjson=
    {
      "usuarioscompartidos":usuarios_compartidos
    }
    return this.http.put<any>(`${this.backUrl}/usuario/${idUsuario}/cancion/${cancionId}`, usuarios_compartidosjson, {headers: headers})
  }
}
