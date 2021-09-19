import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public routerPath: Router
    ) { }

  ngOnInit(): void {  }

  goTo(menu: string){
    if (menu === "logIn") {
      sessionStorage.clear();
      this.routerPath.navigate([`/`])
    }
  }

}
