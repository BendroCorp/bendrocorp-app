import { Component, OnInit, Input } from '@angular/core';
import { SystemObject, Planet, Moon, StarSystem, SystemMapTypes } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'add-update-system-object-modal',
  templateUrl: './add-update-system-object-modal.component.html',
  styleUrls: ['./add-update-system-object-modal.component.css']
})
export class AddUpdateSystemObjectModalComponent implements OnInit {
  @Input() systemObject:SystemObject

  @Input() starSystem:StarSystem
  @Input() systemPlanet:Planet
  @Input() systemMoon:Moon
  @Input() smallBtn:boolean
  formAction:string
  objectTitle:string
  types:SystemMapTypes

  modalRef:NgbModalRef
  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService) { }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  addUpdateSystemObject()
  {
    if (this.systemObject.id) {
      this.systemMapService.updateSystemObject(this.systemObject).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.close()
          }
        }
      )
    } else {
      this.systemMapService.addSystemObject(this.systemObject).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.close()
          }
        }
      )
    }
  }

  fetchTypes()
  {
    this.systemMapService.fetch_types().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.types = results
        }
      }
    )
  }

  ngOnInit() {
    this.fetchTypes()
    this.formAction = (this.systemObject && this.systemObject.id) ? "Update" : "Create"
    if (!(this.systemObject && this.systemObject.id)) {
      // orbits_planet_id, orbits_planet_id, orbits_system_id
      // this.systemObject = { } as SystemObject 
      if (this.starSystem && !this.systemPlanet && !this.systemMoon) {
        this.systemObject = { orbits_system_id: this.starSystem.id } as SystemObject 
        this.objectTitle = "System"
      } else if (!this.starSystem && this.systemPlanet && !this.systemMoon) {
        this.systemObject = { orbits_planet_id: this.systemPlanet.id } as SystemObject 
        this.objectTitle = "Planet"
      } else if (!this.starSystem && !this.systemPlanet && this.systemMoon) {
        this.systemObject = { orbits_moon_id: this.systemMoon.id } as SystemObject 
        this.objectTitle = "Moon"
      }
    }
  }

}
