import { Component, OnInit, Input } from '@angular/core';
import { Moon, StarSystem } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64Upload } from 'src/app/models/misc-models';

@Component({
  selector: 'add-update-moon-modal',
  templateUrl: './add-update-moon-modal.component.html',
  styleUrls: ['./add-update-moon-modal.component.css']
})
export class AddUpdateMoonModalComponent implements OnInit {
  @Input() moon:Moon
  @Input() starSystem:StarSystem
  modalRef:NgbModalRef
  formAction:string
  formSubmitting:boolean = false
  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService) { }

  open(content) {
    this.formAction = (this.moon && this.moon.id) ? "Update" : "Create"
    if (!(this.moon && this.moon.id)) {
     this.moon = { } as Moon 
    }

    // open the modal
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  createUpdateMoon()
  {
    if (this.moon && this.moon.id) {
      this.formSubmitting = true
      this.systemMapService.updateMoon(this.moon).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.modalRef.close()
          }
          this.formSubmitting = false
        }
      )
    } else {
      this.systemMapService.addMoon(this.moon).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.starSystem.planets[this.starSystem.planets.findIndex(x => x.id == results.orbits_planet_id)].moons.push(results)
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
        this.moon.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
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
