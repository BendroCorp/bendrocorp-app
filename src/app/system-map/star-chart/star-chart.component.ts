import { Directive, TemplateRef, ViewContainerRef, Input, Renderer2, ElementRef, ViewChild, OnInit, Component } from '@angular/core';
import { Network } from 'vis';

@Component({
  selector: 'star-chart',
  templateUrl: './star-chart.component.html',
  styleUrls: ['./star-chart.component.css']
})
export class StarChartComponent implements OnInit {
  graphData
  @ViewChild('starChart', { static: true }) netContainer: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
