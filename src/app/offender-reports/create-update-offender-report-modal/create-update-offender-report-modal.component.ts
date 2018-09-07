import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OffenderReportService } from '../offender-report.service';
import { Offender, OffenderReport, ViolenceRating } from '../../models/offender-report-models';
import { SystemMapService } from '../../system-map/system-map.service';
import { StarSystem } from '../../models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../../profiles/profile.service';
import { Ship } from '../../models/ship-models';

@Component({
  selector: 'offender-report-modal',
  templateUrl: './create-update-offender-report-modal.component.html',
  styleUrls: ['./create-update-offender-report-modal.component.css']
})
export class CreateUpdateOffenderReportModalComponent implements OnInit {

  constructor(private modalService: NgbModal, private offenderReportService:OffenderReportService, private profileService:ProfileService) {}
  @Input() offenderReport:OffenderReport
  systemData:StarSystem[]
  shipData:Ship[]
  violenceRatings:ViolenceRating[]
  formAction:string

  dateTimePickerSettings = {
    bigBanner: true,
    timePicker: true,
    format: 'MM/dd/yyyy hh:mm a  ',
    defaultOpen: false
  }

  openModal:NgbModalRef

  open(content) {    
    console.log(this.offenderReport);
    
    this.openModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  doCreateUpdate()
  {
    if (this.offenderReport && this.offenderReport.id) {
      this.offenderReportService.update(this.offenderReport).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.offenderReportService.refreshData()
            this.openModal.close()
          }
        }
      )
    } else {
      this.offenderReportService.create(this.offenderReport).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.offenderReportService.refreshData()
            // this.openModal.close() // dont close this
            this.formAction = "Update"
            this.offenderReport = results
          }
        }
      )
    }
  }

  submitForApproval()
  {
    if (this.offenderReport && this.offenderReport.id) {
      if (confirm("Are you sure you want to submit this offender report for approval?")) {
        this.offenderReportService.submit(this.offenderReport).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.offenderReport = results
              this.offenderReportService.refreshData()
            }
          }
        )
      }
    } else {
      console.error("submitForApproval: This report has not been submitted yet and thus cannot be submitted for approval!")
    }
  }
  

  public onOccuredWhenDateSelect(event_date_change:string)
  {   
    let new_date = new Date(event_date_change)
    new_date.setSeconds(0)  
    this.offenderReport.occured_when_ms = new_date.getTime()
    console.log(this.offenderReport.occured_when_ms);    
  }

  ngOnInit() {
    this.offenderReportService.list_rating().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.violenceRatings = results
        }
      }
    )

    this.profileService.list_ships().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.shipData = results
        }
      }
    )

    if (this.offenderReport && this.offenderReport.id) {
      this.formAction = "Update"
    } else {
      this.formAction = "Create"
      this.offenderReport = { offender_attributes: { } as Offender } as OffenderReport
    }
  }

}
