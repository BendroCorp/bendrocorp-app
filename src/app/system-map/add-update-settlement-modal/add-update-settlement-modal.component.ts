import { Component, OnInit, Input } from '@angular/core';
import { Planet, Moon, SystemMapTypes, SystemLocation, Settlement } from 'src/app/models/system-map-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemMapService } from '../system-map.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'add-update-settlement-modal',
  templateUrl: './add-update-settlement-modal.component.html',
  styleUrls: ['./add-update-settlement-modal.component.css']
})
export class AddUpdateSettlementModalComponent implements OnInit {

  @Input() systemSettlement:Settlement

  @Input() systemPlanet:Planet
  @Input() systemMoon:Moon
  @Input() smallBtn:boolean
  formAction:string
  objectTitle:string
  successString:string
  types:SystemMapTypes
  modalRef:NgbModalRef

  constructor(private modalService: NgbModal, private systemMapService:SystemMapService, private messageService:MessageService) { }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close()
  {
    if (this.modalRef) {
      this.modalRef.close()
    }
  }

  addUpdateSystemSettlement()
  {
    if (this.systemSettlement.id) {
      this.systemMapService.updateSettlement(this.systemSettlement).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.messageService.addSuccess(this.successString)
            this.close()
          }
        }
      )
    } else {
      this.systemMapService.addSettlement(this.systemSettlement).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.systemMapService.fullRefreshData()
            this.messageService.addSuccess(this.successString)
            this.close()
          }
        }
      )
    }
  }

  fetchTypes()
  {
    this.systemMapService.fetch_types().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.types = results
        }
      }
    )
  }

  ngOnInit() {
    this.fetchTypes()
    this.formAction = (this.systemSettlement && this.systemSettlement.id) ? "Update" : "Create"
    if (!(this.systemSettlement && this.systemSettlement.id)) {
      // Which one is it
      if (this.systemPlanet && !this.systemMoon) {
        this.systemSettlement = { on_planet_id: this.systemPlanet.id } as SystemLocation 
        this.objectTitle = "Planet"
        this.successString = `${this.formAction}ed location on ${this.systemPlanet.title}`
      } else if (!this.systemPlanet && this.systemMoon) {
        this.systemSettlement = { on_moon_id: this.systemMoon.id } as SystemLocation 
        this.objectTitle = "Moon"
        this.successString = `${this.formAction}ed location on ${this.systemMoon.title}`
      }
    }
  }

}
