import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatasetFactory } from '../../fluigDatasets';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";



export interface tarefaInteface {
  cod_tarefa: string;
  descricao_tarefa: string;
  un_tarefa: string;
  quantidade_medida_tarefa: number|string|null;
  valor_unitario_tarefa: number;
  valor_realizado_tarefa: number;
}

const tarefas_data: tarefaInteface[] = [];

@Component({
  selector: 'app-producao',
  imports: [MatIconModule, MatTableModule,CurrencyPipe,FormsModule,CurrencyMaskModule],
  templateUrl: './producao.html',
  styleUrl: './producao.css',
})
export class Producao {
  displayedColumns: string[] = [
    'Tarefa',
    'descricao_tarefa',
    'un_tarefa',
    'quantidade_medida_tarefa',
    'valor_unitario_tarefa',
    'valor_realizado_tarefa',
  ];
  dataSource = signal<tarefaInteface[]>([]);
  DatasetFactory = new DatasetFactory(
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MjY2ODUyMSwiaWF0IjoxNzcyNjU0MTIxLCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.YFpS9zWqGTE7FmbNCtI5O8nUUuCs-AhBGzNyJUJEjGuv1XMeTROtocVj8BOro6IXUaZKJQoABDqMinaVY_NxUwWeEius1m12plgkP8Vzx6nFcW7IVuShRIFwODGsApdGzYx4i-gnR28ZeuAcYKvlCWtwkICmH_NAboK6AmBfJJKd5XWCHDk597X0NsGZjLG-MseQJ-Ao8f6RW0H3JzmBwG5LzPUlOVYYHbh3tQqywzNKmeaJ8tnjiicegN8YDECo-d2IP3tjMFCBJvCJDMR5GyyEJ8dl6mCYWtB4T-IbYmLqNNQeTRIR6oekJ2nFvHEX71fX7uySlzAJZ1ppcja6Jg',
  );

  

  async loadProducao() {
    var planilhaTarefas = await this.getPlanilhaDeTarefas();
    var newElement: tarefaInteface[] = [];

    for (const tarefas of planilhaTarefas) {
      newElement.push({
        cod_tarefa: tarefas.cod_tarefa,
        descricao_tarefa: tarefas.des_tarefa,
        un_tarefa: tarefas.cod_unidade,
        quantidade_medida_tarefa: null,
        valor_unitario_tarefa: tarefas.vlr_unitario_item,
        valor_realizado_tarefa: 0,
      });
    }

    this.dataSource.set(newElement);
  }
  async getPlanilhaDeTarefas() {
    var ds = await this.DatasetFactory.getDataset(
      'dsConsultaPlanilhaDeTarefasGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint(
          'CODCOLIGADA',
          '1',
          '1',
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
        DatasetFactory.createConstraint(
          'IDPRJ',
          '7090',
          '7090',
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
      ],
      [],
    );

    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      return JSON.parse(ds.values[0].RESULT);
    }
  }
  getValorTotal(){
    var total = 0;
    for (const tarefa of this.dataSource()) {
      total += (Number(tarefa.quantidade_medida_tarefa) * tarefa.valor_unitario_tarefa);
    }
    return total;
  }
}
