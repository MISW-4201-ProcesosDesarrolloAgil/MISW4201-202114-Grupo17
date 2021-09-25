import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlbumService } from '../album.service';
import { Usuario } from '../../usuario/usuario';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Album} from '../album';
import { Cancion } from 'src/app/cancion/cancion';
import { CancionService } from 'src/app/cancion/cancion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.scss']
})
export class AlbumShareComponent implements OnInit {

  usuarios:Array<Usuario>
  selectedUsers:Array<number>
  albumId:string
  sharedRemove:Array<number>
  sharedAdded:Array<number>
  subscriptions:Array<Subscription>
  booleanFinishSubscription:Array<boolean>

  @Input() usuarioscompartidos:Array<number>
  @Input() token: string
  @Input() logUserId:number
  @Input() albumInstance:Album
  @Input() cancionesAlbum:Cancion[]
  @Output() openModal= new EventEmitter
  @Output() quitShare = new EventEmitter

  constructor(private as:AlbumService,private cs:CancionService, private ar:ActivatedRoute, private toastr:ToastrService) {
    this.selectedUsers=[]
    this.sharedRemove = []
    this.sharedAdded = []
    this.subscriptions = []
    this.booleanFinishSubscription = []
    this.albumId = ar.snapshot.params.albumId
  }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }

  terminarcompartir():void
  {
    this.subscriptions.forEach(sub=>
      {
        sub.unsubscribe()
      })
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

  compartirUsuariosCanciones()
  {
    const albumIdInt = parseInt(this.albumId)
    this.albumInstance.usuarioscompartidos.forEach(usuario=>
      {
        if(!this.selectedUsers.includes(usuario))
        {
          this.sharedRemove.push(usuario)
        }
      })
    this.selectedUsers.forEach(usuario =>
      {
        if(!this.albumInstance.usuarioscompartidos.includes(usuario))
        {
          this.sharedAdded.push(usuario)
        }
      })
    
    this.cancionesAlbum.forEach(cancion=>
      {
        let usuariosShared = cancion.usuarios_compartidos
        this.sharedRemove.forEach(user=>
          {
            if (usuariosShared.includes(user))
            {
              const indexUser = usuariosShared.findIndex((usuario)=>usuario ===user)
              usuariosShared.splice(indexUser,1)
            }
          })
        this.sharedAdded.forEach(user=>
          {
            if(!usuariosShared.includes(user))
            {
              usuariosShared.push(user)
            }
          })
        this.subscriptions.push(this.cs.compartirCancion(this.logUserId,this.token,cancion.id,usuariosShared).subscribe(()=>
        {
          this.booleanFinishSubscription.push(true)
          if (this.booleanFinishSubscription.length === this.cancionesAlbum.length)
          {
            this.terminarcompartir()
          }
        }))
      })
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
          this.compartirUsuariosCanciones()
          this.toastr.success('Se compartio correctamente con los usuarios seleccionados.')       
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
