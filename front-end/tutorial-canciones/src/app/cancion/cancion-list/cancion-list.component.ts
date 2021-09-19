import { Component, OnInit } from '@angular/core';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/usuario/usuario';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.scss']
})
export class CancionListComponent implements OnInit {

  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  userId: number
  token: string
  canciones: Array<Cancion>
  mostrarCanciones: Array<Cancion>
  cancionSeleccionada: Cancion
  indiceSeleccionado: number = 0
  applicationUsers : Usuario[]

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();
      this.getUsers()
    }
  }

  getCanciones():void{
    this.cancionService.getCanciones(this.token,this.userId)
    .subscribe(canciones => {
      this.canciones = canciones
      this.mostrarCanciones = canciones
    })
  }

  onSelect(cancion: Cancion, indice: number){
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}/${cancion.id}`])
    // this.indiceSeleccionado = indice
    // this.cancionSeleccionada = cancion
    // this.cancionService.getAlbumesCancion(cancion.id)
    // .subscribe(albumes => {
    //   this.cancionSeleccionada.albumes = albumes
    // },
    // error => {
    //   this.showError(`Ha ocurrido un error: ${error.message}`)
    // })
    
  }

  buscarCancion(busqueda: string){
    let cancionesBusqueda: Array<Cancion> = []
    this.canciones.map( cancion => {
      if(cancion.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())){
        cancionesBusqueda.push(cancion)
      }
    })
    this.mostrarCanciones = cancionesBusqueda
  }

  irCrearCancion(){
    this.routerPath.navigate([`/cancioness/create/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

  getUsers() {
    this.cancionService.getUsers(this.token).subscribe(users => {
      console.log(users)
    this.applicationUsers = users
    },error => {
      this.showError("Ha ocurrido un error, " + error.message)
    })
  }

  getCancionUser(id: number ): string{
    const user = this.applicationUsers.find(user => user.id === id)
    if(user)
    return user?.nombre
    else return ""
  }

}
