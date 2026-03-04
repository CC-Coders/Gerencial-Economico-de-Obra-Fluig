import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Producao } from './producao';

describe('Producao', () => {
  let component: Producao;
  let fixture: ComponentFixture<Producao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Producao],
    }).compileComponents();

    fixture = TestBed.createComponent(Producao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
