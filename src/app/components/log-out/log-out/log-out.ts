import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  imports: [],
  templateUrl: './log-out.html',
  styleUrl: './log-out.css',
})
export class LogOut {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  async ngOnInit() {
    this.authService.removeToken();
    const navSuccess = await this.router.navigate(['/']);
    console.log(navSuccess);
  }
}
