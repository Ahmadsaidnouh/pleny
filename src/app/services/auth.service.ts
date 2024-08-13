import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData = new BehaviorSubject(null);

  private apiUrl = 'https://dummyjson.com/auth/login';

  constructor(private http:HttpClient, private _Router:Router) {
    if(localStorage.getItem("userData") != null) {
      this.saveUserData()
    }
  }


  login(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password,
      expiresInMins: 30
    };
    return this.http.post(this.apiUrl, body);
  }

  saveUserData() {
    let user = JSON.parse(localStorage.getItem("userData")!);
    console.log("user = "+ user);
    this.userData.next(user);
  }

  logOut() {
    localStorage.removeItem("userData")
    this.userData.next(null);
    this._Router.navigate(["login"]);
  }
}
