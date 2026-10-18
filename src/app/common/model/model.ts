import { InjectionToken } from '@angular/core';

export interface  APIResponse {
status?: number;
data?: any;
message?: string;
metaData?: MetaData;

}

export interface MetaData {
  stats: string;
  uri: string;
}

export interface User{
  email: string;
  userName: string;
  roles: string[];
}

export interface JwtClaims {
  sub: string;
  scope: string; // Could be a space-separated string "read write" or an array depending on your auth server
  [key: string]: any;
}


export interface WidgetContent {
     widgetName: string;
     actionType: string;
     executeAction() : void;
}

export const WidgetToken = new InjectionToken<WidgetContent>('Widget-Content');


