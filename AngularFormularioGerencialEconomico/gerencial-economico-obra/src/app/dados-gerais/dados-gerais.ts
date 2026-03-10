import { Component } from '@angular/core';
import { Card } from '../card/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FluigForm } from '../fluig.service.ts/fluigForm.service';
import { DadosGeraisService } from './dados-gerais.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dados-gerais',
  imports: [Card, MatIconModule, CurrencyPipe, FormsModule],
  templateUrl: './dados-gerais.html',
  styleUrl: './dados-gerais.css',
})
export class DadosGerais {
  constructor(
    private fluigForm: FluigForm,
    private dadosGeraisService: DadosGeraisService,
  ) {
    this.CODCOLIGADA = parseInt(this.fluigForm.getValue('CODCOLIGADA')) || null;
    this.CODCCUSSTO = this.fluigForm.getValue('CODCCUSTO') || null;
    this.IDPRJ = parseInt(this.fluigForm.getValue('IDPRJ')) || null;
    this.IDPERIODO = parseInt(this.fluigForm.getValue('IDPERIODO')) || null;
  }

  CODCOLIGADA: number | null = null;
  CODCCUSSTO: string | null = null;
  IDPRJ: number | null = null;
  IDPERIODO: number | null = null;

  get backlog() {
    return this.dadosGeraisService.backlog();
  }
  get atividade() {
    return this.fluigForm.WKNumState;
  }

  aprovar() {
    this.fluigForm.setValue('decisao', 'Aprovar');
    (parent as any).$('.workflow-actions').find('[data-send]').click();
  }
  reprovar() {
    this.fluigForm.setValue('decisao', 'Reprovar');
    (parent as any).$('.workflow-actions').find('[data-send]').click();
  }
  saveFormField(event: Event, target: string) {
    var value = (event.target as HTMLInputElement).value;
    this.fluigForm.setValue(target, value);
  }
}
