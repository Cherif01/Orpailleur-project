import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseOptDialogSortieComponent } from './caisse-opt-dialog-sortie.component';

describe('CaisseOptDialogSortieComponent', () => {
  let component: CaisseOptDialogSortieComponent;
  let fixture: ComponentFixture<CaisseOptDialogSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaisseOptDialogSortieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseOptDialogSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
