import { Component, OnInit, Input } from '@angular/core';
import { Planet, Moon, SystemObject, SystemLocation, SystemImage } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';

@Component({
  selector: 'add-update-system-image-modal',
  templateUrl: './add-update-system-image-modal.component.html',
  styleUrls: ['./add-update-system-image-modal.component.css']
})
export class AddUpdateSystemImageModalComponent implements OnInit {
  @Input() systemImage:SystemImage

  @Input() systemPlanet:Planet
  @Input() systemMoon:Moon
  @Input() systemObject:SystemObject
  @Input() smallBtn:boolean
  formAction:string
  objectTitle:string
  successString:string
  modalRef:NgbModalRef
  formSubmitting:boolean = false
  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService) { }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'Add or Update Image'})
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  addUpdateSystemImage()
  {
    this.formSubmitting = true
    if (this.systemImage.id) {
      this.systemMapService.updateSystemImage(this.systemImage).subscribe(
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
      this.systemMapService.addSystemImage(this.systemImage).subscribe(
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

  deleteImage()
  {
    if (this.systemImage) {
      if (confirm("Are you sure you want to delete this image? This action is permanent and cannot be undone!")) {
        this.systemMapService.archiveSystemImage(this.systemImage).subscribe(
          (results) => {
            this.formSubmitting = false
            if (!(results instanceof HttpErrorResponse)) {
              this.systemMapService.fullRefreshData()
              this.messageService.addSuccess("Image deleted!")
              this.close()
            }
          }
        )
      }
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
        this.systemImage.new_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        
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
    this.formAction = (this.systemImage && this.systemImage.id) ? "Update" : "Create"
    if (!(this.systemImage && this.systemImage.id)) {
      // Which one is it
      if (this.systemPlanet && !this.systemMoon && !this.systemObject) {
        this.systemImage = { of_planet_id: this.systemPlanet.id } as SystemImage 
        this.objectTitle = "Planet"
        this.successString = `${this.formAction}d system image on ${this.systemPlanet.title}`
      } else if (!this.systemPlanet && this.systemMoon && !this.systemObject) {
        this.systemImage = { of_moon_id: this.systemMoon.id } as SystemImage 
        this.objectTitle = "Moon"
        this.successString = `${this.formAction}d system image on ${this.systemMoon.title}`
      } else if (!this.systemPlanet && !this.systemMoon && this.systemObject) {
        this.systemImage = { of_system_object_id: this.systemObject.id } as SystemImage 
        this.objectTitle = "System Object"
        this.successString = `${this.formAction}d system image on ${this.systemObject.title}`
      }
    }
  }
}
