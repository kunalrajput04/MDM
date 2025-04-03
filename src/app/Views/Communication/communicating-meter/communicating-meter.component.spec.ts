import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatingMeterComponent } from './communicating-meter.component';

describe('CommunicatingMeterComponent', () => {
  let component: CommunicatingMeterComponent;
  let fixture: ComponentFixture<CommunicatingMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicatingMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicatingMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
