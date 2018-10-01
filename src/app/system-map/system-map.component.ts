import { Component, OnInit } from '@angular/core';
import { SystemMapService } from './system-map.service';
import { AuthService } from '../auth.service';
import { StarSystem } from '../models/system-map-models';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Network, DataSet } from 'vis';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-system-map',
  templateUrl: './system-map.component.html',
  styleUrls: ['./system-map.component.css']
})
// https://stackoverflow.com/questions/40296821/how-to-make-vis-js-lib-to-work-with-angular2
export class SystemMapComponent implements OnInit {
  graphData = {};
  isEditor:boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true :false
  dataLoaded:boolean = false
  starSystems:StarSystem[]

  constructor(private systemMapService:SystemMapService, private authService:AuthService, private spinnerService:SpinnerService) { }

  fetchSystems()
  {
    this.spinnerService.spin(true)
    this.systemMapService.list().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.spinnerService.spin(false)
          if (!this.dataLoaded) {
            this.dataLoaded = true
            // this.allSystems()
          }
        }
      }
    )
  }

  allSystems()
  {
    if (this.starSystems) {
      // create an array with nodes
      let nodeArray = []
      let edgesArray = []

      for (let index = 0; index < this.starSystems.length; index++) {
        const starSystem = this.starSystems[index];
        nodeArray.push({id: starSystem.id, label: starSystem.title})

        // interate through jump points
        for (let index = 0; index < starSystem.jump_points.length; index++) {
          const jp = starSystem.jump_points[index];
          edgesArray.push({from: starSystem.id, to: jp.id})
        }
      }

      var nodes = new DataSet(nodeArray);

      // create an array with edges
      var edges = new DataSet(edgesArray);

      // provide the data in the vis format
      this.graphData["nodes"] = nodes;
      this.graphData["edges"] = edges;
    }
  }

  selectSystem()
  {

  }

  ngAfterContentInit()
  {
    this.fetchSystems()
  }

  ngOnInit() {
    this.spinnerService.spin(true)
  }

}
