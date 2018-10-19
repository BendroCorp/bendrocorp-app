import { Injectable } from '@angular/core';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StarSystem, Planet } from '../models/system-map-models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemMapService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("System Map service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<StarSystem[]>
  {
    return this.http.get<StarSystem[]>(`${this.globals.baseUrl}/system-map`).pipe(
      tap(result => {
        console.log(`Fetched ${result.length} star systems!`)
        console.log(result)
      }),
      catchError(this.errorService.handleError('Fetch System Map', []))
    )
  }

  addSystem()
  {

  }

  updateSystem()
  {

  }

  archiveSystem()
  {
    
  }

  addPlanet(planet:Planet) : Observable <Planet>
  {
    return this.http.post<Planet>(`${this.globals.baseUrl}/system-map/planet`, { planet }).pipe(
      tap(result => console.log(`Created planet!`)),
      catchError(this.errorService.handleError<any>('Create Planet'))
    )
  }

  updatePlanet(planet:Planet)
  {
    return this.http.post<Planet>(`${this.globals.baseUrl}/system-map/planet`, { planet }).pipe(
      tap(result => console.log(`Updated planet!`)),
      catchError(this.errorService.handleError<any>('Update Planet'))
    )
  }

  archivePlanet(planet:Planet)
  {
    return this.http.delete<Planet>(`${this.globals.baseUrl}/system-map/${planet.id}`).pipe(
      tap(result => console.log(`Archived planet!`)),
      catchError(this.errorService.handleError<any>('Archive Planet'))
    )
  }

  addMoon()
  {

  }

  updateMoon()
  {

  }

  archiveMoon()
  {
    
  }

  addSettlement()
  {

  }

  updateSettlement()
  {

  }

  archiveSettlement()
  {
    
  }

  addLocation()
  {

  }

  updateLocation()
  {

  }

  archiveLocation()
  {
    
  }

  addFlora()
  {

  }

  updateFlora()
  {

  }

  archiveFlora()
  {
    
  }

  addFauna()
  {

  }

  updateFauna()
  {

  }

  archiveFauna()
  {
    
  }
}
