import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { AppSidebarModule } from '../app-sidebar/app-sidebar.module';
import { AlbumJoinCancionComponent } from './album-join-cancion/album-join-cancion.component';
import { AlbumShareComponent } from './album-share/album-share.component';


@NgModule({
  declarations: [AlbumListComponent, AlbumDetailComponent, AlbumCreateComponent, AlbumEditComponent, AlbumJoinCancionComponent, AlbumShareComponent],
  imports: [
    CommonModule, ReactiveFormsModule, AppHeaderModule, AppSidebarModule
  ],
  exports:[AlbumListComponent, AlbumDetailComponent, AlbumCreateComponent, AlbumEditComponent, AlbumJoinCancionComponent, AlbumShareComponent]
})
export class AlbumModule { }
