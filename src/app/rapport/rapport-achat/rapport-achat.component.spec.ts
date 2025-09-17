import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportAchatComponent } from './rapport-achat.component';

describe('RapportAchatComponent', () => {
  let component: RapportAchatComponent;
  let fixture: ComponentFixture<RapportAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportAchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
