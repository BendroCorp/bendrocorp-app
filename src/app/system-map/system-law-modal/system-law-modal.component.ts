import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Jurisdiction } from 'src/app/models/law.model';

@Component({
  selector: 'system-law-modal',
  templateUrl: './system-law-modal.component.html',
  styleUrls: ['./system-law-modal.component.css']
})
export class SystemLawModalComponent {
  @Input() jurisdictions: Jurisdiction[];
  modelRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modelRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  close() {
    if (this.modelRef) {
      this.modelRef.close();
    }
  }

}
