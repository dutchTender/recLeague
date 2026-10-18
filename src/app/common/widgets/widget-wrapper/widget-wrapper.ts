import { Component, contentChild,OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner} from '@angular/material/progress-spinner';
import { WidgetToken } from '../../model/model';

@Component({
  selector: 'app-widget-wrapper',
  imports: [MatButtonModule, MatProgressSpinner],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
})
export class WidgetWrapper implements OnInit{

  protected isLoading = signal<boolean>(false);
  widgetContent = contentChild(WidgetToken);
  ngOnInit(): void {
  }

  async asyncWidgetActionHandler(){
     this.widgetContent()?.executeAction();
  }

}
