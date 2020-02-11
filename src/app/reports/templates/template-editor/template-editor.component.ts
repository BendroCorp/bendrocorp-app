import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportTemplate, ReportField, ReportHandler, ReportRoute } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'src/app/message/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../../report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';
import { Subscription, Subject, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Field } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { FieldService } from 'src/app/misc/field.service';
import { Role } from '@bendrocorp/bendrocorp-node-sdk/models/user.model';
import { RoleService } from 'src/app/roles/role.service';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent implements OnInit, OnDestroy {
  
  templateId: string = this.route.snapshot.paramMap.get('template_id')
  isReportBuilder: boolean = this.authService.hasClaim(48);
  reportHandlers: ReportHandler[];
  fields: Field[] = [];
  roles: Role[] = [];
  reportRoutes: ReportRoute[] = [];
  template: ReportTemplate;
  templateFieldUpdate = new Subject<string>();
  templateUpdateSubscription: Subscription;
  dataSubmissionInProgress: boolean;
  displayTypes: any[] = [{ id: 1, name: 'Text' }, { id: 2, name: 'Long Text' }, { id: 3, name: 'Number' }, { id: 4, name: 'Date' }, { id: 5, name: 'Field' }]

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private reportsService: ReportService,
    private fieldService: FieldService,
    private confirmation: ConfirmationModal,
    private roleService: RoleService
  ) {
    this.templateUpdateSubscription = this.templateFieldUpdate.pipe(
      debounceTime(700),
      distinctUntilChanged())
      .subscribe(() => {
        this.updateValues();
      });
  }

  updateValues() {
    this.dataSubmissionInProgress = true;
    let updateRequests = [];

    // update the report itself
    updateRequests.push(this.reportsService.updateTemplate(this.template))

    // loop though all of the fields and create the update requests
    for (let index = 0; index < this.template.fields.length; index++) {
      updateRequests.push(this.reportsService.updateTemplateField(this.template.fields[index]));
    }

    let doUpdateRequests = concat.apply(this, updateRequests) //.subscribe(val => console.log(val));
    let updated = 0;
    let subscribe = doUpdateRequests.subscribe(val => {
      updated += 1
      if (updated == updateRequests.length) {
        this.messageService.addSuccess('Report updated!');
        this.dataSubmissionInProgress = false;
      }
    });
  }

  updateTemplate() {
    if (this.template && this.template.id) {
      this.reportsService.updateTemplate(this.template).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.reportsService.refreshTemplatesData();
          this.messageService.addSuccess('Template updated!');
          // this.router.navigateByUrl(`/reports/templates/${results.id}`);
        }
      });
    }
  }

  async archiveTemplate() {
    if (await this.confirmation.open('Are you sure you want to archive this field?')) {
      if (this.template && this.template.id) {
        this.reportsService.archiveTemplate(this.template).subscribe((results) => {
          this.reportsService.refreshTemplatesData();
          this.router.navigateByUrl('/reports/templates');
        });
      }
    }
  }

  addField() {
    if (this.template && this.template.id) {
      this.reportsService.createTemplateField({ template_id: this.templateId } as ReportField).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.template.fields.push(results);
          this.template.draft = true;
          this.updateTemplate();
        }
      });
    }
  }

  updateField(reportField: ReportField) {
    if (reportField && reportField.id) {
      this.reportsService.updateTemplateField(reportField).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.messageService.addSuccess('Field updated!');
        }
      })
    }
  }

  async archiveField(reportField: ReportField) {
    if (await this.confirmation.open('Are you sure you want to archive this field?')) {
      if (reportField && reportField.id) {
        this.reportsService.archiveTemplateField(reportField).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.messageService.addSuccess('Field archived!');
            this.template.fields.splice(this.template.fields.findIndex(x => x.id == reportField.id), 1);
          }
        })
      }
    }
  }

  fetchTemplate() {
    this.reportsService.listTemplates().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        console.log(results);
        this.template = results.find(x => x.id === this.templateId);
        console.log(this.template);
      }
    });
  }

  fetchRoles() {
    this.roleService.listSimple().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.roles.push({ name: 'No Role (Not a protected form)' } as Role)
        this.roles = this.roles.concat(results);
      }
    });
  }

  fetchHandlers() {
    this.reportsService.listReportHandlers().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reportHandlers = results;
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

  fetchRoutes() {
    this.reportsService.listReportRoutes().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reportRoutes = results;
      }
    });
  }

  ngOnInit() {
    if (!this.isReportBuilder) {
      this.messageService.addError('You are not authorized to create report templates!')
      this.router.navigateByUrl('/');
    } else {
      this.fetchRoutes();
      this.fetchRoles();
      this.fetchFields();
      this.fetchHandlers();
      this.fetchTemplate();
    }

    if (!this.templateId) {
      this.messageService.addError('Template ID not supplied!')
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy() {
    if (this.templateUpdateSubscription) {
      this.templateUpdateSubscription.unsubscribe();
    }
  }

}
