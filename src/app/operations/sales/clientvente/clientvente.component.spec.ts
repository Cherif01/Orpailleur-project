import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientventeComponent } from './clientvente.component';

describe('ClientventeComponent', () => {
  let component: ClientventeComponent;
  let fixture: ComponentFixture<ClientventeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientventeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientventeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
