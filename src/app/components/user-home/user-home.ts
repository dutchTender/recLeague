import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../model/model';
import { AuthService } from '../../auth/service/AuthService';

@Component({
  selector: 'app-user-home',
  imports: [RouterLink],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
  private readonly authService  = inject(AuthService);
}
