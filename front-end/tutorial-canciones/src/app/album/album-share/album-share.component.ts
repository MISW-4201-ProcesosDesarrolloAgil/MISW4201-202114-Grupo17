import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlbumService } from '../album.service';
import { Usuario } from '../../usuario/usuario';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.scss']
})
export class AlbumShareComponent implements OnInit {

  usuarios:Array<Usuario>
  selectedUsers:Array<number>
  albumId:string

  @Input() usuarioscompartidos:Array<number>
  @Input() token: string
  @Input() logUserId:number
  @Output() openModal= new EventEmitter
  @Output() quitShare = new EventEmitter

  constructor(private as:AlbumService, private ar:ActivatedRoute, private toastr:ToastrService) {
    this.selectedUsers=[]
    this.albumId = ar.snapshot.params.albumId
  }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }

  terminarcompartir():void
  {
    this.quitShare.emit()
  }

  abrirModal()
  {
    this.openModal.emit()
  }

  obtenerUsuarios()
  {
    this.as.getUsers(this.token).subscribe(usuariosApp=>
      {
        this.usuarios = usuariosApp
        this.usuarioscompartidos.forEach(us=>
          {
            this.selectedUsers.push(us)
          })
        this.abrirModal()
      })
  }

  selectUser(i:number):void
  {
    if(this.selectedUsers.includes(this.usuarios[i].id))
    {
      const selectIndex = this.selectedUsers.indexOf(this.usuarios[i].id)
      this.selectedUsers.splice(selectIndex,1)
    }
    else{
      this.selectedUsers.push(this.usuarios[i].id)
    }
  }

  compartirUsuarios()
  {
    const albumIdInt = parseInt(this.albumId)
    this.as.compartirAlbum(
      this.logUserId,
      this.token,
      albumIdInt,
      this.selectedUsers
      ).subscribe(album=>
        {
          this.toastr.success('Se compartio correctamente con los usuarios seleccionados.')
          this.terminarcompartir()
        
      },
      (error:HttpErrorResponse)=>
      {
        if(error.status === 401 && error.error.mensaje)
        {
          this.toastr.warning(error.error.mensaje)
        }
        else if(error.status === 401)
        {
          this.toastr.warning('No tiene permisos para realizar ésta acción')
        }
        else{
          this.toastr.error('Upsss.... algo salio mal. Vuelve a intentarlo mas adelante')
        }
        this.terminarcompartir()
      }
      )
  }

}
