import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoTable } from './producao-table';

describe('ProducaoTable', () => {
  let component: ProducaoTable;
  let fixture: ComponentFixture<ProducaoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducaoTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProducaoTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
