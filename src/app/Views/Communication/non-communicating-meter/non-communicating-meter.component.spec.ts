import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonCommunicatingMeterComponent } from './non-communicating-meter.component';

describe('NonCommunicatingMeterComponent', () => {
  let component: NonCommunicatingMeterComponent;
  let fixture: ComponentFixture<NonCommunicatingMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonCommunicatingMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonCommunicatingMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
