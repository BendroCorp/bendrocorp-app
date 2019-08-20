import { interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class CheckForUpdateService {

  constructor(updates: SwUpdate) {
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
    } else {
      console.warn('Service worker not available - cannnot auto check for updates!');
    }

    // interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
  }
}