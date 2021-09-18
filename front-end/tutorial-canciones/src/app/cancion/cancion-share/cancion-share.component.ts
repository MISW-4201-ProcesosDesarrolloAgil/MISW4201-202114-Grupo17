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

  ngOnInit() {

  }

  terminarcompartir(){

  }
  compartirUsuarios(){

  }
  selectUser(i:number):void{

  }

}
