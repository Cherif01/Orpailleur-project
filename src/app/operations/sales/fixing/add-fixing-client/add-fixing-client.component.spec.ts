import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFixingClientComponent } from './add-fixing-client.component';

describe('AddFixingClientComponent', () => {
  let component: AddFixingClientComponent;
  let fixture: ComponentFixture<AddFixingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFixingClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFixingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
