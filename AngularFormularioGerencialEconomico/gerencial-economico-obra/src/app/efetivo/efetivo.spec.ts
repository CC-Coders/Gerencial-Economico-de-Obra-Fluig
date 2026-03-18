import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Efetivo } from './efetivo';

describe('Efetivo', () => {
  let component: Efetivo;
  let fixture: ComponentFixture<Efetivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Efetivo],
    }).compileComponents();

    fixture = TestBed.createComponent(Efetivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
