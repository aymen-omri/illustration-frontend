import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Utils/Services/Shared.service';
import { UserService } from 'src/app/Utils/Services/User.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {


  constructor(private userService: UserService, private share: SharedService) { }


  showEmailForm: boolean = true;
  showVerifyForm: boolean = false;
  showResetForm: boolean = false;
  errMessage: string = "";
  userEmail: string = "";
  tokenText: string = "";
  hideButton: boolean = false;
  showSpinner: boolean = false;

  loading() {
      this.hideButton = true;
      this.showSpinner = true;
  }

  closeLoading() {
      this.hideButton = false;
      this.showSpinner = false;
  }

  hideMessage() {
      setTimeout(() => {
          this.errMessage = '';
      }, 4000);
  }

  EmailForm = new FormGroup({
      email: new FormControl('', Validators.required)
  });

  verifyForm = new FormGroup({
      token: new FormControl('', Validators.required)
  });

  resetForm = new FormGroup({
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required])
  });

  submitEmailForm() {
      this.loading();
      if (this.EmailForm.valid) {
          this.userService.sendToken(this.EmailForm.value.email!).subscribe({
              next: (data) => {
                  console.log(data);
                  this.showEmailForm = false;
                  this.showVerifyForm = true;
                  this.userEmail = this.EmailForm.value.email!;
                  this.closeLoading();
              },
              error: (err) => {
                  this.share.errorMessageObservable.subscribe(value => {
                      this.errMessage = value;
                      this.closeLoading();
                      this.hideMessage();
                  });
              },
              complete: () => {
                  console.log("Complete!");
                  this.closeLoading();
                  this.hideMessage();
              }
          })
      } else {
        this.closeLoading();
          this.errMessage = "You didn't fill a required field";
      }
  }

  submitVerifyForm() {
      this.loading();
      if (this.verifyForm.valid) {
          this.userService.verifToken({ email: this.userEmail, token: this.verifyForm.value.token }).subscribe({
              next: (value) => {
                  this.closeLoading();
                  console.log(value);
                  this.showVerifyForm = false;
                  this.showResetForm = true;
                  this.tokenText = this.verifyForm.value.token!;
              },
              error: (err) => {
                  this.share.errorMessageObservable.subscribe(value => {
                      this.errMessage = value;
                      this.closeLoading();
                      this.hideMessage();
                  });
              },
              complete: () => {
                  console.log("Complete!");
              }
          });
      } else {
          this.closeLoading();
          this.hideMessage();
          this.errMessage = "You didn't fill a required field";
      }
  }

  submitResetForm() {
      this.loading();
      if (this.resetForm.valid) {
          this.userService.changePassword(
              {
                  email: this.userEmail,
                  token: this.tokenText,
                  newPassword: this.resetForm.value.password,
                  confirmPassword: this.resetForm.value.confirmPassword
              }).subscribe({
                  next: (value) => {
                      console.log(value);
                      window.location.replace("/auth/login");
                  },
                  error: (err) => {
                      this.share.errorMessageObservable.subscribe(value => {
                          this.errMessage = value;
                          this.closeLoading();
                          this.hideMessage();
                      });
                  },
                  complete: () => {
                      console.log("complete")
                  }
              });
      } else {
          this.closeLoading();
          this.hideMessage();
          this.errMessage = "You didn't fill a required field";
      }

  }


}
