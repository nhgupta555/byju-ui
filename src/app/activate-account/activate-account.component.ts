import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import {  Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

  activateForm: FormGroup;
  user: User;

  constructor(private router: Router,private auth: AuthService,private services: ApplicationService) { }

  ngOnInit() {
    this.activateForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  /* Checks the data entered in activateForm is valid */
  validateEmail(): boolean {
    this.user.email = this.user.email.trim();
    if (this.user.email === undefined || this.user.email === "") {
      alert("Enter Email");
      return false;
    }
    else {
      return true;
    }
  }

  /* Checks the email for account activation is registered in database */
  checkValidEmail(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase())) === "object") {
      this.services.sendAccountActivationEmail(this.user.email).subscribe(
         data => {
           if(data.IsSuccess)
           {
             alert("The Account Activation Link has been emailed to you. Please check your mail to activate your account.");
           }
           else
           {
             alert(data.Message);
           }

           this.activateForm.reset();
         }
      );
    }
    else {
      alert("Not a Registered User. Please enter a valid registered email.");
      this.activateForm.reset();
    }
  }

  /* Sends email verification mail for account activation for recently registered user */
  sendAccountActivationEmail(): void {
    this.user = this.activateForm.value;
    let isValid: boolean = this.validateEmail();
    if (isValid) {
      let userArray: User[] = [];
      this.services.getUsers().subscribe(
        data => {
          userArray = data.ReturnValue;
          this.checkValidEmail(userArray);
        });
    }
  }
}
