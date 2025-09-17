import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrerCaisseComponent } from './entrer-caisse.component';

describe('EntrerCaisseComponent', () => {
  let component: EntrerCaisseComponent;
  let fixture: ComponentFixture<EntrerCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrerCaisseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrerCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
