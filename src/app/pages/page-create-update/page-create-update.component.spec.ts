import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateUpdateComponent } from './page-create-update.component';

describe('PageCreateUpdateComponent', () => {
  let component: PageCreateUpdateComponent;
  let fixture: ComponentFixture<PageCreateUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCreateUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
