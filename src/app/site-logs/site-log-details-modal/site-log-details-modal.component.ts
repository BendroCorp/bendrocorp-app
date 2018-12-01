import { Component, OnInit, Input } from '@angular/core';
import { SiteLog } from 'src/app/models/misc-models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'site-log-details-modal',
  templateUrl: './site-log-details-modal.component.html',
  styleUrls: ['./site-log-details-modal.component.css']
})
export class SiteLogDetailsModalComponent implements OnInit {
  @Input() siteLog:SiteLog
  openModal: NgbModalRef

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'View Site Log'})
  }

  close()
  {
    if (this.openModal) {
      this.openModal.close()
    }
  }

  ngOnInit() {
    
  }

}
