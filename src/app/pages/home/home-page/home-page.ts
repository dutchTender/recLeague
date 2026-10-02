import { Component, input, Signal } from '@angular/core';
import { UserHome } from '../../../components/user-home/user-home';
import { AdminHome } from '../../../components/admin-home/admin-home';

@Component({
  selector: 'app-home-page',
  imports: [UserHome, AdminHome],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  isAdmin: Signal<boolean> = input(false);
}
