import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturepurchaseComponent } from './facturepurchase.component';

describe('FacturepurchaseComponent', () => {
  let component: FacturepurchaseComponent;
  let fixture: ComponentFixture<FacturepurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturepurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
