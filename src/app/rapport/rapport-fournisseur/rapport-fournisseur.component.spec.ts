import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFournisseurComponent } from './rapport-fournisseur.component';

describe('RapportFournisseurComponent', () => {
  let component: RapportFournisseurComponent;
  let fixture: ComponentFixture<RapportFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportFournisseurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
