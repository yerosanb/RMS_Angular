import { Component } from '@angular/core'
import { Route, Router } from '@angular/router'
import { AuthService } from '../services/auth-service.service'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  authService: AuthService
  constructor(private router: Router, authService: AuthService) {
    this.authService = authService
  }

  goToPage(pageName: string) {
    // alert("gotopage");
    this.router.navigate([`${pageName}`])
  }
  logout() {
    this.authService.logout()
  }
}
