import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetersummeryComponent } from './metersummery.component';

describe('MetersummeryComponent', () => {
  let component: MetersummeryComponent;
  let fixture: ComponentFixture<MetersummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetersummeryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetersummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
