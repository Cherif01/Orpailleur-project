import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationFournisseurComponent } from './situation-fournisseur.component';

describe('SituationFournisseurComponent', () => {
  let component: SituationFournisseurComponent;
  let fixture: ComponentFixture<SituationFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituationFournisseurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
