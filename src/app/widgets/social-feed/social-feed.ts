import { Component, OnInit, signal } from '@angular/core';
import { WidgetToken } from '../../common/model/InjectionToken';
import { WidgetContent } from '../../common/model/model';


@Component({
  selector: 'app-social-feed',
  imports: [],
  providers:[
    {
      provide: WidgetToken, useExisting: SocialFeed
    }
  ],
  templateUrl: './social-feed.html',
  styleUrl: './social-feed.css',
})
export class SocialFeed implements WidgetContent, OnInit{
  actionType = signal<string>('Post')
  widgetName = signal<string>('Social Activity Feed')

  executeAction(): void {
    console.log('widget action executed.')
  }

  ngOnInit(): void {
  }
}
