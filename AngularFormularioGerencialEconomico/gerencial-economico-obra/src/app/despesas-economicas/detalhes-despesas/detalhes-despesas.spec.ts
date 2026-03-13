import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesDespesas } from './detalhes-despesas';

describe('DetalhesDespesas', () => {
  let component: DetalhesDespesas;
  let fixture: ComponentFixture<DetalhesDespesas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesDespesas],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesDespesas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
