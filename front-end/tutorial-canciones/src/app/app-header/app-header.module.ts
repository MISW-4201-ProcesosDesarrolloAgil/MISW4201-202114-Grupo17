import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { UsuarioService } from '../usuario/usuario.service';


@NgModule({
  declarations: [ HeaderComponent],
  imports:[CommonModule],
  exports: [HeaderComponent],
  providers:[UsuarioService]
})
export class AppHeaderModule { }
