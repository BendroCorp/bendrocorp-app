import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemMapSearchItem } from 'src/app/models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';
import { SystemMapService } from '../system-map.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { concat, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MessageService } from 'src/app/message/message.service';

@Component({
  selector: 'app-system-map-object-detail',
  templateUrl: './system-map-object-detail.component.html',
  styleUrls: ['./system-map-object-detail.component.css']
})
export class SystemMapObjectDetailComponent implements OnInit, OnDestroy {
  isEditor: boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true : false;
  
  fullList: SystemMapSearchItem[] = [];
  selectedItemId: string;
  selectedItem: SystemMapSearchItem;

  // subscriptions
  routeSubscription: Subscription;
  updateSubscription: Subscription;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { 
    this.updateSubscription = this.systemMapService.fullDataRefreshAnnounced$.subscribe(() => {
      this.fetchSystemObjectsAndSelect();
    });
  }

  fetchSystemObjectsAndSelect() {
    // collection for all of the requests
    // this.fullList = [];
    var objectRequests = [];
    let completed = 0;

    // requests
    objectRequests.push(this.systemMapService.listSystems());
    objectRequests.push(this.systemMapService.listPlanets());
    objectRequests.push(this.systemMapService.listMoons());
    objectRequests.push(this.systemMapService.listSystemObjects());
    objectRequests.push(this.systemMapService.listLocations());
    objectRequests.push(this.systemMapService.listSettlements());
    objectRequests.push(this.systemMapService.listMissionGivers());
    objectRequests.push(this.systemMapService.listJumpPoints());

    // concat and execute
    let doObjectRequests = concat.apply(this, objectRequests)
    doObjectRequests.subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        completed += 1;
        // console.log(completed);
        // console.log(results);

        // concat results into the full list
        let objectResult = results.map(x => {
          // the search object represents all of the possible fields that could be in System Map
          let searchObject = { 
            // things everything will have that may even be potentially searchable
            id: x.id,
            title: x.title,
            description: x.description,
            tags: x.tags,
            kind: x.kind,
            primary_image_url: x.primary_image_url,
            primary_image_url_full: x.primary_image_url_full,
            // specific items below this
            planets: x.planets,
            moons: x.moons,
            locations: x.locations,
            settlements: x.settlements,
            system_objects: x.system_objects,
            jump_points: x.jump_points,
            mission_givers: x.mission_givers,
            faction_affiliation: x.faction_affiliation,
            faction_affiliation_id: x.faction_affiliation_id,
            jurisdiction: x.jurisdiction,
            jurisdiction_id: x.jurisdiction_id,
            object_type: x.object_type,
            object_type_id: x.object_type_id,
            location_type: x.location_type,
            location_type_id: x.location_type_id,
            system_map_images: x.system_map_images,
            atmospheric_height: x.atmospheric_height,
            general_radiation: x.general_radiation,
            economic_rating: x.economic_rating,
            population_density: x.population_density,
            minimum_criminality_rating: x.minimum_criminality_rating
          } as SystemMapSearchItem;

          // parent
          if (x.parent) {
            searchObject.parent_id = x.parent.id;
            searchObject.parent = x.parent;
          }

          // image
          if (x.primary_image_one_url) {
            searchObject.primary_image_url = x.primary_image_one_url;
          } else {
            searchObject.primary_image_url = x.primary_image_url;
          }

          return searchObject;
        }); // end results concat

        // push the results
        this.fullList.push(objectResult);

        // if completed, stop the spinner and flatten the list
        if (completed >= objectRequests.length) {
          // flatten the whole list
          this.fullList = this.fullList.flat();

          // select an item
          this.selectedItem = this.fullList.find(x => {
            return x.id.includes(this.selectedItemId);
          });

          // write the object to the console
          console.log(this.selectedItem);

          // if an item has not been selected then route back to base system map page
          if (!this.selectedItem) {
            this.messageService.addError('System Map object not found!');
            this.router.navigateByUrl('/system-map');
          }

          // stop the spinner
          this.spinnerService.spin(false);
        }
      } else {
        console.error('uh oh...something went wrong..');
      }
    });
  }

  parseObjectLink(item: SystemMapSearchItem): string {
    let urlObjectId = `${item.id.split('-')[0]}-${item.title.trim().toLowerCase().split(' ').join('-')}`
    return urlObjectId;
  }

  fetchObjectDetails() {
    console.log(this.route.params);

    // clear the current item if it exists
    if (this.selectedItem) {
      this.selectedItem = null;
    }

    this.route.params.subscribe((params) => {
      console.log(params);
      const objectId: string = params.object_id;
      if (objectId && objectId.split('-')[0]) {
        this.selectedItemId = objectId.split('-')[0];
        console.log(this.selectedItemId);
  
        this.spinnerService.spin(true);
  
        this.fetchSystemObjectsAndSelect();
      } else {
        this.messageService.addError('Object ID was not properly passed.');
        this.router.navigateByUrl('/system-map');
      }
    });
    
  }

  ngOnInit() {
    this.fetchObjectDetails();
    this.routeSubscription = this.router.events.subscribe((val) => {
      // see also 
      console.log(val instanceof NavigationEnd) 
      if (val instanceof NavigationEnd) {
        this.fetchObjectDetails();
      }
  });
  }

  ngOnDestroy() {
    //
    if (this.updateSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.updateSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
