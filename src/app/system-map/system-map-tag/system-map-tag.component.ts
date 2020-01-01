import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'system-map-tag',
  templateUrl: './system-map-tag.component.html',
  styleUrls: ['./system-map-tag.component.css']
})
export class SystemMapTagComponent {
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
}
