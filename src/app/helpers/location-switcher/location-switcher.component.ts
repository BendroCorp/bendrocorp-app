import { Component, OnInit, Input } from '@angular/core';
import { SystemMapService } from '../../system-map/system-map.service';
import { StarSystem, Planet, Moon } from '../../models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'location-switcher',
  templateUrl: './location-switcher.component.html',
  styleUrls: ['./location-switcher.component.css']
})
export class LocationSwitcherComponent implements OnInit {
  @Input() objectWithLocation:any
  @Input() isDisabled:boolean = false
  switcherLoaded:boolean = false
  
  systemData:StarSystem[]
  selectedSystem:StarSystem
  selectedPlanet:Planet
  selectedMoon:Moon  

  constructor(private systemMapService:SystemMapService) { }

  clearSelection()
  {
    this.selectedSystem = null
    this.selectedPlanet = null
    this.selectedMoon = null

    this.objectWithLocation.system_id = null
    this.objectWithLocation.planet_id = null
    this.objectWithLocation.moon_id = null
  }

  public selectSystem(systemId:number)
  {  
    this.selectedSystem = this.systemData.find(x => x.id == systemId)
    this.selectedPlanet = null
    this.selectedMoon = null
    this.objectWithLocation.planet_id = null
    this.objectWithLocation.moon_id = null
  }

  public selectPlanet(planetId:number)
  {
    this.selectedPlanet = this.selectedSystem.planets.find(x => x.id == planetId)
    this.selectedMoon = null
    this.objectWithLocation.moon_id = null
    
    console.log(this.selectedPlanet)
    console.log(this.objectWithLocation)
  }

  public selectMoon(moonId:number)
  {
    console.log(`moonId: ${moonId}`);
    this.selectedMoon = this.selectedPlanet.moons.find(x => x.id == moonId)
    console.log(this.selectedMoon);    
    console.log(this.objectWithLocation)
  }

  inputCheck()
  {
    let passed = true
    let failMessage = ""

    if (this.objectWithLocation) {
      if (!this.objectWithLocation.system_id) {
        passed = false
        failMessage = failMessage + "System ID not found. "
      }else{
        if (this.objectWithLocation.system_id != null) {
          this.selectedSystem = this.systemData.find(x => x.id == this.objectWithLocation.system_id)
        }
      }
  
      if (!this.objectWithLocation.planet_id) {
        passed = false
        failMessage = failMessage + "Planet ID not found. "
      }else{
        this.selectedPlanet = this.selectedSystem.planets.find(x => x.id == this.objectWithLocation.planet_id)
      }
  
      if (!this.objectWithLocation.moon_id) {
        passed = false
        failMessage = failMessage + "Moon ID not found. "
      }else{
        this.selectedMoon = this.selectedPlanet.moons.find(x => x.id == this.objectWithLocation.moon_id)
      }
    } else {
      passed = false
      failMessage = "objectWithLocation not passed."
    }

    this.switcherLoaded = true

    if (!passed) {
      console.error(failMessage);      
    }
  }

  ngOnInit() {
    this.systemMapService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemData = results
          this.inputCheck()
        }
      }
    )
  }

}
