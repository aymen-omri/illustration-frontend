import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Utils/Services/Shared.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  constructor(private userService: UserService, private share: SharedService) { }

  myForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  errMessage: string = '';

  onSubmit() {
    if (this.myForm.valid) {
      this.userService.register(this.myForm.value).subscribe({
        next: () => {
          window.location.replace("/auth/login");
        },
        error: () => {
          this.share.errorMessageObservable.subscribe(msg => {
            this.errMessage = msg
            console.log(msg);
          });
        }
      });
    } else {
      if (this.myForm.get('email')?.hasError('email')) {
        this.errMessage = "Please enter a valid Email address";
      } else if (this.myForm.get('password')?.hasError('minlength')) {
        this.errMessage = "Password must be at least 8 characters long.";
      } else {
        this.errMessage = "All fields are required";
      }
    }
  }


}
