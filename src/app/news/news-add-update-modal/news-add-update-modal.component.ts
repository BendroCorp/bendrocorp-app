import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ILNewsStory } from 'src/app/models/news.model';
import { NewsService } from '../news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'news-add-update-modal',
  templateUrl: './news-add-update-modal.component.html',
  styleUrls: ['./news-add-update-modal.component.css']
})
export class NewsAddUpdateModalComponent implements OnInit {
  @Input() newsArticle: ILNewsStory;
  formAction: string;
  modalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private newsService: NewsService) {}

  addUpdateNewsArticle() {
    if (this.newsArticle && this.newsArticle.id) {
      this.newsService.update(this.newsArticle).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.newsService.refreshData();
          this.close();
        }
      });
    } else {
      this.newsService.create(this.newsArticle).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.newsService.refreshData();
          this.close();
        }
      });
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  open(content) {
    this.modalRef =  this.modalService.open(content, {ariaLabelledBy: 'Add Update News Modal'});
  }

  ngOnInit() {
    if (this.newsArticle && this.newsArticle.id) {
      this.formAction = 'Update';
    } else {
      this.formAction = 'Create';
      this.newsArticle = {} as ILNewsStory;
    }
  }

}
