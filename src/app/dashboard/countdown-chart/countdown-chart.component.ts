import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js'
import { NumberValueAccessor } from '../../../../node_modules/@angular/forms/src/directives';
import { interval, Observable } from '../../../../node_modules/rxjs';
import { TimeSpan } from 'ng-timespan';

@Component({
  selector: 'event-countdown-chart',
  templateUrl: './countdown-chart.component.html',
  styleUrls: ['./countdown-chart.component.css']
})
export class CountdownChartComponent implements OnInit, AfterViewInit {
  @Input() endTime:string;

  // canvas
  @ViewChild('daysChart') public canvasDays: ElementRef;
  @ViewChild('hoursChart') public canvasHours: ElementRef;
  @ViewChild('minutesChart') public canvasMinutes: ElementRef;
  @ViewChild('secondsChart') public canvasSeconds: ElementRef;

  // labels
  eventDays:number;
  eventHours:number;
  eventMinutes:number;
  eventSeconds:number;

  //options
  chartOptions = { animation: { duration: 0 } }

  //
  eventStarted:boolean;

  ticker: Observable<number> = interval(500)

  constructor() { }

  updateDays(ts:TimeSpan)
  {
    let canvasEl: HTMLCanvasElement = this.canvasDays.nativeElement
    let context = canvasEl.getContext('2d')

    var completeCircle = 30;
    let daMath = Math.round(completeCircle + ts.days)

    var pieOptions = {
      animation: false
    };
    var chartData = {
      datasets: [{
          data: [ts.days + 1, daMath],
          backgroundColor:['#2F2F2F', '#00476A']
      }]
    };
    let chartDays = new Chart(canvasEl, {
      type: 'doughnut',
      data: chartData,
      options: this.chartOptions
    })
    this.eventDays = -(ts.days + 1)
  }

  updateHours(ts:TimeSpan)
  {
    let canvasEl: HTMLCanvasElement = this.canvasHours.nativeElement
    let context = canvasEl.getContext('2d')

    var completeCircle = 24;
    let daMath = Math.round(completeCircle + ts.hours)

    var pieOptions = {
      animation: false
    };
    var chartData = {
      datasets: [{
          data: [ts.hours + 1, daMath],
          backgroundColor:['#2F2F2F', '#00476A']
      }]
    };
    let chartHours = new Chart(canvasEl, {
      type: 'doughnut',
      data: chartData,
      options: this.chartOptions
    })
    this.eventHours = -(ts.hours + 1)
  }

  updateMinutes(ts:TimeSpan)
  {
    let canvasEl: HTMLCanvasElement = this.canvasMinutes.nativeElement
    let context = canvasEl.getContext('2d')

    var completeCircle = 60;
    let daMath = Math.round(completeCircle + ts.minutes)

    var pieOptions = {
      animation: false
    };
    var chartData = {
      datasets: [{
          data: [ts.minutes + 1, daMath],
          backgroundColor:['#2F2F2F', '#00476A']
      }]
    };
    let chartHours = new Chart(canvasEl, {
      type: 'doughnut',
      data: chartData,
      options: this.chartOptions
    })
    this.eventMinutes = -(ts.minutes + 1)
  }

  updateSeconds(ts:TimeSpan)
  {
    let canvasEl: HTMLCanvasElement = this.canvasSeconds.nativeElement
    let context = canvasEl.getContext('2d')

    var completeCircle = 60;
    let daMath = Math.round(completeCircle + ts.seconds)

    var pieOptions = {
      animation: false
    };
    var chartData = {
      datasets: [{
          data: [ts.seconds, daMath],
          backgroundColor:['#2F2F2F', '#00476A']
      }]
    };
    let chartHours = new Chart(canvasEl, {
      type: 'doughnut',
      data: chartData,
      options: this.chartOptions
    })
    this.eventSeconds = -ts.seconds
  }

  ngOnInit() {
    

  }

  ngAfterViewInit() {
    if (this.endTime) {
      this.ticker.subscribe(
        () => {
          // for every tick update the chart
          let dateNowMs = new Date().getTime()
          let expiresMs = new Date(this.endTime).getTime()
          
          let timespan = TimeSpan.Subtract(new Date().getTime(), new Date(this.endTime).getTime())
          // console.log(`Time till expiration: ${timespan.days} days, ${timespan.hours} hours, ${timespan.hours} minutes, ${timespan.seconds}`);
          
          this.updateDays(timespan)
          this.updateHours(timespan)
          this.updateMinutes(timespan)
          this.updateSeconds(timespan)
        }
      )
    }else{
      console.error("End time not passed to countdown widget. Countdown will not start.");
    }
  }

}
