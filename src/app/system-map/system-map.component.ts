import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { SystemMapService } from './system-map.service';
import { AuthService } from '../auth.service';
import { StarSystem } from '../models/system-map-models';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataSet, Network } from 'vis';
import { Subscription } from 'rxjs';

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
export class SystemMapComponent implements OnInit, AfterContentInit, OnDestroy {
  
  @ViewChild('starChart') netContainer: ElementRef;
  network:Network
  isEditor:boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true :false
  dataLoaded:boolean = false
  starSystems:StarSystem[]
  selectedStarSystem:StarSystem
  selectedStarSystemItem:any
  selectedObjectKind:string
  subscription:Subscription

  constructor(private systemMapService:SystemMapService, private authService:AuthService, private spinnerService:SpinnerService) { 
    this.subscription = this.systemMapService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchSystems()
      }
    )    
  }

  fetchSystems()
  {
    this.spinnerService.spin(true)
    this.systemMapService.list().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.spinnerService.spin(false)
          this.starSystems = results

          // If first load then fetch and reload the chart
          if (!this.dataLoaded) {
            this.dataLoaded = true
            this.allSystems()
          }
        }
      }
    )
  }

  allSystems()
  {
    if (this.starSystems) {
      // clear selected system
      this.selectedStarSystem = null
      this.selectedStarSystemItem = null
      this.selectedObjectKind = null

      // create an array with nodes
      let nodeArray = []
      let edgesArray = []

      for (let index = 0; index < this.starSystems.length; index++) {
        const starSystem = this.starSystems[index];
        // shape: 'icon',
        // let basicIcon = {
        //   face: 'icomoon',
        //   code: '\e609',
        //   size: 50,
        //   color: '#58bbd4'
        // } uf1ad
        // f185
        // icon: {
        //   face: 'systemmap',
        //   code: '\ue606',
        //   size: 50,
        //   color: '#58bbd4'
        // }
        nodeArray.push(
          {
            id: starSystem.id, 
            label: starSystem.title, 
            shape: 'circle',
            color: '#58bbd4'
          })

        // interate through jump points
        for (let index = 0; index < starSystem.jump_points.length; index++) {
          const jp = starSystem.jump_points[index];
          edgesArray.push({from: starSystem.id, to: jp.id, dashes:true})
        }
      }

      // assign nodes to a dataset
      var nodes = new DataSet(nodeArray);

      // create an array with edges
      var edges = new DataSet(edgesArray);

      // provide the data in the vis format
      let data = {
        nodes: nodes,
        edges: edges
      };

      var options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 32,
                color: '#ffffff'
            },
            borderWidth: 2,
            fixed: {
              y: true,
              x: true
          }
        },
        edges: {
            width: 2
        },
        layout: {    
          improvedLayout: true
        },
        physics: {
          enabled: false
        },
        interaction: {
          zoomView: false,
          dragNodes:false,
          dragView: false
        }
      };

      // render
      this.renderMap(data, options)
    }
  }

  private renderMap(dataSet, options = {})
  {
    var container = document.getElementById('star-map');
    // var options = {};
    this.network = new Network(this.netContainer.nativeElement, dataSet, options);
    let self = this;

    // setup the listener
    this.network.on('select', function(params) {
      if (params && params.nodes && params.nodes[0] && !this.selectedStarSystem) {
        // console output to debug
        console.log(params.nodes[0])

        if (params.nodes[0] && /^(gw|p|m|so)-([0-9])$/.test(params.nodes[0])) {
          let matches = /^(gw|p|m|so)-([0-9])$/.exec(params.nodes[0])
          console.log(matches)
          // if we have selected a system 
          self.matchItem(matches[1], parseInt(matches[2]))
        } else {
          // if we have not selected a system then we select one
          self.selectSystem(params.nodes[0])
        }        
      }
    });
  }

  /**
   * Match the item and show the display view
   * @param objectKind gw or p or m or so
   * @param objectId The Id of the object
   */
  private matchItem(objectKind:string, objectId:number)
  {
    if (this.selectedStarSystem) {
      // add the object kind
      this.selectedObjectKind = objectKind

      // pass the item to the display item
      // this does not totally make sense....we need a way to show the right bit of details
      if (objectKind === "gw") { //gravity well
        this.selectedStarSystemItem = this.selectedStarSystem.gravity_wells.find(x => x.id === objectId)
      }else if (objectKind === "p") { // planet
        this.selectedStarSystemItem = this.selectedStarSystem.planets.find(x => x.id === objectId)
      }else if (objectKind === "m") { // moon
        for (let index = 0; index < this.selectedStarSystem.planets.length; index++) {
          const planet = this.selectedStarSystem.planets[index];
          this.selectedStarSystemItem = planet.moons.find(x => x.id === objectId)
          if (this.selectedStarSystemItem) {
            console.log(this.selectedStarSystemItem)              
            return
          }
        }
        
        
      }else if (objectKind === "so") { // system object
        this.selectedStarSystemItem = this.selectedStarSystem.system_objects.find(x => x.id === objectId)
        if (this.selectedStarSystemItem) {
          console.log(this.selectedStarSystemItem)              
          return
        }

        for (let index = 0; index < this.selectedStarSystem.planets.length; index++) {
          const planet = this.selectedStarSystem.planets[index];
          this.selectedStarSystemItem = planet.system_objects.find(x => x.id === objectId)
          if (this.selectedStarSystemItem) {
            console.log(this.selectedStarSystemItem)              
            return
          }

          for (let index = 0; index < planet.moons.length; index++) {
            const moon = planet.moons[index];
            this.selectedStarSystemItem = moon.system_objects.find(x => x.id === objectId)
            if (this.selectedStarSystemItem) {
              console.log(this.selectedStarSystemItem)              
              return
            }
          }
        }
      }else{
        console.error("objectKind argument out of range!")
      }
    } else {
      console.error("")      
    }
  }

  deselectItem()
  {
    this.selectedStarSystemItem = null
    this.selectedObjectKind = null
  }

  selectSystem(systemId:number)
  {
    // cancel the listener
    // this.network.off('select', null)

    // once we select a system we need to re-render the map to show the star system
    let selected = this.starSystems.find(x => x.id === systemId)
    console.log(`You clicked on ${selected.title}`);
    this.selectedStarSystem = selected
    
    // 
    if (this.selectedStarSystem && this.selectedStarSystem.id) {
      // define some arrays to build out
      let nodeArray = []
      let edgesArray = []

      // first group is the star(s)
      for (let index = 0; index < this.selectedStarSystem.gravity_wells.length; index++) {
        const gravity_well = this.selectedStarSystem.gravity_wells[index];
        nodeArray.push(
          {
            id: `gw-${gravity_well.id}`, 
            label: `${gravity_well.title} (Star)`, 
            group: `gw-${gravity_well.id}`, 
            shape: 'circle',
            color: '#58bbd4',
            size: 40,
          }
        )

        // system level system objects
        for (let indexSo = 0; indexSo < this.selectedStarSystem.system_objects.length; indexSo++) {
          const system_object = this.selectedStarSystem.system_objects[indexSo];
          nodeArray.push(
            {
              id: `so-${system_object.id}`, 
              label: `${system_object.title} (System Object <Type>)`, 
              group: `gw-${gravity_well.id}`, 
              shape: 'dot',
            }
          )
          edgesArray.push({from: `gw-${gravity_well.id}`, to: `so-${system_object.id}`})
        }

        for (let indexP = 0; indexP < this.selectedStarSystem.planets.length; indexP++) {
          const planet = this.selectedStarSystem.planets[indexP];
          nodeArray.push(
            {
              id: `p-${planet.id}`, 
              label: `${planet.title} (Planet)`, 
              group: `gw-${gravity_well.id}`, 
              shape: 'dot',
              color: '#58bbd4',
              size: 10
            }
          )
          // push an edge line
          edgesArray.push({from: `gw-${gravity_well.id}`, to: `p-${planet.id}`})

          // next do each planets moons
          for (let index = 0; index < planet.moons.length; index++) {
            const moon = planet.moons[index];
            nodeArray.push(
              {
                id: `m-${moon.id}`, 
                label: `${moon.title} (Moon)`, 
                group: `p-${planet.id}`, 
                shape: 'dot',
                color: '#58bbd4',
                size: 10
              }
            )
            // push an edge line
            edgesArray.push({from: `p-${planet.id}`, to: `m-${moon.id}`})

            // Do each moons system objects
            for (let indexSo = 0; indexSo < moon.system_objects.length; indexSo++) {
              const system_object = moon.system_objects[indexSo];
              nodeArray.push(
                {
                  id: `so-${system_object.id}`, 
                  label: `${system_object.title} (System Object <Type>)`, 
                  group: `m-${moon.id}`, 
                  shape: 'dot',
                }
              )
              edgesArray.push({from: `m-${moon.id}`, to: `so-${system_object.id}`})
            }
          }

          // Do each planets system objects
          for (let indexSo = 0; indexSo < planet.system_objects.length; indexSo++) {
            const system_object = planet.system_objects[indexSo];
            nodeArray.push(
              {
                id: `so-${system_object.id}`, 
                label: `${system_object.title} (System Object <Type>)`, 
                group: `p-${planet.id}`, 
                shape: 'dot',
              }
            )
            edgesArray.push({from: `p-${planet.id}`, to: `so-${system_object.id}`})
          }
        }
      }

      // format and send things to render

      // assign nodes to a dataset
      var nodes = new DataSet(nodeArray);

      // create an array with edges
      var edges = new DataSet(edgesArray);

      // provide the data in the vis format
      let data = {
        nodes: nodes,
        edges: edges
      };

      var options = {
        nodes: {
            shape: 'circle',
            font: {
                size: 24,
                color: '#ffffff'
            },
            borderWidth: 4,
            fixed: {
              y: true,
              x: true
            }
        },
        edges: {
            width: 10
        },
        layout: {    
          improvedLayout: true
        },
        physics: {
          enabled: false
        },
        interaction: {
          zoomView: false,
          dragNodes:false,
          dragView: false
        }        
      };

      // render
      this.renderMap(data)

    }

  }

  ngAfterContentInit()
  {
    this.fetchSystems()
  }

  ngOnInit() {
    this.spinnerService.spin(true)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
