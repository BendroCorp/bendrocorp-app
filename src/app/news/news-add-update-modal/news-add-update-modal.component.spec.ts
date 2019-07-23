import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAddUpdateModalComponent } from './news-add-update-modal.component';

describe('NewsAddUpdateModalComponent', () => {
  let component: NewsAddUpdateModalComponent;
  let fixture: ComponentFixture<NewsAddUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsAddUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAddUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
