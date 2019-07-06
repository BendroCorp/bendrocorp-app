import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Planet, StarSystem, Moon } from 'src/app/models/system-map-models';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';
import { Jurisdiction } from 'src/app/models/law.model';
import { LawService } from 'src/app/law-library/law.service';

@Component({
  selector: 'add-update-planet-modal',
  templateUrl: './add-update-planet-modal.component.html',
  styleUrls: ['./add-update-planet-modal.component.css']
})
export class AddUpdatePlanetModalComponent implements OnInit {
  @Input() planet:Planet
  @Input() starSystem:StarSystem
  modalRef:NgbModalRef
  formAction:string
  formSubmitting:boolean = false
  jurisdictions: Jurisdiction[] = [];
  
  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService, private lawService: LawService) { }

  open(content) {
    this.fetchJurisdictions();
    this.formAction = (this.planet && this.planet.id) ? "Update" : "Create"
    if (!(this.planet && this.planet.id)) {
     this.planet = { orbits_system_id: this.starSystem.id } as Planet 
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

  createUpdatePlanet()
  {
    if (this.planet && this.planet.id) {
      this.formSubmitting = true
      this.systemMapService.updatePlanet(this.planet).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.modalRef.close()
          }
          this.formSubmitting = false
        }
      )
    } else {
      this.systemMapService.addPlanet(this.planet).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.starSystem.planets.push(results)
            this.systemMapService.fullRefreshData()
            this.modalRef.close()
          }
          this.formSubmitting = false
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
        this.planet.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        console.log(this.planet.new_primary_image);
        
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
    
  }

}
