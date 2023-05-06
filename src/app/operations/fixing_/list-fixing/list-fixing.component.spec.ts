import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFixingComponent } from './list-fixing.component';

describe('ListFixingComponent', () => {
  let component: ListFixingComponent;
  let fixture: ComponentFixture<ListFixingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFixingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFixingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
