import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goTo(option: String): void {
    let userId = sessionStorage.UserId;
    let userToken = sessionStorage.UserToken;

    if (option === 'Albumes') {
      this.router.navigate([`/albumes/${userId}/${userToken}`])
    } else if (option === 'Canciones') {
      this.router.navigate([`/canciones/${userId}/${userToken}`])
    }
  }

}
