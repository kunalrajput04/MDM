import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeverCommunicatingMeterComponent } from './never-communicating-meter.component';

describe('NeverCommunicatingMeterComponent', () => {
  let component: NeverCommunicatingMeterComponent;
  let fixture: ComponentFixture<NeverCommunicatingMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeverCommunicatingMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeverCommunicatingMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
