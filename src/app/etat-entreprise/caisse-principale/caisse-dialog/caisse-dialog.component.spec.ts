import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseDialogComponent } from './caisse-dialog.component';

describe('CaisseDialogComponent', () => {
  let component: CaisseDialogComponent;
  let fixture: ComponentFixture<CaisseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaisseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
