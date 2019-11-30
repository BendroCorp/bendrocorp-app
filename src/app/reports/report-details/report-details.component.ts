import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '../report.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Report, ReportField } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'src/app/message/message.service';
import { concat, Subject, Subscription } from 'rxjs';
import { Character } from 'src/app/models/character-models';
import { ProfileService } from 'src/app/profiles/profile.service';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FieldService } from 'src/app/misc/field.service';
import { Field, FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit, OnDestroy {
  // control states - draft, view

  // variable
  reportId: string;
  report: Report;
  publishDraft: boolean;
  approverList: Character[];
  fields: Field[];
  dataSubmissionInProgress: boolean;
  reportFieldUpdate = new Subject<string>();
  fieldUpdateSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private profileService: ProfileService,
    private fieldService: FieldService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmation: ConfirmationModal
  ) { 
    this.reportFieldUpdate.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(() => {
        this.updateValues();
      });
  }

  fetchReport() {
    if (this.reportId) {
      this.reportService.listReports().subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          const report = results.find(x => x.id == this.reportId);

          if (report) {
            if (this.authService.retrieveUserSession().id === parseInt(report.created_by_id) || this.authService.hasClaim(49)) {
              this.report = report;
              this.publishDraft = !this.report.draft;
              console.log(this.report);
              console.log(this.publishDraft);
              
              if (!this.publishDraft) {
                this.fetchFields();
                this.fetchProfiles();
              }
              
              return;
            }
          }
          
          // if we here something went wrong
          this.messageService.addInfo("Report not found or you do not have access to view this report!");
          this.router.navigateByUrl('/reports');
        }
      });
    }
  }

  fetchProfiles() {
    this.profileService.list_members().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.approverList = results;
      }
    });
  }

  fetchFields() {
    this.fieldService.listFields().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.fields = results;
      }
    });
  }

  getFieldDescriptors(field: ReportField): FieldDescriptor[] {
    console.log(field);
    console.log(field.field_id);

    if (field && this.fields && this.fields.length > 0) {
      const foundField = this.fields.find(x => x.id === field.field_id);
      if (foundField) {
        return foundField.descriptors;  
      }
    }
    // return null;
  }

  updateValues() { 
    this.dataSubmissionInProgress = true;
    let updateRequests = [];

    // update the report itself
    updateRequests.push(this.reportService.updateReport(this.report))

    // loop though all of the fields and create the update requests
    for (let index = 0; index < this.report.fields.length; index++) {
      if (this.report.fields[index].field_value && this.report.fields[index].field_value.id) {
        updateRequests.push(this.reportService.updateFieldValue(this.report.fields[index].field_value));  
      }
    }

    let doUpdateRequests = concat.apply(this, updateRequests)//.subscribe(val => console.log(val));
    let updated = 0;
    let subscribe = doUpdateRequests.subscribe(val => {
      updated += 1
      if (updated == updateRequests.length) {
        this.messageService.addSuccess('Report updated!');
        this.dataSubmissionInProgress = false;
      }
    });
  }

  publishReport() {
    if (this.report && this.report.id) {
      this.dataSubmissionInProgress = true;

      // mark the report as no longer being a draft
      this.report.draft = false;

      // send the request
      this.reportService.updateReport(this.report).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.messageService.addSuccess('Report submitted!');
        } else {
          this.report.draft = true;
        }
        this.dataSubmissionInProgress = false;
      }); 
    }
  }

  formValid() {
    if (this.report && this.report.id) {
      if (!this.report.report_for_id) {
        return false;
      }

      for (let index = 0; index < this.report.fields.length; index++) {
        const field = this.report.fields[index];
        if (field.required) {
          if (!field.field_value || !field.field_value.value || field.field_value.value.toString().length <= 0) {
            return false;
          }
        }

        if (field.validator && field.validator.toString().length > 0) {
          var re = new RegExp(field.validator);
          if (!re.test(field.field_value.value)) {
            return false;
          }
        }
      }

      return true;
    }
  }

  async archiveReport() {
    console.log('archive report');
    
    if (await this.confirmation.open('Are you sure you want to archive this report?')) {
      this.reportService.archiveReport(this.report).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.messageService.addSuccess('Report archived!');
          this.reportService.refreshReportsData();
          this.router.navigateByUrl('/reports');
        }
      })
    }
  }

  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('report_id');
    this.fetchReport();
  }

  ngOnDestroy() {
    if (this.fieldUpdateSubscription) {
      this.fieldUpdateSubscription.unsubscribe();
    }
  }

}
