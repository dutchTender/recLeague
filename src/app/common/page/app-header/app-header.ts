import { Component, inject, Signal } from '@angular/core';
import { AuthService } from '../../../auth/service/AuthService';
import { User } from '../../model/model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  private readonly authService = inject(AuthService);
  protected currentUser: Signal<User | null> = this.authService.currentUser;
}
