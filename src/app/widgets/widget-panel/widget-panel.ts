import { Component, signal, WritableSignal } from '@angular/core';
import { WidgetContent } from '../../common/model/model';
import { WidgetToken } from '../../common/model/InjectionToken';

@Component({
  selector: 'app-widget-panel',
  imports: [],
  providers:[
    {
      provide: WidgetToken, useExisting:WidgetPanel
    }
  ],
  templateUrl: './widget-panel.html',
  styleUrl: './widget-panel.css',
})
export class WidgetPanel implements WidgetContent{
  actionType = signal<string>('Add');
  widgetName = signal<string>('Widget Panel');

  executeAction(): void {
  }

}
