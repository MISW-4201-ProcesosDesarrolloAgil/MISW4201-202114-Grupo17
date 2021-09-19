import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CancionService } from '../cancion.service';
import { Usuario } from '../../usuario/usuario';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancion-share',
  templateUrl: './cancion-share.component.html',
  styleUrls: ['./cancion-share.component.scss']
})
export class CancionShareComponent implements OnInit {

  usuarios:Array<Usuario>
  selectedUsers:Array<number>
  cancionId:string

  @Input() usuarioscompartidos:Array<number>
  @Input() token: string
  @Input() logUserId:number
  @Output() openModal= new EventEmitter
  @Output() quitShare = new EventEmitter

  constructor(private cs: CancionService, private cr: ActivatedRoute, private toastr:ToastrService) {
    this.selectedUsers=[]
    this.cancionId = cr.snapshot.params.cancionId
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
    this.cs.getUsers(this.token).subscribe(usuariosApp=>
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
    const albumIdInt = parseInt(this.cancionId)
    this.cs.compartirCancion(
      this.logUserId,
      this.token,
      albumIdInt,
      this.selectedUsers
      ).subscribe(cancion=>
        {
          this.toastr.success('Se compartio correctamente con los usuarios seleccionados.')
          this.terminarcompartir()

      },
      error=>
      {
        this.toastr.error('Upsss.... algo salio mal. Vuelve a intentarlo mas adelante')
      }
      )
  }
}
