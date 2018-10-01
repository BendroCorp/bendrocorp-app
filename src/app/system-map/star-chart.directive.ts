import { Directive, TemplateRef, ViewContainerRef, Input, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Network } from 'vis';

@Directive({
  selector: '[appStarChartVis]'
})
export class GraphVisDirective implements OnInit {
  network;

  constructor(private el: ElementRef) {}
  @ViewChild('netWords') netContainer: ElementRef;
  @Input() set appStarChartVis(graphData){
    console.log('graph data ', graphData);
    var options = {};

    if(!this.network){
      this.network = new Network(this.el.nativeElement, graphData, options);
    }

  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}