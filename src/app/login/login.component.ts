import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;
  users: User[] = [];

  constructor(private router: Router,private auth: AuthService,private services: ApplicationService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  /* Checks whether the data entered in loginForm is valid */
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

  /* Checks whether user requesting to login is a valid registered user */
  checkValidUser(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase() && d.Password.toLocaleLowerCase() === this.user.password.toLocaleLowerCase())) === "object") {
      this.services.login(this.user).subscribe(
         data => {
           if(data.IsSuccess)
           {
            localStorage.setItem("loginUser", this.user.email);
            localStorage.setItem("loginToken", data.AuthToken);
            this.services.getUser(this.user.email).subscribe(
              data => {
                if(data.IsSuccess)
                {
                  this.loginForm.reset();
                  this.users = data.ReturnValue;
                  this.router.navigateByUrl("/company");
                }
                else
                {
                   alert(data.Message);
                   this.loginForm.reset();
                }               
              }
            );
           }
           else
           {
             alert(data.Message);
             this.loginForm.reset();
           }
         }
      );
    }
    else {
      alert("Not a Registered User. Please register yourself before login.");
      this.loginForm.reset();
      this.router.navigate(["register"]);
    }
  }

  /* Helps register user to login into the application */
  login(): void {
    this.user = this.loginForm.value;
    let isValid: boolean = this.validateUser();
    if (isValid) {
      let userArray: User[] = [];
      this.services.getUsers().subscribe(
        data => {
          userArray = data.ReturnValue;
          console.log(userArray);
          this.checkValidUser(userArray);
        });
    }
  }

  /* Redirects user to user registration page */
  register() {
    this.router.navigateByUrl("/register");
  }
}
  
