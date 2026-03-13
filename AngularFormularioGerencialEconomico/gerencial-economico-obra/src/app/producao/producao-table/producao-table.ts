import { Component, Input, signal, computed } from '@angular/core';
import { TarefasInterface, GruposTarefasInterface } from '../tarefas.interface';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FluigForm } from '../../fluig.service.ts/fluigForm.service';
import { ProducaoService } from '../producao.service';

@Component({
  selector: 'app-producao-table',
  imports: [CurrencyPipe, FormsModule, MatIconModule, CurrencyMaskModule],
  templateUrl: './producao-table.html',
  styleUrl: './producao-table.css',
})
export class ProducaoTable {
  constructor(
    private fluigForm: FluigForm,
    private producaoService: ProducaoService,
  ) {}

  @Input({ required: true }) grupo!: GruposTarefasInterface;

  shown = false;

  tarefas = computed(() => {
    const tarefas = this.producaoService.tarefas();
    const grupoId = this.grupo.cod_tarefa.split(".")[1];
    console.log(tarefas)
    console.log(grupoId)

    var filteredTarefas = tarefas.filter((t) => t.cod_grupo == grupoId);
    console.log(filteredTarefas);
    return filteredTarefas;
  });

  get totalTarefas() {
    let total = 0;

    for (const tarefa of this.tarefas()) {
      total += tarefa.vlr_unitario * (tarefa.quantidade || 0);
    }

    return total;
  }
  get tarefasApontadas() {
    var counter = 0;
    for (const tarefa of this.tarefas()) {
      if (tarefa.quantidade) {
        counter++;
      }
    }
    return counter;
  }
  get tarefasPendentes() {
    var counter = 0;
    for (const tarefa of this.tarefas()) {
      if (!tarefa.quantidade) {
        counter++;
      }
    }
    return counter;
  }
  get isEditable() {
    return (
      this.fluigForm.formMode != 'VIEW' &&
      this.fluigForm.WKNumState != 0 &&
      this.fluigForm.WKNumState != 4
    );
  }

  toogleShown() {
    this.shown = !this.shown;
  }
}
