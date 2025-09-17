import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureventeComponent } from './facturevente.component';

describe('FactureventeComponent', () => {
  let component: FactureventeComponent;
  let fixture: ComponentFixture<FactureventeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureventeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureventeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
