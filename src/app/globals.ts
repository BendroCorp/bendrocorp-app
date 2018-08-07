// globals.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Globals {
  baseUrlRoot: string = (environment.production) ? 'https://api.bendrocorp.com/' : 'http://localhost:3000/';
  baseUrl: string = this.baseUrlRoot + 'api/';  
}