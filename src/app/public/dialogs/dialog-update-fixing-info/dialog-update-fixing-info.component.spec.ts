import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateFixingInfoComponent } from './dialog-update-fixing-info.component';

describe('DialogUpdateFixingInfoComponent', () => {
  let component: DialogUpdateFixingInfoComponent;
  let fixture: ComponentFixture<DialogUpdateFixingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateFixingInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUpdateFixingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
