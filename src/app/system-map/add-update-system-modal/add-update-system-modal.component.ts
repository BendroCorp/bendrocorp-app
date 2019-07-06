import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StarSystem } from 'src/app/models/system-map-models';
import { LawService } from 'src/app/law-library/law.service';
import { SystemMapService } from '../system-map.service';
import { Jurisdiction } from 'src/app/models/law.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'add-update-system-modal',
  templateUrl: './add-update-system-modal.component.html',
  styleUrls: ['./add-update-system-modal.component.css']
})
export class AddUpdateSystemModalComponent implements OnInit { 
  @Input() starSystem: StarSystem;
  modalRef: NgbModalRef;
  formAction: string;
  dataMoveInProgress: boolean;
  jurisdictions: Jurisdiction[] = [];

  constructor(private modalService: NgbModal, private lawService: LawService, private systemMapService: SystemMapService) { }

  open(content) {
    this.fetchJurisdictions();
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  fetchJurisdictions() {
    this.lawService.listJurisdictions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
       this.jurisdictions = results; 
      }
    });
  }

  saveUpdateSystem() {
    if (this.starSystem && this.starSystem.id) {
      this.systemMapService.updateSystem(this.starSystem).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemMapService.refreshData();
          this.close();
        }
      });
    } else {
      this.systemMapService.updateSystem(this.starSystem).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemMapService.refreshData();
          this.close();
        }
      });
    }
  }

  close()
  {
    if (this.modalRef) {
      if (!(this.starSystem && this.starSystem.id)) {
        this.starSystem = {} as StarSystem;
      }
      this.modalRef.close()
    }
  }

  ngOnInit() {
    if (this.starSystem && this.starSystem.id) {
      this.formAction = "Update";
    } else {
      this.formAction = "Create";
      this.starSystem = {} as StarSystem;
    }
  }
}
