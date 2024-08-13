import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  wrongLogin = false;
  loginForm: FormGroup = this.fb.group({});  // Initialize with an empty FormGroup

  constructor(private fb: FormBuilder, private _Router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.wrongLogin = false;

      let loginBtn = document.querySelector(".login-btn") as HTMLButtonElement;
      loginBtn.innerHTML = "Signing in...";
      loginBtn.disabled = true;

      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(response => {
        console.log('Login successful', response);
        // Handle successful login, e.g., redirect or store token
        this.loginForm.reset();

        localStorage.setItem("userData", JSON.stringify(response));
        this.authService.saveUserData();
        this._Router.navigate(['home'])
        
        loginBtn.innerHTML = "Sign in";
        loginBtn.disabled = false;
      }, error => {
        console.log('Login failed', error);
        this.wrongLogin = true;
        // Handle login failure
        loginBtn.innerHTML = "Sign in";
        loginBtn.disabled = false;
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
