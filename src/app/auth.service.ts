import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }

  sendToken(token: string) {
    localStorage.setItem("loginToken", token)
  }

  getToken() {
    return localStorage.getItem("loginToken")
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
  
  logout() {
    localStorage.removeItem("loginToken");
    this.myRoute.navigate(["/login"]);
  }
}
