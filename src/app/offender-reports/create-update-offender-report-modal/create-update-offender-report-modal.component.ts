import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OffenderReportService } from '../offender-report.service';
import { Offender, OffenderReport, ViolenceRating, Infraction, ForceLevel } from '../../models/offender-report-models';
import { SystemMapService } from '../../system-map/system-map.service';
import { StarSystem } from '../../models/system-map-models';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../../profiles/profile.service';
import { Ship } from '../../models/ship-models';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, mergeMap, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/message/message.service';

@Component({
  selector: 'offender-report-modal',
  templateUrl: './create-update-offender-report-modal.component.html',
  styleUrls: ['./create-update-offender-report-modal.component.css']
})
export class CreateUpdateOffenderReportModalComponent implements OnInit, OnDestroy {  

  constructor(private modalService: NgbModal, private offenderReportService:OffenderReportService, private profileService:ProfileService, private messageService:MessageService, private ref: ChangeDetectorRef) {}
  @Input() offenderReport: OffenderReport;
  systemData: StarSystem[];
  shipData: Ship[];
  violenceRatings: ViolenceRating[];
  infractions: Infraction[];
  forceLevels: ForceLevel[];
  formAction: string;
  formActionOuter: string;
  handleVerified: boolean;
  checkingHandle: boolean = false;
  handleTextChanged = new Subject<string>();
  subscription: Subscription;

  openModal: NgbModalRef;

  open(content) {    
    console.log(this.offenderReport);
    
    this.openModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  searchHandle($event)
  {
    this.handleTextChanged.next($event.target.value);
  }

  verifyHandle(handle:string)
  {
    if (handle) {
      this.offenderReportService.verify_handle(handle).subscribe(
        (result) => {
          this.checkingHandle = false;
          this.handleVerified = result;        
        }
      )
    }
  }

  doCreateUpdate()
  {
    if (this.handleVerified) {
      console.log(`Handle Verified: ${this.handleVerified}`);
      
      // adjust the infractions list
      this.offenderReport.remove_infractions.forEach((val) => {
        this.offenderReport.infractions.splice(this.offenderReport.infractions.findIndex(x => x.id === val.id), 1);
        this.ref.detectChanges();
      });

      this.offenderReport.new_infractions.forEach((val) => {
        this.offenderReport.infractions.push(val);
        this.ref.detectChanges();
      });

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
    } else {
     this.messageService.addError("Handle must be verified to submit the offender report!")
    }    
  }

  submitForApproval()
  {
    if (confirm("Are you sure you want to submit this offender report for approval?")) {

      if (this.offenderReport && this.offenderReport.id) {
        // adjust the infractions list
        this.offenderReport.remove_infractions.forEach((val) => {
          this.offenderReport.infractions.splice(this.offenderReport.infractions.findIndex(x => x.id === val.id), 1);
          this.ref.detectChanges();
        });

        this.offenderReport.new_infractions.forEach((val) => {
          this.offenderReport.infractions.push(val);
          this.ref.detectChanges();
        });

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
  
  onOccuredWhenDateSelect(calChangedEvent:any)
  {
    if (calChangedEvent && calChangedEvent.value) {
      let calDate = calChangedEvent.value
      console.log(calDate);
      let new_date = new Date(calDate)
      if (new_date) {
        new_date.setSeconds(0)  
        this.offenderReport.occured_when_ms = new_date.getTime()
        console.log(this.offenderReport.occured_when_ms)
      }
    }
  }

  getForceDescription(forceId:string)
  {
    if (this.forceLevels && forceId) {
      let item = this.forceLevels.find(x => x.id === parseInt(forceId))
      if (item) {
        return item.description
      }
    }
  }

  addInfractionToReport(infraction:Infraction)
  {
    if (infraction && infraction.id) {
      if (!this.offenderReport.new_infractions) {
        this.offenderReport.new_infractions = []
      }
      this.offenderReport.new_infractions.push(infraction)
    }
  }

  removeInfractionFromReport(infraction:Infraction)
  {
    // This needs to be somewhere better
    if (!this.offenderReport.new_infractions) {
      this.offenderReport.new_infractions = []
    }

    let currentInfraction = this.offenderReport.infractions.find(x => x.id === infraction.id)
    let newInfraction = this.offenderReport.new_infractions.find(x => x.id === infraction.id) 
    if (!currentInfraction && newInfraction) {
      // remove it from the new infractions list and do nothing else
      this.offenderReport.new_infractions.splice(this.offenderReport.new_infractions.findIndex(x => x.id === infraction.id), 1)
    } else if (currentInfraction && !newInfraction && this.offenderReport.id) {
      // add it to the remove list for when we update
      this.offenderReport.remove_infractions.push(infraction)
    }else{
      console.error(`removeInfractionFromReport: Cannot remove infraction #${infraction.id} from report!`)      
    }
  }

  onRemoveList(infraction:Infraction) : boolean
  {
    if (this.offenderReport.remove_infractions) {
      return (this.offenderReport.remove_infractions.find(x => x.id === infraction.id)) ? true : false;
    }
  }

  momentMe(toMoment:number)
  {
    if (toMoment) {
      // return moment(toMoment)
      return toMoment
    }
  }

  filteredInfractions()
  {
    if (this.infractions) {
      let filtered = []
      for (let index = 0; index < this.infractions.length; index++) {
        const currentInfraction = this.infractions[index];
        if ((this.offenderReport.infractions && !this.offenderReport.infractions.find(x => x.id === currentInfraction.id) || !this.offenderReport.infractions) 
        && (this.offenderReport.new_infractions && !this.offenderReport.new_infractions.find(x => x.id === currentInfraction.id) || !this.offenderReport.new_infractions)
        || this.onRemoveList(currentInfraction))
        {
          filtered.push(currentInfraction)
        } 
      }
      return filtered
    }
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

    this.offenderReportService.list_infractions().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.infractions = results
        }
      }
    )

    this.offenderReportService.list_force_level().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.forceLevels = results
        }
      }
    )

    if (this.offenderReport && this.offenderReport.id) {
      console.log(this.offenderReport)
      
      this.formAction = "Update"
      this.formActionOuter = "Update"
      this.handleVerified = true // this.offenderReport.offender.offender_handle_verified
      if (!this.offenderReport.remove_infractions) {
        this.offenderReport.remove_infractions = []
      }
      if (!this.offenderReport.new_infractions) {
        this.offenderReport.new_infractions = []
      }

      this.offenderReport.occured_when = new Date(this.offenderReport.occured_when)
    } else {
      this.formAction = "Create"
      this.formActionOuter = "Create"
      this.offenderReport = { offender_attributes: { } as Offender, new_infractions: [], remove_infractions: [], infractions: [] } as OffenderReport
    }

    if (!this.offenderReport.id) {
      this.subscription = this.handleTextChanged
      .pipe(tap(tapper => { this.checkingHandle = true }), debounceTime(1000)).subscribe(
      (search) => {
        this.verifyHandle(search)
      }
    )
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
