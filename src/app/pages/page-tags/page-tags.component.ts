import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'page-tags',
  templateUrl: './page-tags.component.html',
  styleUrls: ['./page-tags.component.css']
})
export class PageTagsComponent implements OnInit {
  // input is a comma seperated list of tags
  @Input() tags: string;

  constructor() { }  

  parsedTags() {
    if (this.tags) {
      let tagArray = this.tags.split(',');
      // trim the array items
      for (let index = 0; index < tagArray.length; index++) {
        tagArray[index] = tagArray[index].trim();
      }
      // console.log('tags');
      // console.log(this.tagArray);
      return tagArray;
    }
  }

  ngOnInit() {
  }

}
