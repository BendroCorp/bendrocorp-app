import { Component, OnInit } from '@angular/core';
import { SystemMapService } from '../system-map.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StarSystem, Moon, SystemObject, Settlement, SystemLocation, Planet, MissionGiver, SystemMapSearchItem } from 'src/app/models/system-map-models';
import { concat, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'system-map-list-view',
  templateUrl: './system-map-list-view.component.html',
  styleUrls: ['./system-map-list-view.component.css']
})
export class SystemMapListViewComponent implements OnInit {
  // seperated object arrays
  systems: StarSystem[];
  planets: Planet[];
  moons: Moon[];
  systemObjects: SystemObject[];
  settlements: Settlement[];
  locations: SystemLocation[];
  missionGivers: MissionGiver[];

  // search stuff
  fullList: SystemMapSearchItem[] = [];
  searchList: SystemMapSearchItem[] = [];
  searchFilter: string;
  recentItems: SystemMapSearchItem[] = [];
  isFiltering: boolean = false;

  // https://stackoverflow.com/questions/42761163/angular-2-debouncing-a-keyup-event
  private searchSubject: Subject<string> = new Subject();

  // detail panel
  selectedListItemId: string;
  selectedListItem: SystemMapSearchItem;

  constructor(
    private systemMapService: SystemMapService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  filterItems() {
    // console.log('filter me');
    // console.log(this.searchFilter);

    if (this.searchFilter && this.fullList) {
      this.isFiltering = true;
      let filtered = [];      
      filtered = this.fullList.filter(it => {
        // console.log(it);        
        return it.title.toLowerCase().includes(this.searchFilter.toLowerCase()) 
        || (it.description && it.description.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.tags && it.tags.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.parent && it.parent.title && it.parent.title.toLowerCase().includes(this.searchFilter.toLowerCase()))
        || (it.kind && it.kind.toLowerCase().includes(this.searchFilter.toLowerCase()));
      });

      this.searchList = filtered;
      console.log(this.searchList);
      this.isFiltering = false;
    } else {
      this.searchList = [];
      this.isFiltering = false;
    }
  }

  selectListItem(listItem: SystemMapSearchItem) {
    this.recentItems = this.systemMapService.addRecentSelectedListItems(listItem);
    this.router.navigate(['system-map', `${listItem.id.split('-')[0]}-${listItem.title.toLowerCase().replace(' ', '-')}`], { state: { systemMapItem: JSON.stringify(listItem) } })
    this.selectedListItem = listItem;
  }

  fetchSystemObjects() {
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
            // specific items below this
            planets: x.planets,
            moons: x.moons,
            locations: x.locations,
            settlements: x.settlements,
            mission_givers: x.mission_givers,
            faction_affiliation: x.faction_affiliation,
            jurisdiction: x.jurisdiction,
            object_type: x.object_type,
            location_type: x.location_type,
            system_map_images: x.system_map_images
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
          this.fullList = this.fullList.flat();

          // stop the spinner
          this.spinnerService.spin(false);
        }
      } else {
        console.error('uh oh...something went wrong..');
      }
    });
  }

  clearRecents() {
    this.recentItems = this.systemMapService.clearRecentSelectedListItems();
  }

  onSearchKeyUp(){
    this.searchSubject.next();
  }

  ngOnInit() {
    // spin the spinner
    this.spinnerService.spin(true);
    // fetch the recent items
    this.recentItems = this.systemMapService.recentSelectedListItems();
    // fetch all of the system objects
    this.fetchSystemObjects();
    // setup the filter debounce
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filterItems();
    });
  }

}
