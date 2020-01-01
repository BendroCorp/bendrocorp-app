import { Component, OnInit, Input } from '@angular/core';
import { FactionService } from 'src/app/misc/faction.service';
import { FactionAffiliation, Base64Upload } from 'src/app/models/misc-models';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-update-faction-modal',
  templateUrl: './add-update-faction-modal.component.html',
  styleUrls: ['./add-update-faction-modal.component.css']
})
export class AddUpdateFactionModalComponent implements OnInit {
  @Input() faction: FactionAffiliation;
  @Input() smallBtn: boolean;
  modal: NgbModalRef;
  formAction: string;
  formSubmitting: boolean;

  constructor(private modalService: NgbModal, private factionService: FactionService) { }

  open(content) {
    this.modal = this.modalService.open(content, {ariaLabelledBy: 'add-update-faction'});
  }

  close() {
    this.modal.close();
  }

  addUpdateFaction() {
    if (this.faction) {
      this.formSubmitting = true;
      if (this.faction.id) {
        this.factionService.updateFaction(this.faction).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.factionService.refreshData();
            this.formSubmitting = false;
            this.modal.close();
          }
        });
      } else {
        this.factionService.createFaction(this.faction).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.factionService.refreshData();
            this.formSubmitting = false;
            this.modal.close();
          }
        });
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
        this.faction.new_primary_image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
        
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
    if (!(this.faction && this.faction.id)) {
      this.faction = { } as FactionAffiliation;
      this.formAction = "Create";
    } else {
      this.formAction = "Update";
    }
  }

}
