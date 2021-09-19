import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AppSidebarModule } from '../app-sidebar/app-sidebar.module';
import { UsuarioService } from '../usuario/usuario.service';


@NgModule({
  declarations: [ HeaderComponent],
  imports:[CommonModule, AppSidebarModule],
  exports: [HeaderComponent],
  providers:[UsuarioService]
})
export class AppHeaderModule { }
