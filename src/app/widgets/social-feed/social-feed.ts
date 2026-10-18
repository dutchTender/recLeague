import { Component, OnInit } from '@angular/core';
import { WidgetContent, WidgetToken } from '../../common/model/model';

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
  actionType: string = '';
  widgetName: string = '';

  executeAction(): void {
    console.log('widget action executed.')
  }

  ngOnInit(): void {
  }
}
