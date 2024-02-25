import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingClientDialogComponent } from './fixing-client-dialog.component';

describe('FixingClientDialogComponent', () => {
  let component: FixingClientDialogComponent;
  let fixture: ComponentFixture<FixingClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixingClientDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixingClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
