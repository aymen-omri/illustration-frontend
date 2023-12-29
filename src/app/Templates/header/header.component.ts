import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.role = this.userService.decodeJwtToken().payload.scope;
  }

  constructor(private userService: UserService) { }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isLoggedIn: boolean = false;
  role : string = "" ;

  logout() {
    this.userService.logout();
    location.reload();
  }


}
