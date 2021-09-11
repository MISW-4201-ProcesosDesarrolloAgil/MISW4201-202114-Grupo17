import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  
  userId: number;
  token: string;
  albumId: number;
  album: Album;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private albumService: AlbumService,
    private toastr: ToastrService,
  ) { }

  indiceSeleccionado: number

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
    this.albumId = parseInt(this.router.snapshot.params.albumId)
    this.albumService.getAlbum(this.albumId,this.userId,this.token).subscribe(album => {
      this.album = album
      console.log(album)
    })
  }

  goToEdit(){
    this.routerPath.navigate([`/albumes/edit/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToJoinCancion(){
    this.routerPath.navigate([`/albumes/join/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToShareAlbum(){
    //Logica para arbir modal o ir a vista
    console.log('Agregar Lógica')
  }

  onSelect(a: Album, index: number){
    console.log(a,index)
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${a.id}`])
  }

  goToCommentsAlbum(){
    console.log('Logic to go to comments')
  }

  goToCommentsCancion(){
    console.log('Logic to go to comments')
  }

  goToDeleteSong(){
    console.log('Logic to delete Song')
  }

  eliminarAlbum(){
    this.albumService.eliminarAlbum(this.userId, this.token, this.album.id)
    .subscribe(album => {
      this.ngOnInit();
      this.showSuccess();
    },
    error=> {
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
    this.ngOnInit()
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

}
