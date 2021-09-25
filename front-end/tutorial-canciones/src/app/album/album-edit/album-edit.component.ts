import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Album, Medio } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.scss'],
})
export class AlbumEditComponent implements OnInit {
  albumInstance:Album;
  userId: number;
  token: string;
  albumId: number;
  albumForm!: FormGroup;
  medios: Array<Medio> = [
    {
      llave: 'DISCO',
      valor: 1,
    },
    {
      llave: 'CASETE',
      valor: 2,
    },
    {
      llave: 'CD',
      valor: 3,
    },
  ];

  constructor(
    private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) {}

  ngOnInit() {
    if (
      !parseInt(this.router.snapshot.params.userId) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.albumService
        .getAlbum(
          this.router.snapshot.params.albumId,
          this.router.snapshot.params.userId,
          this.router.snapshot.params.userToken
        )
        .subscribe((album) => {
          this.albumId = album.id;
          this.albumInstance = album;
          this.albumForm = this.formBuilder.group({
            titulo: [
              album.titulo,
              [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(128),
              ],
            ],
            anio: [
              album.anio,
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(4),
              ],
            ],
            descripcion: [
              album.descripcion,
              [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(512),
              ],
            ],
            medio: [album.medio.llave, [Validators.required]],
          });
        });
      this.userId = parseInt(this.router.snapshot.params.userId);
      this.token = this.router.snapshot.params.userToken;
    }
  }

  cancelCreate() {
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${this.albumInstance.id}`]);
  }

  editarAlbum() {
    this.albumInstance.titulo = this.albumForm.get('titulo')?.value
    this.albumInstance.anio = parseInt(this.albumForm.get('anio')?.value)
    this.albumInstance.descripcion = this.albumForm.get('descripcion')?.value
    this.albumInstance.medio = this.albumForm.get('medio')?.value;
    this.albumService
      .editarAlbum(this.userId, this.token, this.albumId, this.albumInstance)
      .subscribe(
        (album) => {
          this.showSuccess(album);
          this.albumForm.reset();
          this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${this.albumId}`]);
        },
        (error) => {
          if (error.statusText === 'UNAUTHORIZED') {
            if(error.error.mensaje)
            {
              this.showWarning(
                error.error.mensaje
              );
            }
          else{
            this.showWarning(
              'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
            );
          }
          } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
            this.showError(
              'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
            );
          } else {
            this.showError('Ha ocurrido un error. ' + error.message);
          }
          this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${this.albumId}`])
        }
      );
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  showSuccess(album: Album) {
    this.toastr.success(
      `El album ${album.titulo} fue editado`,
      'Edición exitosa'
    );
  }
}
