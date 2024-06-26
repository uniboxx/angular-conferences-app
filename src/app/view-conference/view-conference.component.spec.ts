import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConferenceComponent } from './view-conference.component';

describe('ViewConferenceComponent', () => {
  let component: ViewConferenceComponent;
  let fixture: ComponentFixture<ViewConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
