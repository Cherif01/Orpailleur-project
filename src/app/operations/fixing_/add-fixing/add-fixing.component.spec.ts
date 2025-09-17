import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFixingComponent } from './add-fixing.component';

describe('AddFixingComponent', () => {
  let component: AddFixingComponent;
  let fixture: ComponentFixture<AddFixingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFixingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFixingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
