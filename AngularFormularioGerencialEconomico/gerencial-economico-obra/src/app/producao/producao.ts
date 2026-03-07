import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatasetFactory } from '../../fluigDatasets';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FluigTable } from '../fluig-table/fluig-table';
import { type tarefaInteface } from './tarefa.inteface';
import { type grupoTarefa } from './grupo-tarefa.inteface';
import {ProducaoTable} from "../producao-table/producao-table"

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
    ProducaoTable,
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
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MjkyMzQ2NCwiaWF0IjoxNzcyOTA5MDY0LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.LUL_Y1P5K5d8YtNuKiQQQzLCfn9NL4Te4I4BJTHFWX9mb00qXISMzkBfWMj5pT0zEg_cK_2R9phF4xjLOPgHMQBjINmIHGwK0sQWVxqLmd38Tck2LrWI3A6WetNdqb-ex8yNj8t7yQY2rp5VNwihvq_swQzvpEt9i6LSxZFVDELXHiYg94Bycr7EJKSz6FJ-_1IwpcF1c3RIe0YiaAGSg07aYRuMpU6OxTKz1eGkzOERWGdt1i_dpqtPCjSM1VP3xom9tU0_51WghV2rYrYY_PIZte-bWNnOJSrxDG_5BR2VP6cAbmO-dWSunmFoIlw9LC_cCUppA6JvpI6CUg7ckA',
  );
  tablename = 'tableProducao';
  grupoTarefas = signal<grupoTarefa>({
        cod_tarefa: '001',
        nivel: '1',
        id_tarefa: 1,
        descricao_tarefa: 'pai',
        filhos: [],
        tarefas: [],
      });

  async loadProducao() {
    var grupos = await getGruposTarefas('1', '7090', this.DatasetFactory);
    var gruposTarefas = loadGruposTarefas(grupos);

    var tarefas = await  getTarefas(this.DatasetFactory);

    for (const tarefa of tarefas) {
      var pai = gruposTarefas;
      var NIVEIS = tarefa.cod_tarefa.split(".");
      NIVEIS.shift();
      console.log(NIVEIS);

      var NIVEL = NIVEIS[0];
      var found = pai.filhos.find((e) => e.nivel == NIVEL);
      if (found) {
          found.tarefas.push(tarefa);
      }

    }

    console.log(gruposTarefas);
    this.grupoTarefas.set(gruposTarefas);



    // Grupos de Tarefas

    function loadGruposTarefas(grupos: any) {
      var newgrupoTarefas = <grupoTarefa>{
        cod_tarefa: '001',
        nivel: '1',
        id_tarefa: 1,
        descricao_tarefa: 'pai',
        filhos: [],
        tarefas: [],
      };
      for (const grupo of grupos) {
        var NIVEIS = grupo.CODTRF.split('.');
        NIVEIS.shift();

        var grupoObj = {
          cod_tarefa: grupo.CODTRF,
          nivel: NIVEIS[NIVEIS.length - 1],
          descricao_tarefa: grupo.NOMETAREFA,
          filhos: [],
          tarefas: [],
          id_tarefa: grupo.IDTRF,
        };
        var pai = newgrupoTarefas;
        while (NIVEIS.length > 1) {
          var found = pai.filhos.find((e) => e.nivel == NIVEIS[0]);
          if (found) {
            pai = found;
          }
          NIVEIS.shift();
        }

        if (pai) {
          pai?.filhos.push(grupoObj);
        }
      }

      return newgrupoTarefas;
    }
    async function getGruposTarefas(
      CODCOLIGADA: string,
      IDPRJ: string,
      datasetFactory: DatasetFactory,
    ) {
      var ds = await datasetFactory.getDataset(
        'dsConsultaGruposTarefasGerencialEconomico',
        [],
        [
          DatasetFactory.createConstraint(
            'CODCOLIGADA',
            CODCOLIGADA,
            CODCOLIGADA,
            DatasetFactory.ConstraintType.MUST,
            null,
          ),
          DatasetFactory.createConstraint(
            'IDPRJ',
            IDPRJ,
            IDPRJ,
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

    // Tarefas
    async function getTarefas(datasetFactory: DatasetFactory) {
      var planilhaTarefas = await getPlanilhaDeTarefas('1', '7090', datasetFactory);
      console.log(planilhaTarefas);
      var newElement: tarefaInteface[] = [];

      for (const tarefas of planilhaTarefas) {
        newElement.push({
          id_tarefa: tarefas.id_tarefa,
          cod_tarefa: tarefas.cod_tarefa,
          descricao_tarefa: tarefas.des_tarefa,
          un_tarefa: tarefas.cod_unidade,
          quantidade_medida_tarefa: null,
          valor_unitario_tarefa: tarefas.vlr_unitario_item,
          valor_realizado_tarefa: 0,
        });
      }

      // this.dataSource.set(newElement);
      return newElement;
    }
    async function getPlanilhaDeTarefas(
      CODCOLIGADA: string,
      IDPRJ: string,
      datasetFactory: DatasetFactory,
    ) {
      var ds = await datasetFactory.getDataset(
        'dsConsultaPlanilhaDeTarefasGerencialEconomico',
        [],
        [
          DatasetFactory.createConstraint(
            'CODCOLIGADA',
            CODCOLIGADA,
            CODCOLIGADA,
            DatasetFactory.ConstraintType.MUST,
            null,
          ),
          DatasetFactory.createConstraint(
            'IDPRJ',
            IDPRJ,
            IDPRJ,
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
  }
  get ValorTotal() {
    var total = 0;
    for (const grupo of this.grupoTarefas().filhos) {
      for (const tarefa of grupo.tarefas) {
        total += Number(tarefa.quantidade_medida_tarefa) * tarefa.valor_unitario_tarefa;
      }
    }
    return total;
  }
  updatePaiFilho() {
    var table = $('#' + this.tablename);
    var trList = $(table).find('tbody>tr:not(:first)');
    var dataSource = this.dataSource();
    var dataSourceLength = this.dataSource().length;

    var tableLength = table.find('tbody>tr:not(:first)').length;

    var tries = 500;
    while (table.find('tbody>tr:not(:first)').length != dataSourceLength && tries > 0) {
      var tableLength = table.find('tbody>tr:not(:first)').length;
      if (tableLength > dataSource.length) {
        fnWdkRemoveChild(table.find('tbody>tr:not(:first):last'));
      } else {
        wdkAddChild(table);
      }
      tries--;
    }

    var counter = 0;
    var trList = $(table).find('tbody>tr:not(:first)');
    for (const row of dataSource) {
      var tr = trList[counter];
      console.log(tr);
      console.log(row);
      $(tr).find('.IDTRF').val(row.id_tarefa);
      $(tr).find('.CODTAREFA').val(row.cod_tarefa);
      $(tr).find('.DESCRICAO').val(row.descricao_tarefa);
      $(tr).find('.UN').val(row.un_tarefa);
      $(tr)
        .find('.QUANTIDADE')
        .val(row.quantidade_medida_tarefa || 0);
      $(tr).find('.VALOR_UNIDADE').val(row.valor_unitario_tarefa);
      $(tr)
        .find('.VALOR_TOTAL')
        .val((row.quantidade_medida_tarefa || 0) * row.valor_unitario_tarefa);
      counter++;
    }
  }
}

function fnWdkRemoveChild(tr: any) {
  $(tr).find('.fluigicon').trigger('click');
}
function wdkAddChild(table: any) {
  $(table).closest('table.table').find('tbody>tr:first>td:first>input').trigger('click');
}
