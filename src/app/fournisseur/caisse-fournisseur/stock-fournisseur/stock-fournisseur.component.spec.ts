import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockFournisseurComponent } from './stock-fournisseur.component';

describe('StockFournisseurComponent', () => {
  let component: StockFournisseurComponent;
  let fixture: ComponentFixture<StockFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockFournisseurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
