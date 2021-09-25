import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public routerPath: Router,
    private us: UsuarioService
    ) { }

  ngOnInit(): void {  }

  goTo(menu: string){
    if (menu === "logIn") {
      this.us.userLogOut(sessionStorage.UserToken,sessionStorage.UserId).subscribe(()=>
      {
        sessionStorage.clear();
        this.routerPath.navigate([`/`])
      },(e)=>
      {
      })
    }
  }

}
