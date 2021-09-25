import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Album } from 'src/app/album/album';
import { AlbumService } from 'src/app/album/album.service';
import { Usuario } from 'src/app/usuario/usuario';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';

declare var $: any;

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrls: ['./cancion-detail.component.scss']
})
export class CancionDetailComponent implements OnInit {

  cancion: Cancion;
  cancionId:number;
  userId: number;
  token: string;
  shareCancionOn:boolean
  applicationUsers: Usuario[]
  albumesCancion: Album[]
  finishLoad:boolean

  constructor(
    private ar: ActivatedRoute,
    private routerPath: Router,
    private cs: CancionService,
    private router: Router,
    private toastr: ToastrService,
    private as: AlbumService
  ) {
    this.shareCancionOn = false
  }

  indiceSeleccionado: number


  ngOnInit() {
    this.albumesCancion=[]
    this.finishLoad=false
    this.userId = parseInt(this.ar.snapshot.params.userId)
    this.token = this.ar.snapshot.params.userToken
    this.cancionId = this.ar.snapshot.params.cancionId
    this.getCancion()
    this.getUsers()

  }

  eliminarCancion(){
    this.cs.eliminarCancion(this.cancionId,this.userId,this.token).subscribe(()=>
    {
      this.toastr.success(`Se elimino correctamente la canción ${this.cancion.titulo}`)
      this.router.navigate([`/canciones/${this.userId}/${this.token}`])
    },(error:HttpErrorResponse)=>
    {
      if( error.status == 401 && error.error.mensaje)
      {
        this.toastr.warning(error.error.mensaje)
      }
      else if(error.status == 401)
      {
        this.toastr.warning('No está autorizado')
      }
      else{
        this.toastr.error('Upss.... algo salio mal. Vuelve a intentarlo mas tarde')
      }
      
    }
    )
  }

  goToEdit(){
    this.routerPath.navigate([`/canciones/edit/${this.cancion.id}/${this.userId}/${this.token}`])
  }

  goBack()
  {
    this.router.navigate([`/canciones/${this.userId}/${this.token}`])
  }

  getCancion()
  {
    this.cs.getCancion(this.cancionId,this.userId,this.token).subscribe(cancion=>
      {
        this.cancion = cancion
        this.obtenerInstanciasAlbum()
        this.shareCancionOn=false
      },
      (error:HttpErrorResponse)=>
      {
        if(error.status == 404)
        {
          this.toastr.warning('El album no existe')
          this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
        }
        else if(error.status == 401)
        {
          if (error.error.mensaje){
            this.toastr.warning(error.error.mensaje)
            this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
          }
          else{
            this.toastr.warning('No tiene permiso para realizar ésta acción')
            this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
          }

        }
      }
      )
  }

  obtenerInstanciasAlbum()
  {
    this.as.getAlbumes(this.userId,this.token).subscribe(albums=>
      {
        albums.forEach(album=>
          {
            if(this.cancion.albumes.includes(album.id))
            {
              this.albumesCancion.push(album)
            }
          })
        this.finishLoad = true
      })
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }
  getUsers()
  {
    this.cs.getUsers(this.token).subscribe(users=>
      {
        this.applicationUsers = users
      },error => {
        this.showError("Ha ocurrido un error, " + error.message)
      })
  }

  changeShareCancion()
  {
    this.shareCancionOn = !this.shareCancionOn
  }

  reloadComponent()
  {
    $('#myModal').modal('hide')
    this.shareCancionOn = !this.shareCancionOn
    this.ngOnInit()
  }

  startModal()
  {
    $('#myModal').modal('show')
  }

  getSongUser(id: number ): string{
    const user = this.applicationUsers.find(user => user.id === id)
    if(user)
    return user?.nombre
    else return ""
  }
}
