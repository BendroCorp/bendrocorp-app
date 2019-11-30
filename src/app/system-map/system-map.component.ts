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
export class SystemMapComponent implements OnInit, AfterContentInit, OnDestroy {
  
  @ViewChild('starChart', { static: true }) netContainer: ElementRef;
  network: Network;
  isEditor: boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true :false;
  dataLoaded: boolean = false;
  starSystems: StarSystem[];
  selectedStarSystem: StarSystem;
  selectedStarSystemItem: any;
  selectedStarSystemItemLaws: Jurisdiction[];
  selectedObjectKind: string;
  subscription: Subscription;
  fullSubscription: Subscription;

  constructor(private systemMapService:SystemMapService, private authService:AuthService, private spinnerService:SpinnerService) { 
    this.subscription = this.systemMapService.dataRefreshAnnounced$.subscribe(
      () => {
        // this.fetchSystems()
        this.allSystems() // redraw
      }
    )
    
    this.subscription = this.systemMapService.fullDataRefreshAnnounced$.subscribe(
      () => {
        this.fetchSystems(true)
      }
    )
  }

  fetchSystems(redraw:boolean = false)
  {
    this.spinnerService.spin(true)
    this.systemMapService.list().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.spinnerService.spin(false)
          this.starSystems = results

          // If first load then fetch and reload the chart
          if (!this.dataLoaded || redraw) {
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
          forceAtlas2Based: {
              gravitationalConstant: -26,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18,
              avoidOverlap: 1.5
          },
          maxVelocity: 146,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: {
              enabled: true,
              iterations: 1000,
              updateInterval: 25
          }
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
    this.network = new Network(this.netContainer.nativeElement, dataSet, options) as Network;
    let self = this;

    // deal with physics

    // setup the listener
    this.network.on('select', function(params) {
      if (params && params.nodes && params.nodes[0] && !this.selectedStarSystem) {
        // console output to debug
        // const theNode = params.nodes[0] as Node
        
        console.log(params.nodes[0])

        if (params.nodes[0] && /^(gw|p|m|so)-([0-9]{1,4})$/.test(params.nodes[0])) {
          let matches = /^(gw|p|m|so)-([0-9]{1,4})$/.exec(params.nodes[0])
          console.log(matches)
          // if we have selected a system
          const objectKind = matches[1];
          const objectId = matches[2];
          // this.network.selectNodes([]);
          // this.network.selectEdges([]);
          self.matchItem(objectKind, parseInt(objectId))
          self.gatherLaws(objectKind, parseInt(objectId));
        } else {
          // if we have not selected a system then we select one
          self.selectSystem(params.nodes[0])
        }
      }
      console.log('network:');
      
      console.log(this.network);
      
    });
  }

  /**
   * Parse and gather the laws for a selected object
   * @param objectKind gw or p or m or so
   * @param objectId The Id of the object
   */
  private gatherLaws(objectKind:string, objectId:number) {
    let jurisList = [] as Jurisdiction[];

    // we always get the star system
    if (this.selectedStarSystem.jurisdiction) {
      jurisList.push(this.selectedStarSystem.jurisdiction);
    }

    // if its a planet
    if (objectKind == "p") {
      if (this.selectedStarSystem.planets[this.selectedStarSystem.planets.findIndex(x => x.id == objectId)].jurisdiction) {
        jurisList.push(this.selectedStarSystem.planets[this.selectedStarSystem.planets.findIndex(x => x.id == objectId)].jurisdiction);
      }
    }

    // if it a moon
    if (objectKind == "m") {
      for (let index = 0; index < this.selectedStarSystem.planets.length; index++) {
        const planet = this.selectedStarSystem.planets[index];
        if (planet.jurisdiction) {
          jurisList.push(planet.jurisdiction);
        }

        const moon = planet.moons.find(x => x.id === objectId)
        if (moon && moon.jurisdiction) {
          jurisList.push(moon.jurisdiction);
        }
      }
    }

    // if its a system object
    if (objectKind == "so") {
      const starSystemLevelSo = this.selectedStarSystem.system_objects.find(x => x.id === objectId)
      if (starSystemLevelSo) {
        if (starSystemLevelSo.jurisdiction) {
          jurisList.push(starSystemLevelSo.jurisdiction);
        }
      } else {
        for (let index = 0; index < this.selectedStarSystem.planets.length; index++) {
          const planet = this.selectedStarSystem.planets[index];
          const planetLevelSo = planet.system_objects.find(x => x.id === objectId)
          if (planetLevelSo) {
            if (planetLevelSo.jurisdiction) {
              jurisList.push(planetLevelSo.jurisdiction)
            }            
            break;
          }
  
          for (let index = 0; index < planet.moons.length; index++) {
            const moon = planet.moons[index];
            const moonLevelSo = moon.system_objects.find(x => x.id === objectId)
            if (moonLevelSo) {
              if (moonLevelSo.jurisdiction) {
                jurisList.push(moonLevelSo.jurisdiction)
              }
              break;
            }
          }
        }
      }
    }

    // return a unique list of items
    if (jurisList) {
      this.selectedStarSystemItemLaws = Array.from(new Set(jurisList.map((item: Jurisdiction) => item.id))).map((id) => {
        return jurisList.find(x => x.id === id)
      });
    }
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

  /**
   * Select a star system to show
   * @param systemId The id of the Star System
   */
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
              label: `${system_object.title} (${system_object.object_type.title})`, 
              group: `gw-${gravity_well.id}`, 
              shape: 'dot',
              size: 5,
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
              size: 15
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
                  label: `${system_object.title} (${system_object.object_type.title})`, 
                  group: `m-${moon.id}`, 
                  shape: 'dot',
                  size: 5,
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
                label: `${system_object.title} (${system_object.object_type.title})`, 
                group: `p-${planet.id}`, 
                shape: 'dot',
                size: 10,
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
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
