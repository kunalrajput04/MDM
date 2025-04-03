import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmeterComponent } from './newmeter.component';

describe('NewmeterComponent', () => {
  let component: NewmeterComponent;
  let fixture: ComponentFixture<NewmeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewmeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
