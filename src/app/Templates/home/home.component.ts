import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  constructor(private userService: UserService) { }

  isLoggedIn: boolean = false;

}
