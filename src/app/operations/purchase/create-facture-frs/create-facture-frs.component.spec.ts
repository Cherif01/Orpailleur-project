import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFactureFrsComponent } from './create-facture-frs.component';

describe('CreateFactureFrsComponent', () => {
  let component: CreateFactureFrsComponent;
  let fixture: ComponentFixture<CreateFactureFrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFactureFrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFactureFrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
