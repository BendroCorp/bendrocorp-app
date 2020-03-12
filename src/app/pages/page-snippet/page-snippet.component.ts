import { Component, OnInit, Input } from '@angular/core';
import { Page } from '@bendrocorp/bendrocorp-node-sdk';

@Component({
  selector: 'page-snippet',
  templateUrl: './page-snippet.component.html',
  styleUrls: ['./page-snippet.component.css']
})
export class PageSnippetComponent implements OnInit {
  @Input() page:any //Page
  constructor() { }

  ngOnInit() {
  }

}
