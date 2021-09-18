import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private routerPath: Router,
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
        console.log(e)
      })
    }
  }

}
