import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatasetFactory } from '../../fluigDatasets';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FluigTable } from '../fluig-table/fluig-table';
import { tarefaInteface } from './tarefa.inteface';

const tarefas_data: tarefaInteface[] = [];

@Component({
  selector: 'app-producao',
  imports: [
    MatIconModule,
    MatTableModule,
    CurrencyPipe,
    FormsModule,
    CurrencyMaskModule,
    FluigTable,
  ],
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
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3Mjc1NTUxNCwiaWF0IjoxNzcyNzQxMTE0LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.EUydYtn-CN5YexH7283wHOf5_ajnZODEbh0T2qJIoT5lKliKRzhAGXhdFtwdGjEt6pbWU8apMnRQ9J3PB2iYQPVu4FouZqvYD2f381lcBC4t0odoTWSqNBq0dZfUpiz0tMs21Y-MgN8o14B6llHCrVbDaDERgHL9U8HLwgCyVuNnU50WRw3vPRTUzw7-i_4ysFYcZtFWZtShZ5PaKdx1xKTdv2zn9XlTZr_8X8skCRULkWf_T3-aYxkpivyyAhHS69iRZq8AHylGidgT2YjNJH09FKpUqCzrO1wEhKr6pGzrGdbxE9SIyjha8RzgaYFO5TYNSuUdk9Ksmq9j9n_f4w',
  );
  tablename = 'tableProducao';

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
  getValorTotal() {
    var total = 0;
    for (const tarefa of this.dataSource()) {
      total += Number(tarefa.quantidade_medida_tarefa) * tarefa.valor_unitario_tarefa;
    }
    return total;
  }
  updatePaiFilho() {
    var table = $('#' + this.tablename);
    var trList = $(table).find('tbody>tr:not(:first)');
    var dataSource = this.dataSource();
    var dataSourceLength = this.dataSource().length;

    console.log('Update');
    var tableLength = table.find('tbody>tr:not(:first)').length;
    console.log(tableLength, dataSourceLength, tableLength > dataSourceLength);
    
    while (table.find('tbody>tr:not(:first)').length != dataSourceLength) {
      console.log(tableLength, dataSourceLength, tableLength > dataSourceLength);
      
      var tableLength = table.find('tbody>tr:not(:first)').length;
      if (tableLength > dataSource.length) {
        fnWdkRemoveChild(table.find('tbody>tr:not(:first):last'));
      } else {
        wdkAddChild(table);
      }
    }

    var counter = 0;
    var trList = $(table).find('tbody>tr:not(:first)');
    for (const row of dataSource) {
      var tr = trList[counter];
      console.log(tr)
      console.log(row)
      $(tr).find(".CODTAREFA").val(row.cod_tarefa);
      $(tr).find(".DESCRICAO").val(row.descricao_tarefa);
      $(tr).find(".UN").val(row.un_tarefa);
      $(tr).find(".QUANTIDADE").val(row.quantidade_medida_tarefa || 0);
      $(tr).find(".VALOR_UNIDADE").val(row.valor_unitario_tarefa);
      $(tr).find(".VALOR_TOTAL").val(row.quantidade_medida_tarefa ||0 * row.valor_unitario_tarefa);
      counter++;
    }

  }
}

function fnWdkRemoveChild(tr: any) {
  console.log($(tr).find(".fluigicon"));
  $(tr).find(".fluigicon").trigger("click");
}
function wdkAddChild(table: any) {
  console.log($(table).closest("table").find("button[value='Novo Registro']"))
    $(table).closest("table.table").find("tbody>tr:first>td:first>input").trigger("click");
}
