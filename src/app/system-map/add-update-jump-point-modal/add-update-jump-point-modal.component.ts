import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SystemMapService } from '../system-map.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JumpPoint, StarSystem } from 'src/app/models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'src/app/message/message.service';
import { Subscription } from 'rxjs';
import { Base64Upload } from 'src/app/models/misc-models';
import { FieldService } from 'src/app/misc/field.service';
import { FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';

@Component({
  selector: 'add-update-jump-point-modal',
  templateUrl: './add-update-jump-point-modal.component.html',
  styleUrls: ['./add-update-jump-point-modal.component.css']
})
export class AddUpdateJumpPointModalComponent implements OnInit, OnDestroy {
  @Input() jumpPoint: JumpPoint;
  @Input() starSystem: StarSystem;
  @Input() smallBtn: boolean;
  starSystems: StarSystem[];
  formAction: string;
  formSubmitting: boolean = false;
  modal: NgbModalRef;
  updateSubscription: Subscription;
  connectionStatuses: FieldDescriptor[];
  connectionSizes: FieldDescriptor[];

  constructor(
    private modalService: NgbModal,
    private systemMapService: SystemMapService,
    private messageService: MessageService,
    private fieldService: FieldService
  ) { 
    this.updateSubscription = this.systemMapService.fullDataRefreshAnnounced$.subscribe(() => {
      this.fetchSystems();
    });
  }

  open(content) {
    if ((this.starSystem && this.starSystem.id && !this.jumpPoint) || (this.jumpPoint && this.jumpPoint.id && !this.starSystem)) {
      if (this.jumpPoint && this.jumpPoint.id) {
        this.formAction = "Update";
        console.log(this.jumpPoint);
      } else {
        this.formAction = "Create";
        this.jumpPoint = { system_one_id: this.starSystem.id } as JumpPoint;
        console.log(this.jumpPoint);
      }
    } else {
      this.formAction = "Create";
      this.jumpPoint = {} as JumpPoint;
      console.log(this.jumpPoint);
      
    }

    this.modal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  close() {
    if (this.modal) {
      this.modal.close();
    }
  }

  saveUpdateJumpPoint() {
    console.log(this.jumpPoint);
    
    if (this.jumpPoint.system_one_id !== this.jumpPoint.system_two_id) {
      this.formSubmitting = true;
      if (this.jumpPoint && this.jumpPoint.id) {
        this.systemMapService.updateJumpPoint(this.jumpPoint).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.formSubmitting = false;
            this.systemMapService.fullRefreshData();
            this.close();
          }
        });
      } else {
        this.systemMapService.addJumpPoint(this.jumpPoint).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.formSubmitting = false;
            this.systemMapService.fullRefreshData();
            this.close();
          }
        });
      }
    } else {
      this.messageService.addError('Jump points cannot link into the same system.')
    }
  }

  fetchSystems() {
    this.systemMapService.listSystems().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starSystems = results;
      }
    });
  }

  handleImageFileInputOne(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.jumpPoint.new_primary_image_one = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
      }
    );
  }

  handleImageFileInputTwo(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.jumpPoint.new_primary_image_two = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
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

  fetchDescriptors() {
    // fetch connection statuses
    // this.fieldService.getField('').subscribe((results) => {
    //   if (!(results instanceof HttpErrorResponse)) {
        
    //   }
    // });

    this.fieldService.getField('62fdb35f-39ab-47f8-9fc0-0c690793e076').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.connectionStatuses = results;
      }
    });

    // fetch connection sizes
    this.fieldService.getField('60152083-97c5-4262-9c88-2903cc8c44ad').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.connectionSizes = results;
      }
    });
  }

  ngOnInit() {
    this.fetchDescriptors();
    this.fetchSystems();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}
