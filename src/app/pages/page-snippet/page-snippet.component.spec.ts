import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSnippetComponent } from './page-snippet.component';

describe('PageSnippetComponent', () => {
  let component: PageSnippetComponent;
  let fixture: ComponentFixture<PageSnippetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSnippetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
