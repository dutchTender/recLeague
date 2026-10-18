import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../common/model/model';
import { AuthService } from '../../auth/service/AuthService';
import { SocialFeed } from '../../widgets/social-feed/social-feed';

@Component({
  selector: 'app-user-home',
  imports: [RouterLink, SocialFeed],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
  private readonly authService = inject(AuthService);
  protected currentUser: Signal<User | null> = this.authService.currentUser;
}
