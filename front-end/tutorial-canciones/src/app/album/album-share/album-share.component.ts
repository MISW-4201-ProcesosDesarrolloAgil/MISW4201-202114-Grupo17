import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.css']
})
export class AlbumShareComponent implements OnInit {

  @Input() usuarioscompartidos:Array<number>
  @Output() openModal= new EventEmitter
  @Output() quitShare = new EventEmitter
  constructor() { }

  ngOnInit(): void {
    this.abrirModal()
  }

  terminarcompartir():void
  {
    this.quitShare.emit()
  }

  abrirModal()
  {
    this.openModal.emit()
  }

}
