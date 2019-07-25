import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from '../application.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  user: User;

  constructor(private router: Router,private auth: AuthService,private services: ApplicationService) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  /* Checks whether data entered in resetForm is valid */
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

  /* Checks whether user requesting for reset password is a registered user or not */
  checkValidEmail(userArray: any) {
    if (typeof userArray.find((d => d.Email.toLocaleLowerCase() === this.user.email.toLocaleLowerCase())) === "object") {
      this.services.sendResetEmail(this.user.email).subscribe(
         data => {
           if(data.IsSuccess)
           {
            alert("The Reset Password Link has been emailed to you. Please check your mail to reset your password.");
           }
           else
           {
             alert(data.Message);
           }

           this.resetForm.reset();
         }
      );
    }
    else {
      alert("Not a Registered User. Please enter a valid registered email.");
      this.resetForm.reset();
    }
  }

  /* Sends the reset password email to requesting user */
  sendResetEmail(): void {
    this.user = this.resetForm.value;
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
