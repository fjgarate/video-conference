import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitVideoconferenceComponent } from './init-videoconference.component';

describe('InitVideoconferenceComponent', () => {
  let component: InitVideoconferenceComponent;
  let fixture: ComponentFixture<InitVideoconferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitVideoconferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitVideoconferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
