import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../User';
import { ApplicationService } from '../application.service';
import { HttpClient, HttpErrorResponse } from 'node_modules/@angular/common/http';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signupForm : FormGroup;
  user: User;
  confirmPassword: string;
  frmData = new FormData();

  constructor(private httpService: HttpClient, private services: ApplicationService, private router: Router, private http: HttpClient) {
    this.user = new User();
  }
   
  ngOnInit()
  {
    this.signupForm = new FormGroup({
     'username' : new FormControl(null, Validators.required),
     'email' : new FormControl(null,[Validators.required,Validators.email]),
     'password': new FormControl(null,Validators.required),
    });
  }

  /* Checks whether data entered in signupForm is valid */
  validateData(): boolean {
    this.user.username = this.user.username.trim();
    this.user.email = this.user.email.trim();
    this.user.password = this.user.password.trim();
    if (this.user.username === undefined || this.user.username === "") {
      alert("Enter User Name");
      return false;
    }
    if (this.user.email === undefined || this.user.email === "") {
      alert("Enter User Email");
      return false;
    }
    else if (this.user.password === undefined || this.user.password === "") {
      alert("Enter User Password");
      return false;
    }
    else {
      return true;
    }
  }

  /* Checks whether the registering user is already registered in database or not */
  validateRegisteredUser(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase())) === "object") {
      alert("Already Registered User.");
    }
    else {
      this.services.addNewUser(this.user).subscribe(
        data => {
          if(data.IsSuccess)
          {
            alert("User Registration Successful.");
            this.signupForm.reset();
            this.router.navigateByUrl("/login");
          }
          else
          {
            alert(data.Message);
          }
          
        },
        (err: HttpErrorResponse) => {
          console.log (err.message);    
        }
      );
     
    }
  }

  /* Allows a new user to register into the application */
  register(): void {
    this.user = this.signupForm.value;
    let isValid: boolean = this.validateData();
    if (isValid) {
      let userArray: User[] = [];
      this.services.getUsers().subscribe(
        data => {
            userArray = data.ReturnValue;
            this.validateRegisteredUser(userArray);
        });
    }
  }
}
