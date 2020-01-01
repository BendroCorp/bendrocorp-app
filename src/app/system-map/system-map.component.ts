import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { SystemMapService } from './system-map.service';
import { AuthService } from '../auth.service';
import { StarSystem } from '../models/system-map-models';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataSet, Network } from 'vis';
import { Subscription } from 'rxjs';
import { Jurisdiction } from '../models/law.model';

@Component({
  selector: 'app-system-map',
  templateUrl: './system-map.component.html',
  styleUrls: ['./system-map.component.css']
})
// https://stackoverflow.com/questions/40296821/how-to-make-vis-js-lib-to-work-with-angular2
// https://stackoverflow.com/questions/49299774/how-to-limit-zooming-of-a-vis-js-network
// view-source:http://visjs.org/examples/network/nodeStyles/circularImages.html
// http://jsbin.com/qeyumiwepo/5/edit?html,output
// view-source:http://visjs.org/examples/network/nodeStyles/groups.html - groups
// https://stackoverflow.com/questions/38974896/call-child-component-method-from-parent-class-angular
export class SystemMapComponent implements OnInit, OnDestroy {
  
  systemMapViewSelection: number;
  selectedStarSystem: any;

  constructor(private systemMapService: SystemMapService, private authService: AuthService) {}

  setViewSelection(event) {
    console.log(event.target.defaultValue);
    this.systemMapService.setViewSelection(parseInt(event.target.defaultValue));
  }
  
  ngOnInit() {
    this.systemMapViewSelection = this.systemMapService.fetchViewSelection();
  }  
  
  ngOnDestroy() {
  }

  
 

}
