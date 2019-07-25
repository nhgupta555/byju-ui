import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

  verifyForm: FormGroup;
  user: User;
  users: User[] = [];

  constructor(private router: Router,private auth: AuthService,private services: ApplicationService) {
  }

  ngOnInit() {
    this.verifyForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  /* Checks whether data entered in verifyForm is valid */
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

  /* Checks whether user verifying their account is a valid registered user */
  checkValidUser(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase() && d.Password.toLocaleLowerCase() === this.user.password.toLocaleLowerCase())) === "object") {
     
      this.services.activateAccount(this.user.email).subscribe(
        data => {
          if(data.IsSuccess)
          {
           alert("Your Account is verified Successfully. Please Login to Continue.");
           this.router.navigate(["login"]);
          }
          else{
            alert(data.Message);
            this.verifyForm.reset;
          }
        }
    );  
    }
    else {
      alert("Not a Registered User. Please enter a valid registered user.");
      this.verifyForm.reset();
    }
  }

  /* Allows user to activate their account by verifying their email */
  verifyAccount(): void {
    this.user = this.verifyForm.value;
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
