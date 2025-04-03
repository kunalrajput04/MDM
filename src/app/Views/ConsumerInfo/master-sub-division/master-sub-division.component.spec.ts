import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSubDivisionComponent } from './master-sub-division.component';

describe('MasterSubDivisionComponent', () => {
  let component: MasterSubDivisionComponent;
  let fixture: ComponentFixture<MasterSubDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSubDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSubDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
