import { Component, OnInit, Input } from '@angular/core';
import { Planet, Moon, SystemMapTypes, SystemLocation, Settlement } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';
import { Jurisdiction } from 'src/app/models/law.model';
import { LawService } from 'src/app/law-library/law.service';

@Component({
  selector: 'add-update-settlement-modal',
  templateUrl: './add-update-settlement-modal.component.html',
  styleUrls: ['./add-update-settlement-modal.component.css']
})
export class AddUpdateSettlementModalComponent implements OnInit {

  @Input() systemSettlement:Settlement

  @Input() systemPlanet:Planet
  @Input() systemMoon:Moon
  @Input() smallBtn:boolean
  formAction:string
  objectTitle:string
  successString:string
  types:SystemMapTypes
  modalRef:NgbModalRef
  formSubmitting:boolean = false;
  jurisdictions: Jurisdiction[] = [];

  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService, private lawService: LawService) { }

  open(content) {
    this.fetchJurisdictions();
    this.formAction = (this.systemSettlement && this.systemSettlement.id) ? "Update" : "Create"
    if (!(this.systemSettlement && this.systemSettlement.id)) {
      // Which one is it
      if (this.systemPlanet && !this.systemMoon) {
        this.systemSettlement = { on_planet_id: this.systemPlanet.id } as Settlement 
        this.objectTitle = "Planet"
        this.successString = `${this.formAction}d settlement on ${this.systemPlanet.title}`
      } else if (!this.systemPlanet && this.systemMoon) {
        this.systemSettlement = { on_moon_id: this.systemMoon.id } as Settlement 
        this.objectTitle = "Moon"
        this.successString = `${this.formAction}d settlement on ${this.systemMoon.title}`
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

  addUpdateSystemSettlement()
  {
    this.formSubmitting = true
    if (this.systemSettlement.id) {
      this.systemMapService.updateSettlement(this.systemSettlement).subscribe(
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
      this.systemMapService.addSettlement(this.systemSettlement).subscribe(
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

  handleImageFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.systemSettlement.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        
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

  fetchTypes()
  {
    // this.systemMapService.fetch_types().subscribe(
    //   (results) => {
    //     if (!(results instanceof HttpErrorResponse)) {
    //       this.types = results
    //     }
    //   }
    // )
  }

  ngOnInit() {
    this.fetchTypes()
    if (!(this.systemSettlement && this.systemSettlement.id)) {
      this.systemSettlement = { } as Settlement
    }
  }

}
