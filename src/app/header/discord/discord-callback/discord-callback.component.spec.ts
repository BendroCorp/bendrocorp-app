import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordCallbackComponent } from './discord-callback.component';

describe('DiscordCallbackComponent', () => {
  let component: DiscordCallbackComponent;
  let fixture: ComponentFixture<DiscordCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscordCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscordCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
