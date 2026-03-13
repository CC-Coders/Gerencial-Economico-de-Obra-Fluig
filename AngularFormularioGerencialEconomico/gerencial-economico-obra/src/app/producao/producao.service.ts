import { Injectable, signal } from '@angular/core';
import { DatasetFactory } from '../fluig.service.ts/fluigDatasets';
import { TarefasInterface, GruposTarefasInterface } from './tarefas.interface';
import { FluigForm } from '../fluig.service.ts/fluigForm.service';

@Injectable({ providedIn: 'root' })
export class ProducaoService {
  constructor(
    private datasetFactory: DatasetFactory,
    private fluigForm: FluigForm,
  ) {}

  tarefas = signal<TarefasInterface[]>([]);
  private grupos = signal<GruposTarefasInterface[]>([]);

  public async loadData(CODCOLIGADA: number, IDPRJ: number) {
    if (this.fluigForm.WKNumState == 0) {
      this.loadGrupos(CODCOLIGADA, IDPRJ);
      this.loadTarefas(CODCOLIGADA, IDPRJ);
    } else {
      var data = this.fluigForm.getPaiFilho('tableProducao');

      var tarefas: TarefasInterface[] = [];
      for (const row of data) {
        var tarefa: TarefasInterface = {
          cod_grupo: '',
          id_tarefa: 0,
          cod_tarefa: '',
          des_tarefa: '',
          vlr_unitario: 0,
          un_medida: '',
          quantidade: 0,
          quantidade_total: 0,
        };

        for (const column of row) {
          const name = column.name as keyof TarefasInterface;

          if (name === 'id_tarefa' || name === 'vlr_unitario' || name === 'quantidade' || name === 'quantidade_total') {
            tarefa[name] = Number(column.value) as any;
          } else {
            tarefa[name] = String(column.value) as any;
          }
        }
        tarefas.push(tarefa);
      }

      this.tarefas.set(tarefas);
      console.log(this.tarefas());
      this.loadGrupos(CODCOLIGADA, IDPRJ);

    }
  }
  public async loadTarefas(CODCOLIGADA: number, IDPRJ: number) {
    var ds = await this.datasetFactory.getDataset(
      'dsConsultaPlanilhaDeTarefasGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint(
          'CODCOLIGADA',
          CODCOLIGADA.toString(),
          CODCOLIGADA.toString(),
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
        DatasetFactory.createConstraint(
          'IDPRJ',
          IDPRJ.toString(),
          IDPRJ.toString(),
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
      ],
      [],
    );

    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      console.log(JSON.parse(ds.values[0].RESULT));
      this.tarefas.set(formatTarefas(JSON.parse(ds.values[0].RESULT)));
    }

    function formatTarefas(data: any) {
      var newTarefas: TarefasInterface[] = [];
      for (const row of data) {
        newTarefas.push({
          cod_grupo: row.cod_tarefa.split('.')[1],
          id_tarefa: row.id_tarefa,
          cod_tarefa: row.cod_tarefa,
          des_tarefa: row.des_tarefa,
          quantidade: null,
          quantidade_total: row.qt_item,
          un_medida: row.cod_unidade,
          vlr_unitario: row.vlr_unitario_item,
        });
      }

      return newTarefas;
    }
  }
  public async loadGrupos(CODCOLIGADA: number, IDPRJ: number) {
    var ds = await this.datasetFactory.getDataset(
      'dsConsultaGruposTarefasGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint(
          'CODCOLIGADA',
          CODCOLIGADA.toString(),
          CODCOLIGADA.toString(),
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
        DatasetFactory.createConstraint(
          'IDPRJ',
          IDPRJ.toString(),
          IDPRJ.toString(),
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
      ],
      [],
    );

    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      console.log(JSON.parse(ds.values[0].RESULT));
      this.grupos.set(formatGrupos(JSON.parse(ds.values[0].RESULT)));
    }

    function formatGrupos(data: any) {
      var newGrupos: GruposTarefasInterface[] = [];
      for (const row of data) {
        newGrupos.push({
          cod_tarefa: row.CODTRF,
          des_tarefa: row.NOMETAREFA,
        });
      }

      return newGrupos;
    }
  }

  get getGrupos() {
    return this.grupos();
  }
  get getTarefas() {
    return this.tarefas();
  }
  tarefasPorGrupo(cod_grupo:string){
    var filterTarefas = this.tarefas().filter(e=>e.cod_grupo==cod_grupo);
    return this.tarefas().filter(e=>e.cod_grupo==cod_grupo);
  }
  get valorTotal() {
    var total = 0;
    for (const tarefa of this.tarefas()) {
      total += (tarefa.quantidade || 0) * tarefa.vlr_unitario;
    }
    return total;
  }
  lancaValorTeste(percent:number){
    var tarefas = this.tarefas();
    var newTarefas:TarefasInterface[] = [];

    for (const tarefa of tarefas) {
        newTarefas.push({
          cod_grupo:tarefa.cod_grupo,
          id_tarefa:tarefa.id_tarefa,
          cod_tarefa:tarefa.cod_tarefa,
          des_tarefa:tarefa.des_tarefa,
          quantidade_total:tarefa.quantidade_total,
          vlr_unitario:tarefa.vlr_unitario,
          un_medida:tarefa.un_medida,
          quantidade:(tarefa.quantidade_total*(percent/100)),
      });
    }

    this.tarefas.set(newTarefas);
    console.log(this.tarefas());  
  }

  saveData() {
    var tablename = 'tableProducao';

    var tarefas = this.tarefas();
    var data = [];
    console.log(tarefas);

    for (const tarefa of tarefas) {
      var row = [];

      for (const key in tarefa) {
        if (!Object.hasOwn(tarefa, key)) continue;
        const value = tarefa[key as keyof TarefasInterface];

        row.push({ name: key, value: value });
      }

      data.push(row);
    }

    console.log(data);
    this.fluigForm.updatePaiFilho(tablename, data);
  }
}
