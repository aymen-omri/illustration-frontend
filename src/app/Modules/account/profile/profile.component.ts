import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Utils/Services/Shared.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ngOnInit(): void {
    this.getUser();
  }

  constructor(private userService: UserService, private fb: FormBuilder, private share: SharedService) { }

  user: any;
  errMessage: string = "";
  myForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  getUser() {
    this.userService.getByUsername(this.userService.extractUsername()).subscribe((data: any) => {
      this.user = data;
      this.patchValues();
    });
  }

  patchValues() {
    this.myForm.patchValue({
      fullName: this.user.fullName,
      birthDate: this.user.birthDate,
      username: this.user.username,
      email: this.user.email,
    });
  }

  updateUser() {
    if (this.myForm.valid) {
      this.userService.updateUser(this.myForm.value, this.userService.extractUsername()).subscribe({
        next: () => {
          alert("Updated successfully!");
          this.errMessage = "";
          this.getUser();
        },
        error: () => {
          this.share.errorMessageObservable.subscribe(msg => this.errMessage = msg);
        }
      });
    } else {
      if (this.myForm.get("email")?.hasError('email')) {
        this.errMessage = "Invalid e-mail address.";
      } else if (this.myForm.get('password')?.hasError('minlength')) {
        this.errMessage = "Password must be at least 8 characters long.";
      } else {
        this.errMessage = "Please check the fields.";
      }
    }
  }

}
