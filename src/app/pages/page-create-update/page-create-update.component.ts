import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageService } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Page, PageCategory } from '@bendrocorp/bendrocorp-node-sdk';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { MessageService } from 'src/app/message/message.service';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/auth.service';
import { Globals } from 'src/app/globals';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-create-update',
  templateUrl: './page-create-update.component.html',
  styleUrls: ['./page-create-update.component.css']
})
export class PageCreateUpdateComponent implements OnInit {
  // docs
  // https://github.com/lula/ngx-summernote

  // vars
  pageId: string = this.route.snapshot.paramMap.get('page_id');
  page: Page;
  pageCategories: PageCategory[];
  initialDataLoaded: boolean = false;
  dataOperationRunning: boolean = false;
  isEditor: boolean = (this.authService.hasClaim(29) || this.authService.hasClaim(30));
  isAdmin: boolean = (this.authService.hasClaim(30));

  // private readonly imageUploadPath = (environment.production) ? `${this.globals.baseUrl}/images?access_token=${this.authService.retrieveSession()}` : null;

  // editor config
  editorConfig: any

  constructor(
    private authService: AuthService,
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private confirmation: ConfirmationModal,
    private ref: ChangeDetectorRef,
    private globals: Globals
  ) { }

  updatePage() {
    if (this.page && this.page.id) {
      if (!this.page.read_only) {
        this.dataOperationRunning = true;

        if (this.page.remove_categories) {
          this.page.remove_categories.forEach((val) => {
            this.page.categories.splice(this.page.categories.findIndex(x => x.id === val.id), 1);
            this.ref.detectChanges();
          });
        }

        if (this.page.new_categories) {
          this.page.new_categories.forEach((val) => {
            this.page.categories.push(val);
            this.ref.detectChanges();
          });
        }

        // clear our the edit arrays
        this.page.new_categories = [];
        this.page.remove_categories = [];
        // end categories adjustments

        this.pageService.updatePage(this.page).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            // replace the newly updated object with the current one
            this.page = results;

            // check to make sure the categories array exists - this is required for a few things
            if (!this.page.categories) {
              this.page.categories = [];
            }

            // send toast
            this.messageService.addSuccess('Page updated!');
          }
          this.dataOperationRunning = false;
        });
      } else {
        this.messageService.addError('This page is read-only and cannot be edited!');
        this.router.navigateByUrl('/pages');
      }
    }
  }

  async archivePage() {
    if (this.isAdmin) {
      if (await this.confirmation.open('Are you sure you want to archive this page?')) {
        this.pageService.archivePage(this.page).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.messageService.addSuccess('Page archived!');
            this.router.navigateByUrl('/pages');
          }
        });
      }
    } else {
      this.messageService.addError('Only page admins can archive pages!')
    }
  }

  fetchPage() {
    this.pageService.listPageCategories().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.pageCategories = results;
      }
    });

    this.pageService.fetchPage(this.pageId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.page = results;
        this.setConfig();
        this.initialDataLoaded = true;
        this.spinnerService.spin(false);

        // make sure the page is not read only - if it is nav away
        if (this.page.read_only) {
          this.messageService.addError('This page is read-only and cannot be edited!');
          this.router.navigateByUrl('/pages');
        }

        // check to make sure the categories array exists - this is required for a few things
        if (!this.page.categories) {
          this.page.categories = [];
        }
      } else {
        this.router.navigateByUrl('/pages');
      }
    });
  }

  setConfig() {
    this.editorConfig = {
      placeholder: '',
      tabsize: 2,
      height: '200px',
      // for the initial roll out we are going to skip this and put images inline
      // TODO: The initial idea for this is not going to cut it, we can use image_uploads but they need a many to many
      // relationship with the pages
      uploadImagePath: `${this.globals.baseUrl}/pages/${this.page.id}/images?access_token=${this.authService.retrieveSession()}`,
      toolbar: [
          ['misc', ['codeview', 'undo', 'redo']],
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
          ['fontsize', ['fontname', 'fontsize']],
          ['para', ['style', 'ul', 'ol', 'paragraph']],
          ['insert', ['table', 'picture', 'link', 'video', 'hr']]
      ],
      fontNames: ['Univia-Pro'] // we dont want any special fonts
    }
  }

  filteredCategories(): PageCategory[] {
    if (this.pageCategories) {
      let filtered = []
      for (let index = 0; index < this.pageCategories.length; index++) {
        const currentCategory = this.pageCategories[index];
        if ((this.page.categories && !this.page.categories.find(x => x.id === currentCategory.id) || !this.page.categories) 
        && (this.page.new_categories && !this.page.new_categories.find(x => x.id === currentCategory.id) || !this.page.new_categories)
        || this.onRemoveList(currentCategory))
        {
          filtered.push(currentCategory)
        } 
      }
      return filtered
    }
  }

  addCategoryToPage(category: PageCategory) {
    if (category && category.id) {
      // make sure new categories exists
      if (!this.page.new_categories) {
        this.page.new_categories = []
      }

      // make sure remove categories exists
      if (!this.page.remove_categories) {
        this.page.remove_categories = [];
      }

      if (this.page.remove_categories.find(x => x.id === category.id)) {
        this.page.remove_categories.splice(this.page.remove_categories.findIndex(x => x.id === category.id), 1);
      } else {
        this.page.new_categories.push(category);
      }
    }
  }

  removeCategoryFromPage(category: PageCategory) {
    if (!this.page.new_categories) {
      this.page.new_categories = [];
    }

    if (!this.page.remove_categories) {
      this.page.remove_categories = [];
    }

    let currentInfraction = this.page.categories.find(x => x.id === category.id)
    let newInfraction = this.page.new_categories.find(x => x.id === category.id) 
    if (!currentInfraction && newInfraction) {
      // remove it from the new infractions list and do nothing else
      this.page.new_categories.splice(this.page.new_categories.findIndex(x => x.id === category.id), 1)
    } else if (currentInfraction && !newInfraction && this.page.id) {
      // add it to the remove list for when we update
      this.page.remove_categories.push(category)
    } else {
      console.error(`removeInfractionFromReport: Cannot remove infraction #${category.id} from report!`)      
    }
  }

  onRemoveList(category: PageCategory) : boolean
  {
    if (this.page.remove_categories) {
      return (this.page.remove_categories.find(x => x.id === category.id)) ? true : false;
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true);
    this.fetchPage();
  }

}
