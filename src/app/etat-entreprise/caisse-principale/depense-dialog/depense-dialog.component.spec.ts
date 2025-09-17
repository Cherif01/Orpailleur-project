import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseDialogComponent } from './depense-dialog.component';

describe('DepenseDialogComponent', () => {
  let component: DepenseDialogComponent;
  let fixture: ComponentFixture<DepenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepenseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
