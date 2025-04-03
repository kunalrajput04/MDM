import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardenergyComponent } from './dashboardenergy.component';

describe('DashboardenergyComponent', () => {
  let component: DashboardenergyComponent;
  let fixture: ComponentFixture<DashboardenergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardenergyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardenergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
