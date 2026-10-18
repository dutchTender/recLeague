import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-widget-wrapper',
  imports: [MatButtonModule, MatProgressSpinner],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
})
export class WidgetWrapper {
  protected title = input<string>('');
  protected action = input<string>('')
  protected isLoading = signal<boolean>(false);


  async asyncWidgetActionHandler(){

  }
}
