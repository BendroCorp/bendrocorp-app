import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../news.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { ILNewsStory } from 'src/app/models/news.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  article: ILNewsStory;
  articleSubscription: Subscription;
  articleId: string = this.route.snapshot.paramMap.get('news_id');
  isAdmin: boolean = this.authService.hasClaim(44);

  constructor(
    private authService: AuthService, 
    private newsService: NewsService, 
    private spinnerService: SpinnerService, 
    private router: Router,
    private route: ActivatedRoute) { }

  getArticle() {
    this.newsService.fetch(this.articleId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.article = results;
      } else {
        this.router.navigateByUrl('/news')
      }
      this.spinnerService.spin(false);
    });
  }

  ngOnInit() {
    this.spinnerService.spin(true);
    this.getArticle();
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
