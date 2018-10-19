import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StarSystem } from 'src/app/models/system-map-models';

@Component({
  selector: 'add-update-system-modal',
  templateUrl: './add-update-system-modal.component.html',
  styleUrls: ['./add-update-system-modal.component.css']
})
export class AddUpdateSystemModalComponent implements OnInit { 
  @Input() system:StarSystem
  modalRef:NgbModalRef
  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  ngOnInit() {
    // 
  }
}
