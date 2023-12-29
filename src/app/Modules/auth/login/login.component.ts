import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Utils/Services/Shared.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userService: UserService, private share: SharedService) { }

  myForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  errMessage: string = '';

  onSubmit() {
    if (this.myForm.valid) {
      this.userService.login(this.myForm.value).subscribe({
        next: (res: any) => {
          this.userService.storeToken(res.jwt);
          window.location.replace("/account/profile")
        },
        error: () => {
          this.share.errorMessageObservable.subscribe(msg => {
            this.errMessage = msg
            console.log(msg);
          });
        }
      });
    } else {
      if (this.myForm.get('password')?.hasError('minlength')) {
        this.errMessage = "Password must be at least 8 characters long.";
      }else{
        this.errMessage = "Please fill out all fields.";
      }
    }
  }
}
