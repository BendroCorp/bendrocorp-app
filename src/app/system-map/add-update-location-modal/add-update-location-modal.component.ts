import { Component, OnInit, Input } from '@angular/core';
import { SystemLocation, Planet, Moon, SystemMapTypes, SystemObject, Settlement } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';

@Component({
  selector: 'add-update-location-modal',
  templateUrl: './add-update-location-modal.component.html',
  styleUrls: ['./add-update-location-modal.component.css']
})
export class AddUpdateLocationModalComponent implements OnInit {
  @Input() systemLocation:SystemLocation

  @Input() systemPlanet:Planet
  @Input() systemMoon:Moon
  @Input() systemObject:SystemObject
  @Input() systemSettlement:Settlement
  @Input() smallBtn:boolean
  formAction:string
  objectTitle:string
  successString:string
  types:SystemMapTypes
  modalRef:NgbModalRef
  formSubmitting:boolean = false

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

  addUpdateSystemLocation()
  {
    this.formSubmitting = true
    if (this.systemLocation.id) {
      this.systemMapService.updateLocation(this.systemLocation).subscribe(
        (results) => {
          this.formSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.messageService.addSuccess(this.successString)
            this.close()
          }
        }
      )
    } else {
      this.systemMapService.addLocation(this.systemLocation).subscribe(
        (results) => {
          this.formSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.messageService.addSuccess(this.successString)
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

  handleImageFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.systemLocation.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        
      }
    );
  }

  getBase64(file) {
    // https://stackoverflow.com/questions/47936183/angular-5-file-upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  ngOnInit() {
    this.fetchTypes()
    this.formAction = (this.systemLocation && this.systemLocation.id) ? "Update" : "Create"
    if (!(this.systemLocation && this.systemLocation.id)) {
      // Which one is it
      if (this.systemPlanet && !this.systemMoon && !this.systemObject && !this.systemSettlement) {
        this.systemLocation = { on_planet_id: this.systemPlanet.id } as SystemLocation 
        this.objectTitle = "Planet"
        this.successString = `${this.formAction}ed location on ${this.systemPlanet.title}`
      } else if (!this.systemPlanet && this.systemMoon && !this.systemObject && !this.systemSettlement) {
        this.systemLocation = { on_moon_id: this.systemMoon.id } as SystemLocation 
        this.objectTitle = "Moon"
        this.successString = `${this.formAction}ed location on ${this.systemMoon.title}`
      } else if (!this.systemPlanet && !this.systemMoon && this.systemObject && !this.systemSettlement) {
        this.systemLocation = { on_system_object_id: this.systemObject.id } as SystemLocation 
        this.objectTitle = "System Object"
        this.successString = `${this.formAction}ed location on ${this.systemObject.title}`
      } else if (!this.systemPlanet && !this.systemMoon && !this.systemObject && this.systemSettlement) {
        this.systemLocation = { on_settlement_id: this.systemSettlement.id } as SystemLocation 
        this.objectTitle = "Settlement"
        this.successString = `${this.formAction}ed location in ${this.systemSettlement.title}`
      }
    }
  }

}
