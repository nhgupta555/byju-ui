import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  user: User;
  users: User[] = [];

  constructor(private router: Router,private auth: AuthService,private services: ApplicationService) {
  }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  /* Checks whether the data entered in changePassword form is valid */
  validateUser(): boolean {
    this.user.email = this.user.email.trim();
    this.user.password = this.user.password.trim();

    if (this.user.email === undefined || this.user.email === "") {
      alert("Enter Email");
      return false;
    }
    else if (this.user.password === undefined || this.user.password === "") {
      alert("Enter Password");
      return false;
    }
    else {
      return true;
    }
  }

  /* Checks whether the requesting user is a registered user */
  checkValidUser(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase())) === "object") {
      this.services.changePassword(this.user).subscribe(
         data => {
           if(data.IsSuccess)
           {
             alert("Password Reset Successful. Please Login to Continue.");
             this.router.navigateByUrl("/login");
           }
           else
           {
             alert(data.Message);
           }

           this.changePasswordForm.reset();
         }
      );
    }
    else {
      alert("Not a Registered User. Your username or password is incorrect.");
      this.changePasswordForm.reset();
    }
  }

  /* Resets requesting user password in database */
  changePassword(): void {
    this.user = this.changePasswordForm.value;
    let isValid: boolean = this.validateUser();
    if (isValid) {
      let userArray: User[] = [];
      this.services.getUsers().subscribe(
        data => {
          userArray = data.ReturnValue;
          this.checkValidUser(userArray);
        });
    }
  }
}
