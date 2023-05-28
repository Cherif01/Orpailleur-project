import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportCaisseComponent } from './rapport-caisse.component';

describe('RapportCaisseComponent', () => {
  let component: RapportCaisseComponent;
  let fixture: ComponentFixture<RapportCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportCaisseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
