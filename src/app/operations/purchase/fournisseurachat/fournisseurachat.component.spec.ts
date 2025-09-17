import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurachatComponent } from './fournisseurachat.component';

describe('FournisseurachatComponent', () => {
  let component: FournisseurachatComponent;
  let fixture: ComponentFixture<FournisseurachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FournisseurachatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FournisseurachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
