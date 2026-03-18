import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasIndiretas } from './despesas-indiretas';

describe('DespesasIndiretas', () => {
  let component: DespesasIndiretas;
  let fixture: ComponentFixture<DespesasIndiretas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespesasIndiretas],
    }).compileComponents();

    fixture = TestBed.createComponent(DespesasIndiretas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
