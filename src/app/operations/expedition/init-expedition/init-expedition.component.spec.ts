import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitExpeditionComponent } from './init-expedition.component';

describe('InitExpeditionComponent', () => {
  let component: InitExpeditionComponent;
  let fixture: ComponentFixture<InitExpeditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitExpeditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitExpeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
