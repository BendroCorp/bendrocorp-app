import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'system-rating-panel',
  templateUrl: './system-rating-panel.component.html',
  styleUrls: ['./system-rating-panel.component.css']
})
export class SystemRatingPanelComponent {
  @Input() atmosphericHeight:number
  @Input() criminalRating:number
  @Input() economicRating:number
  @Input() populationDensity:number

  finalHeight:number
  constructor() { }

  forTimes(n: number): any[] {
    return Array(n);
  }

  toKm(n:number)
  {
    return Math.round(n / 1000)
  }

}
