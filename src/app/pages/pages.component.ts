import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageService } from './page.service';
import { AuthService } from '../auth.service';
import { Subscription, Subject } from 'rxjs';
import { Page, PageCategory } from '@bendrocorp/bendrocorp-node-sdk/models/page.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {
  // general vars
  pages: Page[] = [];
  pageCategories: PageCategory[] = [];

  // pages into categories
  featuredPages: Page[] = [];
  guidePages: Page[] = [];
  policyPages: Page[] = [];
  yourPages: Page[] = [];
  otherPages: Page[] = [];

  // subscription
  subscription: Subscription;

  // 
  searchFilter: string;
  filteredPages: Page[];
  isFiltering: boolean;
  private searchSubject: Subject<string> = new Subject();
  private searchSubscription: Subscription;

  // 
  isEditor: boolean = (this.authService.hasClaim(29) || this.authService.hasClaim(30));
  isAdmin: boolean = (this.authService.hasClaim(30));
  initialDataLoaded: boolean = false;
  creatingPage: boolean = false;

  constructor(
    private pageService: PageService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private router: Router
  ) { 
    this.subscription = this.pageService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchPagesAndCategories();
    });
  }

  createPage() {
    if (this.isEditor || this.isAdmin) {
      this.creatingPage = true;
      this.pageService.createPage({ title: 'A New Page' } as Page).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.pageService.refreshData();
          this.openEditPage(results);
        }
        
        this.creatingPage = false;
      });
    } else {
      this.creatingPage = false;
      this.messageService.addError('You are not authorized to create a new page!');
    }
  }

  openPage(page: Page) {
    this.router.navigateByUrl(`/pages/${page.id.split('-')[0]}-${page.title.toLowerCase().replace(' ', '-')}`);
  }

  openEditPage(page: Page) {
    this.router.navigateByUrl(`/pages/${page.id}/edit`);
  }

  fetchPagesAndCategories() {
    this.pageService.listPages().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.pages = results;
        // this.pageCategories = this.pages.map(x => x.page_category);
        this.yourPages = this.pages.filter((val) => {
          if (val.creator.id === this.authService.retrieveUserSession().id) {
            return val;
          }
        });
        
        // ?
        this.pages.forEach((page) => {
          if (page.categories.filter(x => x.id === this.pageService.featuredCategoryId).length > 0 && page) {
            this.featuredPages.push(page);
          } else if (page.categories.filter(x => x.id === this.pageService.policiesCategoryId).length > 0) {
            this.policyPages.push(page);
          } else if (page.categories.filter(x => x.id === this.pageService.guidesCategoryId).length > 0) {
            this.guidePages.push(page);
          } else {
            this.otherPages.push(page);
          }
        });

        // stop the spinner
        this.spinnerService.spin(false);
        this.initialDataLoaded = true;

        // debug logging
        console.log(this.pages);
        console.log(this.pageCategories);
      }
    });
  }

  searchItems() {
    if (this.searchFilter && this.searchFilter.length > 3) {
      // var
      const searchText = this.searchFilter.toLowerCase();
      this.isFiltering = true;

      // search the pages and filter
      this.filteredPages = this.pages.filter(x => 
        x.title.toLowerCase().includes(searchText.toLowerCase()) ||
        x.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
        x.content.toLowerCase().includes(searchText.toLowerCase())
      );

      this.isFiltering = false;
    }
  }

  onSearchKeyUp(){
    this.searchSubject.next();
  }  

  ngOnInit() {
    this.spinnerService.spin(true);
    this.fetchPagesAndCategories();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.searchItems();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
