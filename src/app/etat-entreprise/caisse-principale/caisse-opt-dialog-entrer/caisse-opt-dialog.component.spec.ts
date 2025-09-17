import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseOptDialogComponent } from './caisse-opt-dialog.component';

describe('CaisseOptDialogComponent', () => {
  let component: CaisseOptDialogComponent;
  let fixture: ComponentFixture<CaisseOptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaisseOptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseOptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
