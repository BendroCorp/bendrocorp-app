import { Component, OnInit, Input } from '@angular/core';
import { MissionGiver, SystemLocation, SystemObject, Settlement } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { Base64Upload, FactionAffiliation } from 'src/app/models/misc-models';
import { FactionService } from 'src/app/misc/faction.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'add-update-mission-giver-modal',
  templateUrl: './add-update-mission-giver-modal.component.html',
  styleUrls: ['./add-update-mission-giver-modal.component.css']
})
export class AddUpdateMissionGiverModalComponent implements OnInit {
  @Input() missionGiver: MissionGiver;

  @Input() systemObject: SystemObject;
  @Input() systemSettlement: Settlement;
  @Input() systemLocation: SystemLocation;
  @Input() smallBtn:boolean

  modalRef: NgbModalRef;
  formAction: string;
  factions: FactionAffiliation[] = [];
  formSubmitting: boolean = false;

  constructor(
    private modalService: NgbModal,
    private factionService: FactionService,
    private systemMapService: SystemMapService,
    private messageService: MessageService
  ) { }

  open(content) {
    this.formSubmitting = false;
    this.formAction = (this.missionGiver && this.missionGiver.id) ? "Update" : "Create"
    if (!(this.missionGiver && this.missionGiver.id)) {
      this.missionGiver = {  } as MissionGiver;

      if (this.systemObject) {
        this.missionGiver.on_system_object_id = this.systemObject.id;
      }

      if (this.systemSettlement) {
        this.missionGiver.on_settlement_id = this.systemSettlement.id;
      }

      if (this.systemLocation) {
        this.missionGiver.on_location_id = this.systemLocation.id;
      }
    }

    // open the modal
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  fetchFactions() {
    this.factionService.listFactions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.factions = results;
      }
    });
  }

  createUpdateMissionGiver() {
    if (this.missionGiver && this.missionGiver.id) {
      this.formSubmitting = true;
      this.systemMapService.updateMissionGiver(this.missionGiver).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData();
            this.modalRef.close();
          }
          this.formSubmitting = false;
        }
      )
    } else {
      this.systemMapService.addMissionGiver(this.missionGiver).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData();
            this.modalRef.close();
          }
          this.formSubmitting = false;
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
        this.missionGiver.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        console.log(this.missionGiver.new_primary_image);
        
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
    this.fetchFactions();
  }

}
