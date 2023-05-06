import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingClientComponent } from './fixing-client.component';

describe('FixingClientComponent', () => {
  let component: FixingClientComponent;
  let fixture: ComponentFixture<FixingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixingClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
