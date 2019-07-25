import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpHeaders } from '../../node_modules/@angular/common/http';
import { Company } from './company';


@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  users: User[] = [];
  userEmail: string;

  constructor(private httpClient: HttpClient) {
    this.userEmail = localStorage.getItem("loginUser");
  }

  /* Allows api call to fetch all registered users */
  getUsers() {
    return this.httpClient.get<any>('http://localhost:64610/api/User/getAllUsers', { responseType: 'json' });
  }

  /* Allows api call to fetch user details by email */
  getUser(userEmail: string) {
    return this.httpClient.get<any>('http://localhost:64610/api/User/getUserByEmail?userEmail=' + userEmail, { responseType: 'json' });
  }

  /* Allows api call to register a new user in database */
  addNewUser(payload: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/registerUser', payload, options);
  }

  /* Allows api call to login user in the application */
  login(payload: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/loginUser', payload, options);
  }

  /* Allows api call to send reset password email to requesting user */
  sendResetEmail(email: string): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/sendResetPasswordEmail?email=' + email, options);
  }

  /* Allows api call to send account activation email to recently registered user */
  sendAccountActivationEmail(email: string): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/sendActivateAccountEmail?email=' + email, options);
  }

  /* Allows api call to set isVerified flag in database and activate user account */
  activateAccount(email: string): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/activateAccount?email=' + email, options);
  }

  /* Allows api call to reset user password in database */
  changePassword(payload: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'rejectUnauthorized': 'false'
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Account/changePassword', payload, options);
  }

  /* Allows api call to register a new company in database */
  addCompany(payload: any, token: string): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.post('http://localhost:64610/api/Company/registerCompany', payload, options);
  }

  /* Allows api call to fetch all registered companies */
  getAllCompanies(token: string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };
    return this.httpClient.get<any>('http://localhost:64610/api/Company/getAllCompanies', options);
  }

  /* Allows api call to add/remove companies in user's favourite list */
  markUnmarkFavCompany(email: string, companyNames: Company[], token: string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };
    
    return this.httpClient.put('http://localhost:64610/api/Company/markUnmarkFavouriteCompany?loggedInUserEmail=' + email, JSON.stringify(companyNames), options);
  }

  /* Allows api call to fetch all user's favourite companies */
  getFavCompanies(email: string, token: string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };

    return this.httpClient.get<any>('http://localhost:64610/api/Company/getFavouriteCompanies?loggedInUserEmail=' + email, options);
  }
}
