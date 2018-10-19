import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Planet } from 'src/app/models/system-map-models';

@Component({
  selector: 'add-update-planet-modal',
  templateUrl: './add-update-planet-modal.component.html',
  styleUrls: ['./add-update-planet-modal.component.css']
})
export class AddUpdatePlanetModalComponent implements OnInit {
  @Input() planet:Planet
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
