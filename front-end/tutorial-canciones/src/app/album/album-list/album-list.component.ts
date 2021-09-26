import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from 'rxjs';
import { Cancion } from 'src/app/cancion/cancion';
import { Usuario } from 'src/app/usuario/usuario';
import { Album, Medio } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  helper = new JwtHelperService();

  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }
  
  userId: number
  token: string
  albumes: Array<Album>
  mostrarAlbumes: Array<Album>
  albumSeleccionado: Album
  indiceSeleccionado: number
  applicationUsers: Usuario[]
  

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getAlbumes();
      this.getUsers()
      this.albumes
    }
  }

  enumAsString(enumVariable: Medio): string {
    return enumVariable.llave as unknown as string
  }

  getAlbumes():void{
    this.albumService.getAlbumes(this.userId, this.token)
    .subscribe(albumes => {
      this.albumes = albumes
      this.mostrarAlbumes = albumes
     /*  if(albumes.length>0){
        this.onSelect(this.mostrarAlbumes[0], 0)
      } */
    },
    error => {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
    
  }

  onSelect(a: Album, index: number){
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${a.id}`])
  }

  getInterpretes(canciones: Array<Cancion>): Array<string>{
    var interpretes: Array<string> = []
    canciones.map( c => {
      if(!interpretes.includes(c.interprete)){
        interpretes.push(c.interprete)
      }
    })
    return interpretes
  }

  buscarAlbum(busqueda: string){
    let albumesBusqueda: Array<Album> = []
    this.albumes.map( albu => {
      if( albu.titulo.toLocaleLowerCase().includes(busqueda.toLowerCase())){
        albumesBusqueda.push(albu)
      }
    })
    this.mostrarAlbumes = albumesBusqueda
  }

  irCrearAlbum(){
    this.routerPath.navigate([`/albumes/create/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }

  getUsers() {
    this.albumService.getUsers(this.token).subscribe(users => {
    this.applicationUsers = users
    },error => {
      this.showError("Ha ocurrido un error, " + error.message)
    })
  }

  getAlbumUser(id: number ): string{
    const user = this.applicationUsers.find(user => user.id === id)
    if(user)
    return user?.nombre
    else return ""
  }
}
