import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from './news.service';
import { MessageService } from '../message/message.service';
import { ILNewsStory } from '../models/news.model';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {
  newsArticles: ILNewsStory[] = [];
  isAdmin: boolean = this.authService.hasClaim(44);

  articleSubscription: Subscription

  constructor(
    private authService: AuthService,
    private newsService: NewsService, 
    private messageService: MessageService, 
    private spinnerService: SpinnerService) {
      this.articleSubscription = this.newsService.dataRefreshAnnounced$.subscribe(() => {
        this.fetchNews();
      });
    }
  
  fetchNews() {
    this.newsService.list().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.newsArticles = results;
      }
      this.spinnerService.spin(false);
    });
  }

  ngOnInit() {
    this.spinnerService.spin(true);
    this.fetchNews();
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
