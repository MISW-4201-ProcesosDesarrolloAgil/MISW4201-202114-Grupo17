import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AlbumService } from './album/album.service';

@Injectable({
  providedIn: 'root'
})
export class BlocktokenGuard implements CanActivate {
  constructor(private as:AlbumService,private router:Router,private toast:ToastrService)
  {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userId = sessionStorage.UserId;
      let userToken = sessionStorage.UserToken;
      let prom:Promise<boolean>  = new Promise((resolve,reject)=>
      {
        this.as.getUsers(userToken).subscribe(()=>
        {
          resolve(true)
        },()=>
        {
          this.toast.error('No tiene permisos para realizar ésta acción')
          this.router.navigate(['/'])
          reject(false)
        })
      })
      return prom
    }
  
}
