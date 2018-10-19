import { Component, OnInit, Input } from '@angular/core';
import { Moon } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-update-moon-modal',
  templateUrl: './add-update-moon-modal.component.html',
  styleUrls: ['./add-update-moon-modal.component.css']
})
export class AddUpdateMoonModalComponent implements OnInit {
  @Input() moon:Moon
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
