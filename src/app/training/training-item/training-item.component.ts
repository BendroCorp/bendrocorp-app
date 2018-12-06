import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TrainingItem, TrainingCourse } from 'src/app/models/training-models';
import { TrainingService } from '../training.service';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'training-item',
  templateUrl: './training-item.component.html',
  styleUrls: ['./training-item.component.css']
})
export class TrainingItemComponent implements OnInit {
  @Input() trainingItem: TrainingItem
  @Input() trainingCourse: TrainingCourse
  isAdmin: boolean = this.authService.hasClaim(35)
  YoutubeVideoId: any;
  isYoutubeVideo: boolean;
  youTubeVideoLink: string;

  constructor(private trainingService: TrainingService, private authService: AuthService) { }

  parseYouTubeLink()
  {
    if (this.trainingItem.training_item_type_id == 3 && this.trainingItem.video_link) {
      var regex = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
      let result = this.trainingItem.video_link.match(regex)
      if (result[2]) {
        this.YoutubeVideoId = result[2];
        console.log(`Found youtube video ${this.YoutubeVideoId}`); //DEBUG - REMOVE THIS
        this.youTubeVideoLink = `https://www.youtube-nocookie.com/embed/${result[2]}?rel=0`
        this.isYoutubeVideo = true;
      }
    }
  }

  completeTrainingItem() {
    if (!this.userCompletedItem()) {
      this.trainingService.completeTraining(this.trainingItem).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.trainingItem.training_item_completions.push(results)
          }
        }
      )
    }
  }

  userCompletedItem() {
    if (this.trainingItem.training_item_completions) {
      const userId = this.authService.retrieveUserSession().id
      const completion = this.trainingItem.training_item_completions.find(x => x.user_id === userId && x.item_version === this.trainingCourse.version)
      if (completion) {
        if (completion.completed) {
          return 2
        } else {
          return 1
        }
      }
    }else{
      return false
    }    
  }

  ngOnInit() {
    this.parseYouTubeLink()
  }

}
