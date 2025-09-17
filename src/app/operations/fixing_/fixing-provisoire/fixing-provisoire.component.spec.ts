import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingProvisoireComponent } from './fixing-provisoire.component';

describe('FixingProvisoireComponent', () => {
  let component: FixingProvisoireComponent;
  let fixture: ComponentFixture<FixingProvisoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixingProvisoireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixingProvisoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
