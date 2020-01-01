import { Component, OnInit, Input } from '@angular/core';
import { SystemMapService } from '../system-map.service';
import { FieldService } from 'src/app/misc/field.service';
import { MessageService } from 'src/app/message/message.service';
import { GravityWell } from 'src/app/models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { Base64Upload } from 'src/app/models/misc-models';

@Component({
  selector: 'add-update-gravity-well-modal',
  templateUrl: './add-update-gravity-well-modal.component.html',
  styleUrls: ['./add-update-gravity-well-modal.component.css']
})
export class AddUpdateGravityWellModalComponent implements OnInit {
  @Input() gravityWell: GravityWell;
  @Input() smallBtn: boolean;
  modal: NgbModalRef;
  luminosityClasses: FieldDescriptor[];
  gravityWellTypes: FieldDescriptor[];
  formAction: string;
  formSubmitting: boolean;

  constructor(
    private modalService: NgbModal,
    private systemMapService: SystemMapService,
    private fieldService: FieldService,
    private messageService: MessageService
  ) { }

  open(content) {
    if (this.gravityWell && this.gravityWell.id) {
      this.formAction = "Update";
    } else {
      this.formAction = "Create";
    }

    this.modal = this.modalService.open(content, {ariaLabelledBy: 'add-update-gravity-well'})
  }

  close() {
    if (this.modal) {
      this.modal.close();
    }
  }

  getDescriptorDescription(id: string, descriptors: FieldDescriptor[]) {
    if (id) {
      const descriptor = descriptors.find(x => x.id === id);
      if (descriptor) {
        return descriptor.description; 
      }
    }
  }

  fetchDescriptors() {
    // luminosity classes
    this.fieldService.getField('ce45fca0-80c1-4969-84d4-2449eb0f5164').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.luminosityClasses = results;
      }
    });

    // gravity well types
    this.fieldService.getField('e5d23d1f-13bc-42b9-949f-383097773727').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.gravityWellTypes = results;
      }
    });
  }

  addUpdateGravityWell() {
    if (this.gravityWell && this.gravityWell.id) {
      this.formSubmitting = true;
      this.systemMapService.updateGravityWell(this.gravityWell).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemMapService.fullRefreshData();
          this.close();
        }

        this.formSubmitting = false;
      });
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
        this.gravityWell.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        console.log(this.gravityWell.new_primary_image);
        
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
    this.fetchDescriptors();
  }

}
