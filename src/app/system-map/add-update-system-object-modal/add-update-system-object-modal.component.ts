import { Component, OnInit, Input } from '@angular/core';
import { SystemObject, Planet, Moon, StarSystem, SystemMapTypes } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';
import { Jurisdiction } from 'src/app/models/law.model';
import { LawService } from 'src/app/law-library/law.service';
import { FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { FieldService } from 'src/app/misc/field.service';

@Component({
  selector: 'add-update-system-object-modal',
  templateUrl: './add-update-system-object-modal.component.html',
  styleUrls: ['./add-update-system-object-modal.component.css']
})
export class AddUpdateSystemObjectModalComponent implements OnInit {
  @Input() systemObject: SystemObject;

  @Input() starSystem: StarSystem;
  @Input() systemPlanet: Planet;
  @Input() systemMoon: Moon;
  @Input() smallBtn: boolean;

  formAction: string;
  objectTitle: string;
  types: FieldDescriptor[];
  jurisdictions: Jurisdiction[] = [];
  formSubmitting: boolean = false;

  modalRef:NgbModalRef
  constructor(
    private modalService: NgbModal,
    private systemMapService:SystemMapService,
    private messageService:MessageService,
    private lawService: LawService,
    private fieldService: FieldService
  ) { }

  open(content) {
    this.fetchJurisdictions();
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

    // open the modal
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  fetchJurisdictions() {
    this.lawService.listJurisdictions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
       this.jurisdictions = results; 
      }
    });
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  addUpdateSystemObject()
  {
    this.formSubmitting = true;
    if (this.systemObject.id) {
      this.systemMapService.updateSystemObject(this.systemObject).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData();
            this.formSubmitting = false;
            this.close();
          }
        }
      )
    } else {
      this.systemMapService.addSystemObject(this.systemObject).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData();
            this.formSubmitting = false;
            this.close();
          }
        }
      )
    }
  }

  fetchTypes()
  {
    // this.systemMapService.fetch_types().subscribe(
    //   (results) => {
    //     if (!(results instanceof HttpErrorResponse)) {
    //       this.types = results
    //     }
    //   }
    // )
    this.fieldService.getField('62ac3a07-ece3-4079-8da1-3e88617032fd').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.types = results;
      }
    });
  }

  handleImageFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.systemObject.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        
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
    if (!(this.systemObject && this.systemObject.id)){
      this.systemObject = { } as SystemObject 
    }
  }

}
