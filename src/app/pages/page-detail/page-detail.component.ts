import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { MessageService } from 'src/app/message/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from '@bendrocorp/bendrocorp-node-sdk';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-page-detail',
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.css']
})
export class PageDetailComponent implements OnInit {
  // page object
  page: Page
  sanitizedContent: SafeHtml;
  isEditor: boolean = this.authService.hasClaim(29) || this.authService.hasClaim(30);
  isAdmin: boolean = this.authService.hasClaim(30);

  constructor(
    private pageService: PageService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private confirmation: ConfirmationModal,
    // private 
  ) { }

  // fetch page
  fetchPage() {
    const uuidSegment = this.route.snapshot.paramMap.get('page_id').split('-')[0]

    this.pageService.pageSearch(uuidSegment).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.page = results[0];
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.page.content);
        this.spinnerService.spin(false);
        console.log('Page data:');        
        console.log(this.page);
      }
    })
  }

  editPage()
  {
    if (this.isEditor || this.isAdmin) {
      this.router.navigateByUrl(`/pages/${this.page.id}/edit`)
    }
  }

  async archivePage()
  {
    if (this.isAdmin) {
      if (await this.confirmation.open('Are you sure you want to archive this page?')) {
        this.pageService.archivePage(this.page).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.messageService.addSuccess('Page archived!');
            this.router.navigateByUrl("/pages");
          }
        });
      }
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true);
    this.fetchPage();
  }

}
