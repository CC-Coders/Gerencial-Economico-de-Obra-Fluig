import { Component, Input, computed } from '@angular/core';
import { tarefaInteface } from '../producao/tarefa.inteface';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-producao-table',
  imports: [FormsModule, CurrencyPipe, CurrencyMaskModule, MatIconModule],
  templateUrl: './producao-table.html',
  styleUrl: './producao-table.css',
})
export class ProducaoTable {
  @Input({ required: true }) tarefas!: tarefaInteface[];
  @Input({ required: true }) cod_tarefa!: string;
  @Input({ required: true }) des_tarefa!: string;
  showBody = false;

  get totalTarefas() {
    let total = 0;

    for (const tarefa of this.tarefas) {
      total += (tarefa.quantidade_medida_tarefa || 0) * tarefa.valor_unitario_tarefa;
    }

    return total;
  }

  get tarefasApontadas(){
    var counter = 0;
    for (const tarefa of this.tarefas) {
      if (tarefa.quantidade_medida_tarefa) {
        counter++;
      }
    }
    return counter;
  }
  get tarefasPendentes(){
    var counter = 0;
    for (const tarefa of this.tarefas) {
      if (!tarefa.quantidade_medida_tarefa) {
        counter++;
      }
    }
    return counter;
  }

  toggleShowBody() {
    this.showBody = !this.showBody;
  }

  changeValue() {
    console.log(this.tarefas);
  }
}
