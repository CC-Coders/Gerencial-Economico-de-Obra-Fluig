import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasEconomicas } from './despesas-economicas';

describe('DespesasEconomicas', () => {
  let component: DespesasEconomicas;
  let fixture: ComponentFixture<DespesasEconomicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespesasEconomicas],
    }).compileComponents();

    fixture = TestBed.createComponent(DespesasEconomicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
