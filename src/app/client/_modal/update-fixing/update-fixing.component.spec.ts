import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFixingComponent } from './update-fixing.component';

describe('UpdateFixingComponent', () => {
  let component: UpdateFixingComponent;
  let fixture: ComponentFixture<UpdateFixingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFixingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFixingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
