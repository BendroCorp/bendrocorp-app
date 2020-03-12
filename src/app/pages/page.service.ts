import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { Page, PageCategory } from '@bendrocorp/bendrocorp-node-sdk/models/page.model';
import { StatusMessage } from '../models/misc-models';
import { tap, catchError } from 'rxjs/operators';
import { FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { FieldService } from '../misc/field.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly pageCategoryFieldId = '95ba5b0c-cbfb-4fe7-ab39-75010a30b20f';

  // category id constants
  readonly featuredCategoryId = '951513f7-2d16-4234-a26a-aa521169b1e2';
  readonly guidesCategoryId = 'b8bdff1d-237e-4812-9e2d-ef33cc2bd76d';
  readonly policiesCategoryId = 'f9b194cc-7ec3-48d5-93b9-467a6227823e';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private errorService: ErrorService,
    private fieldService: FieldService,
    private globals: Globals
  ) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Jobs service data refresh called!");    
    this.dataRefreshSource.next();
  }

  listPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.globals.baseUrl}/pages`).pipe(
      tap(results => console.log(`Fetched ${results.length} pages`)),
      catchError(this.errorService.handleError('Fetch Pages', []))
    );
  }

  pageSearch(uuidSegment: string): Observable<Page[]> {
    return this.http.get<Page>(`${this.globals.baseUrl}/pages/search/${uuidSegment}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Page Search'))
    );
  }

  fetchPage(pageId: string): Observable<Page> {
    return this.http.get<Page>(`${this.globals.baseUrl}/pages/${pageId}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Page'))
    );
  }

  createPage(page: Page): Observable<Page> {
    return this.http.post<Page>(`${this.globals.baseUrl}/pages/`, { page }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Page'))
    );
  }

  updatePage(page: Page): Observable<Page> {
    return this.http.put<Page>(`${this.globals.baseUrl}/pages/`, { page }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Page'))
    );
  }

  archivePage(page: Page): Observable<StatusMessage> {
    return this.http.delete<Page>(`${this.globals.baseUrl}/pages/${page.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Page'))
    );
  }

  // publishPage(page: Page): Observable<StatusMessage> {
  //   return this.http.post<Page>(`${this.globals.baseUrl}/pages/`, { page }).pipe(
  //     tap(results => console.log(results)),
  //     catchError(this.errorService.handleError<any>('Publish Page'))
  //   );
  // }

  // unPublishPage(page: Page): Observable<StatusMessage> {
  //   return this.http.post<Page>(`${this.globals.baseUrl}/pages/`, { page }).pipe(
  //     tap(results => console.log(results)),
  //     catchError(this.errorService.handleError<any>('Un-Publish Page'))
  //   );
  // }

  listPageCategories(): Observable<FieldDescriptor[]> {
    // return this.http.get<PageCategory[]>(`${this.globals.baseUrl}/pages/category`).pipe(
    //   tap(results => console.log(`Fetched ${results.length} page categories`)),
    //   catchError(this.errorService.handleError('Fetch Page Categories', []))
    // );
    return this.fieldService.getField(this.pageCategoryFieldId);
  }

  // createCategory(page_category: PageCategory): Observable<PageCategory> {
  //   return this.http.post<PageCategory>(`${this.globals.baseUrl}/pages/category`, { page_category }).pipe(
  //     tap(results => console.log(results)),
  //     catchError(this.errorService.handleError<any>('Create Page Category'))
  //   );
  // }

  // updateCategory(page_category: PageCategory): Observable<PageCategory> {
  //   return this.http.put<PageCategory>(`${this.globals.baseUrl}/pages/category`, { page_category }).pipe(
  //     tap(results => console.log(results)),
  //     catchError(this.errorService.handleError<any>('Update Page Category'))
  //   );
  // }

  // archiveCategory(page_category: PageCategory): Observable<StatusMessage> {
  //   return this.http.delete<PageCategory>(`${this.globals.baseUrl}/pages/category/${page_category.id}`).pipe(
  //     tap(results => console.log(results)),
  //     catchError(this.errorService.handleError<any>('Archive Page Category'))
  //   );
  // }
}
