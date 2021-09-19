import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AppSidebarModule } from '../app-sidebar/app-sidebar.module';


@NgModule({
  declarations: [ HeaderComponent],
  imports:[CommonModule, AppSidebarModule],
  exports: [HeaderComponent]
})
export class AppHeaderModule { }
