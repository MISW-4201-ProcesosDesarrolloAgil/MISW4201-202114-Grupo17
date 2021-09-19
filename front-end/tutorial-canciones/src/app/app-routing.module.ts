import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioLoginComponent } from './usuario/usuario-login/usuario-login.component';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { AlbumCreateComponent } from './album/album-create/album-create.component';
import { AlbumEditComponent } from './album/album-edit/album-edit.component';
import { CancionListComponent } from './cancion/cancion-list/cancion-list.component';
import { CancionCreateComponent } from './cancion/cancion-create/cancion-create.component';
import { CancionEditComponent } from './cancion/cancion-edit/cancion-edit.component';
import { AlbumJoinCancionComponent } from './album/album-join-cancion/album-join-cancion.component';
import { UsuarioSignupComponent } from './usuario/usuario-signup/usuario-signup.component';
import { AlbumDetailComponent } from './album/album-detail/album-detail.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlocktokenGuard } from './blocktoken.guard';
import { CancionDetailComponent } from './cancion/cancion-detail/cancion-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioLoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: UsuarioLoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: UsuarioSignupComponent,
    pathMatch: 'full'
  },
  {
    path: 'albumes/:userId/:userToken',
    component: AlbumListComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'albumes/create/:userId/:userToken',
    component: AlbumCreateComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'albumes/:userId/:userToken/:albumId',
    component: AlbumDetailComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'albumes/edit/:albumId/:userId/:userToken',
    component: AlbumEditComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'albumes/join/:albumId/:userId/:userToken',
    component: AlbumJoinCancionComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'canciones/:userId/:userToken',
    component: CancionListComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'canciones/:userId/:userToken/:cancionId',
    component: CancionDetailComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'cancioness/create/:userId/:userToken',
    component: CancionCreateComponent,
    canActivate:[BlocktokenGuard]
  },
  {
    path: 'canciones/edit/:cancionId/:userId/:userToken',
    component: CancionEditComponent,
    canActivate:[BlocktokenGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
