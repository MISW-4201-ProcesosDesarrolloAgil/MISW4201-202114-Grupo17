import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Album} from './album';
import { Cancion } from '../cancion/cancion';
import { Usuario } from '../usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private backUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAlbumes(usuario: number, token: string): Observable<Album[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Album[]>(`${this.backUrl}/usuario/${usuario}/albumes`, {headers: headers})
  }

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/album/${idAlbum}/canciones`, {headers: headers})
  }

  crearAlbum(idUsuario: number, token: string, album: Album):Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/usuario/${idUsuario}/albumes`, album, {headers: headers})
  }

  getAlbum(albumId: number, userId: number, token: string): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`       
    })
    return this.http.get<Album>(`${this.backUrl}/usuario/${userId}/album/${albumId}`,{headers: headers})
  }

  editarAlbum(idUsuario: number, token: string, albumId: number, album: Album): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Album>(`${this.backUrl}/usuario/${idUsuario}/album/${albumId}`, album, {headers: headers})
  }

  eliminarAlbum(idUsuario: number, token: string, albumId: number): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Album>(`${this.backUrl}/usuario/${idUsuario}/album/${albumId}`, {headers: headers})
  }

  asociarCancion(albumId: number, cancionId: number,userId:number,token:string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cancion>(`${this.backUrl}/usuario/${userId}/album/${albumId}/canciones`, {"id_cancion": cancionId},{headers:headers})
  }

  getUsers( token: string): Observable<Usuario[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`       
    })
    return this.http.get<Usuario[]>(`${this.backUrl}/usuarios`, {headers: headers})
  }

  compartirAlbum(idUsuario: number, token: string, albumId: number, usuarioscompartidos: Array<number>): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    const usuarioscompartidosjson=
    {
      "usuarioscompartidos":usuarioscompartidos
    }
    return this.http.put<any>(`${this.backUrl}/usuario/${idUsuario}/album/${albumId}`, usuarioscompartidosjson, {headers: headers})
  }

}
