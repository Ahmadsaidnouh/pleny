import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: any;  
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService) { }
  ngOnInit(): void {
    this.auth.userData.subscribe(() => {
      if (this.auth.userData.getValue() != null) {
        this.isLoggedIn = true;
        this.user = this.auth.userData.getValue();
      }
      else {
        this.isLoggedIn = false;
      }
    })
  }

  logOut() {
    this.auth.logOut();
  }
}
