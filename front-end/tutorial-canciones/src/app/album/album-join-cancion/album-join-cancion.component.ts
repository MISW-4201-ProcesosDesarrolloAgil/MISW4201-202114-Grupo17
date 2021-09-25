import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from 'src/app/cancion/cancion';
import { CancionService } from 'src/app/cancion/cancion.service';
import { Album} from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-join-cancion',
  templateUrl: './album-join-cancion.component.html',
  styleUrls: ['./album-join-cancion.component.scss']
})
export class AlbumJoinCancionComponent implements OnInit {

  userId: number;
  token: string;
  albumId: number;
  album: Album;
  albumCancionForm !: FormGroup;
  canciones: Array<Cancion>

  constructor(
    private albumService: AlbumService,
    private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.albumId = this.router.snapshot.params.albumId
      this.albumService.getAlbum(this.albumId, this.userId, this.token)
      .subscribe(album => {
        this.album = album
        this.albumCancionForm = this.formBuilder.group({
          tituloAlbum: [album.titulo, [Validators.required]],
          idCancion: ["", [Validators.required]],
          tituloCancion: ["", [Validators.required]]
        })
        this.getCanciones(album.canciones)
      })
    }
  }

  getCanciones(cancionesAlbum: Array<any>){
    let cancionesNoAgregadas: Array<Cancion> = []
    this.cancionService.getCanciones(this.token,this.userId)
    .subscribe(canciones => {
      canciones.map(c => {
        if(!cancionesAlbum.includes(c.id) && c.usuario === this.userId){
          cancionesNoAgregadas.push(c)
        }
      })
    })
    this.canciones = cancionesNoAgregadas
  }

  cancelarAsociacion(){
    this.albumCancionForm.reset()
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${this.albumId}`])
  }

  asociarCancion(){
    this.albumService.asociarCancion(this.albumId, this.albumCancionForm.get('idCancion')?.value,this.userId,this.token)
    .subscribe(cancion => {
      this.showSuccess(this.albumCancionForm.get('tituloAlbum')?.value, cancion.titulo)
      this.albumCancionForm.reset()
      this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${this.albumId}`])
    },
    (error:HttpErrorResponse)=> {
      if(error.status === 401 && error.error.mensaje)
      {
        this.showWarning(error.error.mensaje)
      }
      else if(error.status === 401)
      {
        this.showWarning('No tiene permisos para realizar esta acción')
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
      this.routerPath.navigate([`albumes/${this.userId}/${this.token}/${this.albumId}`])
    })
  }

  onSelect(albumId: any){
    this.albumCancionForm.get('idCancion')?.setValue(albumId)
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showWarning(error:string)
  {
    this.toastr.warning(error,'Problema de autorización')
  }

  showSuccess(tituloAlbum: string, tituloCancion: string) {
    this.toastr.success(`La canción ${tituloCancion} se agregó al album ${tituloAlbum}`, "Asociación exitosa");
  }

}
