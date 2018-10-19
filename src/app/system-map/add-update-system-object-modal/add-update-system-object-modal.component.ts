import { Component, OnInit, Input } from '@angular/core';
import { SystemObject } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-update-system-object-modal',
  templateUrl: './add-update-system-object-modal.component.html',
  styleUrls: ['./add-update-system-object-modal.component.css']
})
export class AddUpdateSystemObjectModalComponent implements OnInit {
  @Input() object:SystemObject
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
